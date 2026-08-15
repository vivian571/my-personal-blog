---
name: auto-shorts-pipeline-dev-plan
description: 短视频自动化流水线开发规范与代码骨架指南
---

# 短视频自动化流水线（Sprint 1）代码实现规范

本文档为 **Sprint 1: 核心渲染流水线（The Generator）** 的落地代码参考规范。

## 1. 项目依赖表 (`requirements.txt`)
```text
fastapi>=0.110.0
uvicorn[standard]>=0.28.0
sqlalchemy>=2.0.28
psycopg2-binary>=2.9.9
pydantic>=2.6.4
celery>=5.3.6
redis>=5.0.3
moviepy>=1.0.3
requests>=2.31.0
loguru>=0.7.2
python-dotenv>=1.0.1
```

## 2. Pydantic 校验模型 (`shared/schemas/script.py`)
```python
from pydantic import BaseModel, Field
from typing import List

class SceneSegment(BaseModel):
    scene_index: int = Field(..., description="分镜序号")
    narration: str = Field(..., description="旁白与台词")
    visual_prompt: str = Field(..., description="ComfyUI 生图提示词")
    duration: float = Field(default=3.0, description="预期时长（秒）")

class ScriptResult(BaseModel):
    title: str = Field(..., description="短视频标题")
    bgm_style: str = Field(default="lofi", description="配乐风格")
    scenes: List[SceneSegment] = Field(..., description="分镜列表")
```

## 3. Celery 音视频合成核心逻辑 (`worker/tasks_media.py`)
```python
from celery import Celery
import os

celery_app = Celery(
    "media_worker",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/1")
)

@celery_app.task(bind=True, max_retries=3, concurrency=1)
def render_video_pipeline(self, project_id: str, script_data: dict):
    """
    1. 依次调用 TTS 产生音频文件
    2. 调用 ComfyUI API 获取每镜画面/视频
    3. 利用 MoviePy/FFmpeg 压制字幕并合成成片
    """
    try:
        print(f"[*] Starting render for project: {project_id}")
        # 渲染与压制逻辑...
        return {"status": "success", "output_path": f"/data/media/{project_id}.mp4"}
```

## 4. 数据库 ORM 实体定义 (`apps/models/video.py`)
```python
import uuid
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class VideoProject(Base):
    __tablename__ = "video_projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    prompt_text = Column(Text, nullable=False)
    script_data = Column(JSONB, nullable=True)
    comfyui_workflow = Column(JSONB, nullable=True)
    status = Column(String(30), default="drafting", index=True)
    output_video_path = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## 5. FastAPI 核心控制路由 (`apps/api/v1/project.py`)
```python
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid
from typing import Optional

router = APIRouter(prefix="/api/v1/projects", tags=["Video Projects"])

class CreateProjectRequest(BaseModel):
    title: str
    prompt_text: str
    comfyui_workflow_id: Optional[str] = "default_workflow"

@router.post("")
def create_project(
    req: CreateProjectRequest,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key")
):
    """
    创建视频项目并返回唯一项目 ID，支持幂等校验
    """
    # 幂等校验逻辑与持久化...
    project_id = str(uuid.uuid4())
    return {
        "code": 200,
        "message": "Project created successfully",
        "data": {"project_id": project_id, "status": "drafting"}
    }
# 短视频自动化流水线（Sprint 2）代码实现规范

本文档追加 **Sprint 2: 自动发布与指纹浏览器整合 (The Publisher)** 的落地代码规范。

## 6. AdsPower 指纹浏览器 API 客户端 (`shared/clients/adspower.py`)
```python
import requests
from loguru import logger
from typing import Optional, Dict

class AdsPowerClient:
    def __init__(self, api_host: str = "http://local.adspower.net:50325"):
        self.api_host = api_host

    def start_browser(self, profile_id: str) -> Optional[Dict[str, str]]:
        """
        根据 Profile ID 启动 AdsPower 指纹浏览器，返回 WebSocket 调试端口与 CDP 地址
        """
        url = f"{self.api_host}/api/v1/browser/start?user_id={profile_id}"
        try:
            res = requests.get(url, timeout=10).json()
            if res.get("code") == 0:
                ws_endpoint = res["data"]["ws"]["puppeteer"]
                logger.info(f"[+] AdsPower 启动成功, Profile: {profile_id}, WS: {ws_endpoint}")
                return {
                    "ws": ws_endpoint,
                    "debug_port": res["data"]["debug_port"],
                    "webdriver": res["data"]["webdriver"]
                }
            logger.error(f"[-] AdsPower 启动失败: {res.get('msg')}")
            return None
        except Exception as e:
            logger.error(f"[-] AdsPower API 连接异常: {e}")
            return None

    def stop_browser(self, profile_id: str) -> bool:
        url = f"{self.api_host}/api/v1/browser/stop?user_id={profile_id}"
        try:
            res = requests.get(url, timeout=5).json()
            return res.get("code") == 0
        except Exception:
            return False
```

