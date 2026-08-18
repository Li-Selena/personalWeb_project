---
title: ROS2 理论与实践：应用篇学习导航
slug: ros2-theory-practice-application
category: ROS2 教程
tags:
  - ROS2
  - Humble
  - Navigation2
  - OpenCV
  - Gazebo
  - MoveIt2
summary: 整理赵虚左《ROS2理论与实践——应用篇》的学习路线、章节目录与直达链接，覆盖机器人硬件、仿真、导航、视觉、语音、无人驾驶和机械臂。
createdAt: 2026-08-18
updatedAt: 2026-08-18
---

这是一份《ROS2理论与实践——应用篇》的学习导航。应用篇承接核心篇的通信与工具知识，进一步进入传感器、机器人仿真、Navigation2、OpenCV、智能语音、无人驾驶和机械臂等应用方向。

> 本页只做目录整理、学习路线说明和原文链接索引，不转载课程全文。课程原作者为赵虚左；具体内容、代码与图片请以原始资料为准。

## 资料入口

- [应用篇课程简介与完整目录](https://www.tungchiahui.cn/docs/ros2/application/)
- [配套视频：ROS2 理论与实践](https://www.bilibili.com/video/BV1VB4y137ys)
- [核心篇学习导航](/wiki/ros2-theory-practice-core/)

## 课程环境与准备

| 项目 | 课程采用的环境 |
| --- | --- |
| ROS2 版本 | Humble |
| 操作系统 | Ubuntu 22.04 |
| 主要语言 | C++、Python |
| 建议前置内容 | 核心篇中的通信、launch、TF2、RViz2、URDF |
| ROS1 基础 | 不要求 |
| 实体硬件 | 课程简介不作硬性要求；传感器章节有硬件时更便于验证 |

应用篇包含跨领域内容，不必一次学完。建议先完成机器人仿真和导航主线，再按项目需要选择视觉、语音、无人驾驶或机械臂方向。

## 建议学习路线

1. 先完成[核心篇](/wiki/ros2-theory-practice-core/)，至少掌握节点通信、launch、TF2、RViz2 和 URDF。
2. 第 1～2 章建立机器人硬件与传感器接入能力。
3. 第 3 章在仿真环境中复现机器人模型、传感器和运动控制。
4. 第 4 章作为主线学习 SLAM、地图、AMCL 和 Navigation2。
5. 第 5 章学习 ROS2 图像消息与 OpenCV 之间的数据桥接。
6. 第 6～8 章按项目方向选学语音、无人驾驶或 MoveIt2 机械臂。

## 第 1 章：ROS2 功能点

[进入第 1 章](https://www.tungchiahui.cn/docs/ros2/application/chapter1.html)

- [1.1 机器人组成](https://www.tungchiahui.cn/docs/ros2/application/chapter1/11-ji-qi-ren-zu-cheng.html)
- [1.2 控制系统之远程开发环境](https://www.tungchiahui.cn/docs/ros2/application/chapter1/11-chuan-gan-qi-zhi-xiang-ji.html)
- [1.3 控制系统之外接 USB 设备](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-kong-zhi-xi-tong-zhi-ji-ben-pei-zhi.html)
- [1.4 硬件平台](https://www.tungchiahui.cn/docs/ros2/application/chapter1/12-di-pan-qu-dong.html)
- [1.5 传感器之激光雷达](https://www.tungchiahui.cn/docs/ros2/application/chapter1/14-chuan-gan-qi-zhi-lei-da.html)
- [1.6 传感器之相机](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-chuan-gan-qi-zhi-she-xiang-tou.html)
- [1.7 传感器之 IMU](https://www.tungchiahui.cn/docs/ros2/application/chapter1/16-chuan-gan-qi-zhi-imu.html)
- [1.8 传感器之 GNSS](https://www.tungchiahui.cn/docs/ros2/application/chapter1/17-chuan-gan-qi-zhi-gps.html)
- [1.9 本章小结](https://www.tungchiahui.cn/docs/ros2/application/chapter1/19-ben-zhang-xiao-jie.html)

本章的重点不是记住某一品牌设备的驱动命令，而是掌握通用接入流程：设备识别、权限与串口规则、驱动启动、话题检查、消息类型确认、坐标系和时间戳验证。

## 第 2 章：ROS2 功能点进阶

[进入第 2 章](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ros2-gong-neng-dian-jin-jie.html)

- [2.1 轮式里程计标定与融合](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-chuan-gan-qi-zhi-she-xiang-tou/21-li-cheng-ji-biao-ding-yu-rong-he.html)
- [2.2 激光雷达工具](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-chuan-gan-qi-zhi-she-xiang-tou/22-ji-guang-lei-da-gong-ju.html)
- [2.3 相机使用进阶](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-chuan-gan-qi-zhi-she-xiang-tou/23-xiang-ji-jin-jie.html)
- [2.4 本章小结](https://www.tungchiahui.cn/docs/ros2/application/chapter1/13-chuan-gan-qi-zhi-she-xiang-tou/24-ben-zhang-xiao-jie.html)

建议把标定参数、坐标系、发布频率、协方差和异常数据处理纳入统一检查清单，为后续 SLAM 与定位排除传感器层问题。

## 第 3 章：机器人仿真

[进入第 3 章](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ji-qi-ren-fang-zhen.html)

- [3.1 ROS2 仿真概述](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ji-qi-ren-fang-zhen/21.html)
- [3.2 stage_ros2 仿真器](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ji-qi-ren-fang-zhen/32-stageros2-fang-zhen-qi.html)
- [3.3 Ignition Gazebo 仿真器](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ji-qi-ren-fang-zhen/33-ignition-gazebofang-zhen-qi.html)
- [3.4 本章小结](https://www.tungchiahui.cn/docs/ros2/application/di-2-zhang-ji-qi-ren-fang-zhen/34-ben-zhang-xiao-jie.html)

Gazebo 的产品名称、包名和桥接方式在不同 ROS2 发行版之间变化较大。课程使用 Humble 环境，迁移到更新版本时应先确认对应的 Gazebo 发行版和 `ros_gz` 兼容关系。

## 第 4 章：机器人导航

[进入第 4 章](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang.html)

- [4.1 导航概述](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/31.html)
- [4.2 SLAM](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/42.html)
- [4.3 地图服务](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/43.html)
- [4.4 AMCL 定位](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/44.html)
- [4.5 导航服务器](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/45-nav2he-xin.html)
- [4.6 多车编队](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/46-duo-che-bian-dui.html)
- [4.7 本章小结](https://www.tungchiahui.cn/docs/ros2/application/di-3-zhang-dao-hang/47-ben-zhang-xiao-jie.html)

导航主线可以按“传感器与 TF → 里程计 → SLAM 建图 → 地图保存与加载 → AMCL 定位 → Navigation2 规划与控制”推进。每一步都应先验证输入数据，再排查上层算法参数。

## 第 5 章：机器视觉

[进入第 5 章](https://www.tungchiahui.cn/docs/ros2/application/di-6-zhang-opencv.html)

- [5.1 概述](https://www.tungchiahui.cn/docs/ros2/application/di-6-zhang-opencv/41.html)
- [5.2 OpenCV 内置 API](https://www.tungchiahui.cn/docs/ros2/application/di-6-zhang-opencv/opencvnei-zhi-api.html)
- [5.3 图像互转](https://www.tungchiahui.cn/docs/ros2/application/di-6-zhang-opencv/41/53-tu-xiang-hu-zhuan.html)

学习重点是理解 ROS2 图像消息、编码格式和 OpenCV 矩阵之间的转换，并通过 `image_transport`、`cv_bridge` 和 RViz2/图像工具完成数据链路验证。

## 第 6 章：智能语音

[进入第 6 章](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin.html)

- [6.1 智能语音概述](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/51.html)
- [6.2 讯飞语音 SDK 基本使用](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/62-zhi-neng-yu-yin-ji-ben-shi-yong.html)
- [6.3 讯飞语音 SDK 与 ROS2 集成](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/63-xun-fei-yu-yin-sdk-yu-ros2-ji-cheng.html)
- [6.4 百度飞桨 PaddleSpeech 基本使用](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/64-bai-du-fei-jiang-paddlespeech-ji-ben-shi-yong.html)
- [6.5 PaddleSpeech 与 ROS2 集成](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/65-bai-du-fei-jiang-paddlespeech-yu-ros2-ji-cheng.html)
- [6.6 智能语音应用实例](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/64-zhi-neng-yu-yin-ying-yong-shi-li.html)
- [6.7 本章小结](https://www.tungchiahui.cn/docs/ros2/application/di-8-zhang-ji-qi-yu-yin/67-ben-zhang-xiao-jie.html)

第三方 SDK 的账号、接口和依赖版本可能变化。实践前应先查阅对应厂商的最新文档，并避免把 API 密钥提交到公开仓库。

## 第 7 章：无人驾驶

[进入第 7 章](https://www.tungchiahui.cn/docs/ros2/application/di-4-zhang-autoware.html)

本章面向无人驾驶与 Autoware 方向。建议在掌握 TF2、传感器标定、点云、定位和 Navigation2 的基础上选学。

## 第 8 章：机械臂

[进入第 8 章](https://www.tungchiahui.cn/docs/ros2/application/di-5-zhang-moveit.html)

本章面向机械臂与 MoveIt2 方向。建议先熟悉 URDF/xacro、关节状态、TF2 和 ROS2 控制接口，再进入运动规划与执行。

## 按项目选择内容

| 项目目标 | 优先章节 |
| --- | --- |
| 移动机器人底盘与传感器接入 | 第 1、2 章 |
| 仿真机器人 | 第 3 章，并复习核心篇 URDF/TF2 |
| SLAM 与 Navigation2 | 第 1～4 章 |
| ROS2 机器视觉 | 第 1、2、5 章 |
| 语音交互机器人 | 第 6 章，并复习话题、服务和动作 |
| 无人驾驶 | 第 1～5、7 章 |
| MoveIt2 机械臂 | 第 8 章，并复习核心篇 TF2、URDF/xacro |

## 学完后的自检

- 能把激光雷达、相机、IMU 或 GNSS 驱动接入 ROS2，并验证话题与坐标系。
- 能在仿真环境中加载机器人与传感器并完成基础运动控制。
- 能解释 SLAM、地图服务、AMCL 与 Navigation2 的输入输出关系。
- 能在 ROS2 图像消息与 OpenCV 数据之间转换。
- 能根据项目方向继续进入语音、Autoware 或 MoveIt2，而不是只停留在示例运行。

## 来源说明

本导航根据[东澈的折腾天地 ROS2 教程推荐资料页](https://www.tungchiahui.cn/zh-cn/wiki/2023-12-30-ros2-tutorial/0100-ros2-jie-shao#%E6%8E%A8%E8%8D%90%E7%9A%84%E8%A7%86%E9%A2%91%E8%B5%84%E6%96%99%E4%B8%8E%E9%85%8D%E5%A5%97%E6%96%87%E6%A1%A3)及其链接的应用篇目录整理。页面内容、第三方 SDK 和链接可能随原站更新而变化。
