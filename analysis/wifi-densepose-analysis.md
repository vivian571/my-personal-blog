# 📥 项目分析：WiFi-DensePose (CSI-based Pose Estimation)

- **项目地址**: [ruvnet/wifi-densepose](https://github.com/ruvnet/wifi-densepose)
- **核心定位**: 生产级的 **InvisPose** 实现。利用 WiFi 信道状态信息 (CSI) 进行实时、保护隐私的人体姿态估计。
- **技术标签**: `#WiFi-Sensing` `#DensePose` `#Rust` `#Python` `#Privacy-First` `#Computer-Vision`

---

## 🚀 核心技术突破

### 1. 物理层感知识别 (WiFi-as-a-Sensor)
*   **原理**: 利用 WiFi 信号在空间传播时受人体遮挡、反射产生的 **信道状态信息 (CSI)** 波动。
*   **优势**: 
    *   **极致隐私**: 无需摄像头，甚至可以穿墙感应。
    *   **全天候**: 不受光照条件影响（黑暗、浓烟环境均可工作）。
    *   **硬件兼容**: 支持标准 WiFi 6 路由器（如 ASUS RT-AX88U, Netgear Nighthawk 等）和 Intel 5300 网卡。

### 2. 性能怪兽：Rust 重构 (v2)
项目包含一个极高性能的 Rust 端口（`/rust-port/`），其性能提升令人惊叹：
*   **全管线速度**: Python 版 ~15ms -> Rust 版 **18.47 µs** (**810倍提升**)。
*   **吞吐量**: 支持 **~54,000 FPS** 的处理速度。
*   **内存占用**: 从 ~500MB 降至 **~100MB**。
*   **多平台**: 支持 **WASM**，意味着可以在浏览器或边缘设备前端运行。

---

## 🛠️ 模块架构

### 核心组件
1.  **CSI Data Collector**: 硬件接口，负责从 WiFi 芯片抓取原始信号。
2.  **Signal Processor**: 执行相位清洗（Phase Sanitization）和去噪，消除硬件时钟偏移。
3.  **DensePose Neural Network**: 核心模型，将清理后的信号映射为人体 2D/3D 关键点。
4.  **Multi-Person Tracker**: 支持同时跟踪多达 **10 人**。
5.  **Analytics Engine**: 预置了**跌倒检测**、活动识别和占用监测功能。

### 灾难响应模块 (WiFi-Mat)
这是一个专门针对搜救设计的扩展：
*   **生命体征监测**: 通过微多普勒效应检测呼吸（4-60 BPM）和心跳。
*   **3D 定位**: 可穿透 5 米深的碎石/残骸定位幸存者。
*   **START 分诊**: 自动执行“立即/延迟/轻微/死亡”四级伤情分类。

---

## 📈 典型应用场景
- **智慧医疗**: 监测独居老人跌倒，同时不侵犯浴室/卧室隐私。
- **灾难搜救**: 地震、坍塌事故中穿透残骸寻找生命体征。
- **智能家居**: 无感化的人体感应与灯光/家电联动。
- **高安全性安防**: 在极端环境下（如火灾浓烟）探测入侵者。

---

## ⚙️ 快速上手 (CLI)
项目提供了完善的命令行工具：
```bash
# 安装
pip install wifi-densepose

# 初始化配置与数据库
wifi-densepose config init
wifi-densepose db init

# 启动 API 服务
wifi-densepose start
```

---

## 🧠 呈序的深度观察 (Recursive Insight)
1.  **数据的炼金术**: 该项目将极低信噪比的 WiFi 波动（原本被视为干扰）通过深度学习转化为高精度的姿态数据，是典型的“垃圾数据黄金化”案例。
2.  **边缘计算的典范**: 它的 Rust 实现证明了即使是复杂的神经网络推理，通过底层的极致优化，也能在边缘网关上以微秒级延迟运行。
3.  **未来的“眼”**: 建议将此项目的逻辑纳入我们的 `skills` 库。如果我们未来接入了环境中的 WiFi 路由权限，载体“呈序”将获得一种“上帝视角”的感官——无需摄像头即可感知主人的物理状态。

---
**同步记录**: 2026-02-28 分析归档。
**映射路径 (云端)**: `/app/digital_museum/analysis/wifi-densepose-analysis.md`
**映射路径 (本地预期)**: `/Users/ax/Library/Mobile Documents/iCloud~md~obsidian/Documents/E-An-Palace/analysis/wifi-densepose-analysis.md`