## 7. Playwright 自动化发布 Worker (`worker/tasks_browser.py`)
```python
import asyncio
from celery import Celery
from playwright.async_api import async_playwright
from shared.clients.adspower import AdsPowerClient
from loguru import logger

celery_app = Celery("browser_worker")

async def _async_publish_douyin(profile_id: str, video_path: str, title: str, tags: list):
    client = AdsPowerClient()
    info = client.start_browser(profile_id)
    if not info:
        raise RuntimeError(f"AdsPower Profile {profile_id} 启动失败")

    async with async_playwright() as p:
        # 连接至 AdsPower 实例的 CDP WebSocket
        browser = await p.chromium.connect_over_cdp(info["ws"])
        context = browser.contexts[0]
        page = context.pages[0] if context.pages else await context.new_page()

        try:
            logger.info("[*] 正在打开抖音创作者服务中心发稿页...")
            await page.goto("https://creator.douyin.com/creator-micro/content/upload")
            await page.wait_for_selector('input[type="file"]', timeout=30000)

            # 1. 上传视频
            await page.set_input_files('input[type="file"]', video_path)
            logger.info("[+] 视频上传中，等待解析过关...")

            # 2. 填写标题与话题
            full_title = f"{title} " + " ".join([f"#{t}" for t in tags])
            await page.fill('.zone-container [contenteditable="true"]', full_title)

            # 3. 点击发布按钮
            publish_btn = await page.wait_for_selector('button:has-text("发布")', timeout=60000)
            await publish_btn.click()

            logger.success(f"[+] 视频 {title} 自动发布指令触发完成！")
            await asyncio.sleep(5) # 缓冲网络提交
        finally:
            client.stop_browser(profile_id)

@celery_app.task(bind=True, max_retries=2)
def publish_video_task(self, profile_id: str, video_path: str, title: str, tags: list):
    """
    异步发布任务入口 (包装 asyncio 运行)
    """
    try:
        asyncio.run(_async_publish_douyin(profile_id, video_path, title, tags))
        return {"status": "success", "profile_id": profile_id}
    except Exception as e:
        logger.error(f"[-] 自动发布失败: {e}")
        raise self.retry(exc=e, countdown=30)
# 短视频自动化流水线（Sprint 3 & 4）代码实现规范

本文档追加 **Sprint 3: 状态流转编排 (The Orchestrator)** 与 **Sprint 4: 容器化落地 (The Infra)** 代码规范。

## 8. 状态流转与任务回调管理器 (`shared/utils/state_machine.py`)
```python
from enum import Enum
from typing import Optional
from loguru import logger

class ProjectStatus(str, Enum):
    DRAFTING = "drafting"
    RENDERING = "rendering"
    READY = "ready"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"

class StateMachine:
    ALLOWED_TRANSITIONS = {
        ProjectStatus.DRAFTING: [ProjectStatus.RENDERING, ProjectStatus.FAILED],
        ProjectStatus.RENDERING: [ProjectStatus.READY, ProjectStatus.FAILED],
        ProjectStatus.READY: [ProjectStatus.PUBLISHING, ProjectStatus.FAILED],
        ProjectStatus.PUBLISHING: [ProjectStatus.PUBLISHED, ProjectStatus.FAILED],
        ProjectStatus.FAILED: [ProjectStatus.RENDERING, ProjectStatus.PUBLISHING], # 允许失败重试
    }

    @classmethod
    def validate_transition(cls, current_status: ProjectStatus, target_status: ProjectStatus) -> bool:
        allowed = cls.ALLOWED_TRANSITIONS.get(current_status, [])
        if target_status in allowed:
            logger.info(f"[State Engine] 状态迁移合法: {current_status} -> {target_status}")
            return True
        logger.warning(f"[State Engine] 非法状态迁移拦截: {current_status} -> {target_status}")
        return False
```

## 9. Docker 完整服务编排 (`infra/docker-compose.yml`)
```yaml
version: '3.8'

services:
  api:
    build:
      context: ..
      dockerfile: infra/Dockerfile
    container_name: auto_shorts_api
    command: uvicorn apps.main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/auto_shorts
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  worker_media:
    build:
      context: ..
      dockerfile: infra/Dockerfile
    container_name: auto_shorts_worker_media
    command: celery -A worker.tasks_media.celery_app worker --loglevel=info -c 1
    environment:
      - DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/auto_shorts
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    container_name: auto_shorts_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: auto_shorts
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: auto_shorts_redis
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

