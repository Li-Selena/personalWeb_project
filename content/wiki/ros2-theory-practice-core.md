---
title: ROS2 理论与实践：核心篇学习导航
slug: ros2-theory-practice-core
category: ROS2 教程
tags:
  - ROS2
  - Humble
  - C++
  - Python
  - TF2
  - URDF
summary: 整理赵虚左《ROS2理论与实践——核心篇》的学习路线、章节目录与直达链接，覆盖通信机制、launch、rosbag2、TF2、RViz2 和 URDF。
createdAt: 2026-08-18
updatedAt: 2026-08-18
---

这是一份《ROS2理论与实践——核心篇》的学习导航。课程以案例为主线，围绕 ROS2 的通信机制和常用开发工具展开，适合在进入机器人导航、视觉、机械臂等应用方向之前系统学习。

> 本页只做目录整理、学习路线说明和原文链接索引，不转载课程全文。课程原作者为赵虚左；具体内容、代码与图片请以原始资料为准。

## 资料入口

- [核心篇课程简介与完整目录](https://www.tungchiahui.cn/docs/ros2/core/)
- [配套视频：ROS2 理论与实践](https://www.bilibili.com/video/BV1VB4y137ys)
- [应用篇学习导航](/wiki/ros2-theory-practice-application/)

## 课程环境与准备

| 项目 | 课程采用的环境 |
| --- | --- |
| ROS2 版本 | Humble |
| 操作系统 | Ubuntu 22.04 |
| 主要语言 | C++、Python |
| 辅助知识 | Linux、CMake、XML、YAML |
| ROS1 基础 | 不要求 |
| 实体硬件 | 核心篇不要求 |

课程基于 ROS2 Humble。使用 Jazzy、Kilted 或更新发行版时，包名、命令参数、Gazebo 版本和部分 API 可能不同，遇到差异时应同时查阅对应发行版的官方文档。

## 建议学习路线

1. 先完成第 1 章，搭好 ROS2、colcon 与编辑器环境。
2. 第 2 章是核心，依次掌握话题、服务、动作和参数。
3. 第 3 章补齐分布式、重映射、时间 API、命令行和 rqt 等实用能力。
4. 第 4 章学习用 launch 组织系统，并用 rosbag2 录制和回放数据。
5. 第 5 章集中学习 TF2 坐标变换，这是导航、感知和机械臂开发的共同基础。
6. 第 6 章用 RViz2、URDF 与 xacro 建立机器人模型和可视化调试流程。
7. 完成后继续学习[应用篇](/wiki/ros2-theory-practice-application/)。

## 第 1 章：ROS2 概述与环境搭建

[进入第 1 章](https://www.tungchiahui.cn/docs/ros2/core/chapter1.html)

- [1.1 ROS2 简介](https://www.tungchiahui.cn/docs/ros2/core/chapter1/11-ros2jian-jie.html)
- [1.2 ROS2 安装](https://www.tungchiahui.cn/docs/ros2/core/chapter1/12-ros2an-zhuang.html)
- [1.3 ROS2 快速体验](https://www.tungchiahui.cn/docs/ros2/core/chapter1/13-ros2kuai-su-ti-yan.html)
- [1.4 ROS2 集成开发环境搭建](https://www.tungchiahui.cn/docs/ros2/core/chapter1/14-ros2ji-cheng-kai-fa-huan-jing-da-jian.html)
- [1.5 ROS2 体系框架](https://www.tungchiahui.cn/docs/ros2/core/chapter1/15-ros2ti-xi-kuang-jia.html)
- [1.6 本章小结](https://www.tungchiahui.cn/docs/ros2/core/chapter1/16-ben-zhang-xiao-jie.html)

本章适合建立全局认识，并完成 ROS2、colcon、VS Code、终端和 Git 等基础环境配置。

## 第 2 章：ROS2 通信机制核心

[进入第 2 章](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin.html)

- [2.1 通信机制简介](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/21-jie-kou-xiao-xi.html)
- [2.2 话题通信](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/22-hua-ti-tong-xin.html)
- [2.3 服务通信](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/23-fu-wu-tong-xin.html)
- [2.4 动作通信](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/24-dong-zuo-tong-xin.html)
- [2.5 参数服务](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/25-can-shu-fu-wu.html)
- [2.6 本章小结](https://www.tungchiahui.cn/docs/ros2/core/di-2-zhang-ros2-tong-xin-ji-zhi-he-xin/28-ben-zhang-xiao-jie.html)

学习时建议为每种通信机制分别整理“适用场景、接口定义、发布端/服务端、订阅端/客户端、命令行验证”五项笔记，并同时完成 C++ 与 Python 示例。

## 第 3 章：ROS2 通信机制补充

[进入第 3 章](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong.html)

- [3.1 分布式](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/31-fen-bu-shi.html)
- [3.2 工作空间覆盖](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/32-gong-zuo-kong-jian-fu-gai.html)
- [3.3 元功能包](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/33-yuan-gong-neng-bao.html)
- [3.4 节点重名](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/34-jie-dian-zhong-ming.html)
- [3.5 话题重名](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/35-hua-ti-zhong-ming.html)
- [3.6 时间相关 API](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/36-chang-yong-api.html)
- [3.7 通信机制工具](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/37-tong-xin-ji-zhi-ming-ling.html)
- [3.8 通信机制实操](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/38-tong-xin-ji-zhi-lian-xi.html)
- [3.9 本章小结](https://www.tungchiahui.cn/docs/ros2/core/di-3-zhang-ros2-tong-xin-ji-zhi-bu-chong/39-ben-zhang-xiao-jie.html)

这一章适合边学边做小实验，重点验证节点与话题重映射、不同工作空间的覆盖关系、ROS 时间与系统时间，以及常用命令行工具的输出。

## 第 4 章：launch 与 rosbag2

[进入第 4 章](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt.html)

- [4.1 启动文件 launch 简介](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt/41-launch-jian-jie.html)
- [4.2 launch 的 Python 实现](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt/42-launchzhi-python-shi-xian.html)
- [4.3 launch 的 XML、YAML 实现](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt/43-launchzhi-xml-shi-xian.html)
- [4.4 录制回放工具 rosbag2](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt/44-rosbag2.html)
- [4.5 本章小结](https://www.tungchiahui.cn/docs/ros2/core/di-4-zhang-ros2-gong-ju-zhi-launch-rosbag2-yu-rqt/46-ben-zhang-xiao-jie.html)

建议优先掌握 Python launch 文件，再了解 XML 和 YAML 写法。rosbag2 部分应至少完成一次指定话题录制、信息查看、回放和回放速率调整。

## 第 5 章：坐标变换 TF2

[进入第 5 章](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan.html)

- [5.1 坐标变换简介](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/51-zuo-biao-bian-huan-jian-jie.html)
- [5.2 坐标相关消息](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/52-zuo-biao-xiao-xi.html)
- [5.3 坐标变换广播](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/53-zuo-biao-xi-guang-bo.html)
- [5.4 坐标变换监听](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/54-zuo-biao-xi-jian-ting.html)
- [5.5 坐标变换工具](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/55-tfgong-ju.html)
- [5.6 坐标变换实操](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/56-zuo-biao-bian-huan-shi-cao.html)
- [5.7 本章小结](https://www.tungchiahui.cn/docs/ros2/core/di-5-zhang-ros2-gong-ju-zhi-zuo-biao-bian-huan/57-ben-zhang-xiao-jie.html)

本章要建立“坐标系树”的思维。学习广播器和监听器时，同时用 `tf2_echo`、`view_frames` 和 RViz2 验证结果，比只阅读代码更容易发现父子坐标系和时间戳问题。

## 第 6 章：可视化、URDF 与 xacro

[进入第 6 章](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen.html)

- [6.1 可视化简介](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/61-gai-shu.html)
- [6.2 RViz2 基本使用](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/62-rviz2-ji-ben-shi-yong.html)
- [6.3 RViz2 集成 URDF 基本流程](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/63-urdfji-cheng-rviz2-ji-ben-liu-cheng.html)
- [6.4 URDF 使用语法](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/64-urdfyu-fa.html)
- [6.5 使用 xacro 优化 URDF](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/65-urdfyou-hua-xacro.html)
- [6.6 本章小结](https://www.tungchiahui.cn/docs/ros2/core/di-6-zhang-ros2-ji-qi-ren-jian-mo-yu-fang-zhen/66-ben-zhang-xiao-jie.html)

完成本章后，应能用 link、joint、visual、collision 和 inertial 描述基础机器人模型，并通过 xacro 宏和参数减少重复结构。

## 学完后的自检

- 能独立创建 `ament_cmake` 与 `ament_python` 功能包。
- 能根据场景选择话题、服务、动作或参数，并解释选择理由。
- 能用命令行检查节点、话题、接口、参数和动作。
- 能用 launch 启动多个节点并传入参数、重映射和命名空间。
- 能录制、查看和回放 rosbag2 数据。
- 能读懂并调试 TF2 坐标树。
- 能用 URDF/xacro 建模并在 RViz2 中显示。

## 来源说明

本导航根据[东澈的折腾天地 ROS2 教程推荐资料页](https://www.tungchiahui.cn/zh-cn/wiki/2023-12-30-ros2-tutorial/0100-ros2-jie-shao#%E6%8E%A8%E8%8D%90%E7%9A%84%E8%A7%86%E9%A2%91%E8%B5%84%E6%96%99%E4%B8%8E%E9%85%8D%E5%A5%97%E6%96%87%E6%A1%A3)及其链接的核心篇目录整理。页面内容和链接可能随原站更新而变化。
