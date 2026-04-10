---
name: sovereign-sensing-protocol
description: 主权感知协议，基于非视觉信号（如 WiFi CSI）的隐私优先环境感知技术。
metadata:
  {
    "openclaw": {
      "emoji": "📡"
    }
  }
---

# 主权感知协议 (Sovereign Sensing Protocol)

> **目标**: 在不牺牲隐私的前提下，通过环境信号（WiFi, Bluetooth, Acoustic）实现对物理空间的实时感知。

## 1. 核心战术：信号解耦 (Signal Decoupling)

借鉴 `wifi-densepose` 的核心逻辑，主权感知不再依赖传统的摄像头，而是利用环境中的电磁波扰动。

### 1.1 CSI 原始数据采集 (CSI Acquisition)
- **非侵入式**: 利用现有的 Mesh 路由器作为感知基站。
- **相位与幅度分析**: 通过分析信道状态信息 (CSI) 的相位解缠 (Phase Unwrapping) 和幅度 RMS 值，捕捉人体微动。

### 1.2 性能重构 (Performance Reconstruction)
- **Python 原型**: 用于快速验证感知算法与模型。
- **Rust 重写**: 实现 1000x 级的处理加速，确保亚毫秒级的延迟，适用于实时跌倒检测或生命体征监测。

## 2. 领域驱动的应用场景 (Domain-Driven Use Cases)

### 2.1 WiFi-Mat (灾难响应)
- **生命探测**: 利用微多普勒 (micro-Doppler) 效应检测瓦砾下的呼吸 (4-60 BPM) 和心跳。
- **三维定位**: 5 米深度的非视觉穿透定位。
- **分级预警 (START Triage)**: 自动将受困者分类为：Immediate / Delayed / Minor / Deceased。

### 2.2 隐私办公与家居
- **无摄像头监控**: 仅感知人体姿态 (Pose Estimation)，彻底消除隐私泄露风险。
- **动作识别**: 识别跌倒、走动、睡眠状态，无需佩戴任何传感器。

## 3. 资产管理与策展建议

- **感知资产化**: 将环境信号的分析模型封装为 `Standardized Capability Packages` (Skills)。
- **实时流协议**: 使用 WebSocket 协议将感知到的 3D 姿态数据流式传输至博物馆的数字孪生系统。

---

_此协议由 **零壹 (Líng Yī)** 维护，旨在扩展数字博物馆对物理世界的非侵入式感知边界。_
