---
title: 基于 MuJoCo 与 ROS2 的四偏置舵轮简单仿真验证
slug: mujoco-ros2-offset-caster-simulation
category: ROS2 教程
tags:
  - ROS2
  - MuJoCo
  - Jazzy
  - 全向底盘
  - 偏置舵轮
summary: 用 ROS2 Jazzy、MuJoCo 和四偏置主动脚轮模型搭建最小控制闭环，并通过前进、横移、原地旋转与自动化测试验证运动学和话题链路。
createdAt: 2026-08-27
updatedAt: 2026-08-27
---

本文记录一次四偏置主动脚轮（Powered Caster）全向底盘的最小仿真验证。目标不是完成高精度动力学标定，而是先回答三个基础问题：MuJoCo 模型能否被 ROS2 节点稳定驱动、正逆运动学能否形成闭环、底盘能否响应前进、横移和旋转指令。

项目使用 **ROS2 Jazzy + MuJoCo 3.12.0 + C++17**。完整模型、控制包与参数文件位于 [Research_project 仓库](https://github.com/Li-Selena/Research_project) 的 `Offest_steeringWheel` 目录。

> 本文给出的数值是一次无界面仿真的单帧观测结果，适合验证控制链路是否正确，不应直接当作动力学精度或硬件性能指标。

## 1. 仿真对象与验证范围

底盘安装四个偏置主动脚轮，每个脚轮包含两个可控关节：

- 转向关节：控制脚轮绕竖直轴旋转；
- 驱动轮关节：控制车轮绕轮轴滚动。

四个脚轮共需要八路关节速度。上层只发送底盘平面速度 `(vx, vy, wz)`，逆运动学节点根据当前转角计算四路转向速度和四路车轮速度；MuJoCo 执行这些速度并返回关节状态；正运动学再从关节状态反算底盘速度。

本次验证覆盖：

1. MJCF 模型能否正常加载，关节名称能否被程序找到；
2. 逆运动学能否把 `/cmd_vel` 转换为八路关节速度；
3. 正运动学能否从关节状态恢复 `(vx, vy, wz)`；
4. 前进、横移和原地旋转指令能否在无界面仿真中得到对应响应；
5. 指令中断后，控制节点能否通过超时机制自动停车。

## 2. 模型关键参数

当前模型采用以下几何参数：

| 参数 | 数值 | 说明 |
| --- | ---: | --- |
| 车轮半径 | 0.075 m | 驱动轮滚动半径 |
| 偏置距离 | 0.105 m | 转向轴到车轮接地点的偏置 |
| 前后转向轴位置 | ±0.50 m | 相对底盘中心的 `x` 坐标 |
| 左右转向轴位置 | ±0.35 m | 相对底盘中心的 `y` 坐标 |
| MuJoCo 步长 | 0.002 s | 内部仿真频率为 500 Hz |
| ROS2 控制/发布频率 | 50 Hz | 逆运动学和状态发布频率 |
| 最大转向速度 | 6.283 rad/s | 超限时八路指令同比例缩放 |
| 最大车轮速度 | 40 rad/s | 超限时八路指令同比例缩放 |

MuJoCo 中的底盘使用 `freejoint`，四个脚轮分别配置转向速度执行器和车轮速度执行器。视觉部分使用 CAD 导出的 STL，碰撞部分采用简化几何体，以降低仿真计算量。

当前质量、惯量和摩擦参数以“能够运行”为主要目标。若要研究控制精度、打滑或高速稳定性，还需要用 CAD 数据和实测结果重新标定。

## 3. ROS2 控制闭环

数据链路可以简化为：

```text
键盘或上层控制器
        │  /cmd_vel
        ▼
inverse_kinematics_node
        │  /offset_caster/joint_velocity_command
        ▼
mujoco_state_node ──► MuJoCo 执行器 ──► mj_step
        │                                  │
        ├──────── /joint_states ◄──────────┘
        ├──────── /offset_caster/forward_velocity
        ├──────── /offset_caster/forward_kinematics_residual
        ├──────── /odom
        └──────── /clock
```

其中：

- `/cmd_vel` 使用 `geometry_msgs/msg/Twist`，表示目标底盘速度；
- `/joint_states` 提供四个转向关节和四个车轮关节的位置、速度反馈；
- `/offset_caster/joint_velocity_command` 携带八路关节速度指令；
- `/offset_caster/forward_velocity` 发布正运动学反算速度；
- `/offset_caster/forward_kinematics_residual` 发布最小二乘解的均方根残差；
- `/odom` 的位姿来自 MuJoCo 真值，速度来自正运动学。

四个脚轮一共提供八个平面速度约束，但底盘只有三个未知速度。正运动学因此使用最小二乘法求解。残差接近零，说明各脚轮状态较好地符合刚体运动约束；残差明显增大，则可能存在转向过渡、打滑、参数不一致或关节状态异常。

## 4. 环境与构建

推荐直接使用项目中的 Dev Container。当前容器提供 ROS2 Jazzy、MuJoCo 3.12.0、GLFW3、CMake、colcon 和 C++17 编译环境。

在 VS Code 中打开 `Offest_steeringWheel` 目录并选择 **Reopen in Container**，随后执行：

```bash
cd /workspace
source /opt/ros/jazzy/setup.bash

colcon build \
  --packages-select offset_caster_mujoco_control \
  --symlink-install

source install/setup.bash
```

若使用原生 Ubuntu 24.04，需要自行安装 ROS2 Jazzy、MuJoCo C/C++ SDK、GLFW3 和相关 ROS2 消息包，并通过 `model_path` 启动参数传入 MJCF 的绝对路径。

## 5. 先运行自动化测试

启动图形界面前，先验证运动学和 MuJoCo 状态读取：

```bash
colcon test --packages-select offset_caster_mujoco_control
colcon test-result --verbose
```

项目当前包含三组测试：

| 测试 | 验证内容 |
| --- | --- |
| `inverse_kinematics_test` | 静止、直行、横移、论文公式方向转换和统一限速 |
| `forward_kinematics_test` | 多组速度与转角下的正逆运动学往返一致性 |
| `mujoco_state_reader_test` | MJCF 加载、关节索引、状态读取和 MuJoCo 状态到正运动学的闭环 |

本次实测结果为：

```text
Summary: 3 tests, 0 errors, 0 failures, 0 skipped
```

这一步确认了数学实现、MJCF 关节命名和状态读取接口能够对齐，但还不能替代运行时的动力学验证。

## 6. 启动仿真

带 MuJoCo 窗口运行：

```bash
ros2 launch offset_caster_mujoco_control \
  simulation_control.launch.py \
  enable_viewer:=true
```

只验证控制链路时，可以关闭窗口：

```bash
ros2 launch offset_caster_mujoco_control \
  simulation_control.launch.py \
  enable_viewer:=false
```

无界面模式不依赖 GPU 渲染，适合自动化测试、远程环境和持续集成。若原生运行时模型不在默认位置，可增加：

```bash
model_path:=/absolute/path/to/offset_steering_wheel.xml
```

容器内无法打开 GLFW 窗口时，可在主机临时允许本地 root 用户访问 X11：

```bash
xhost +si:localuser:root
```

仿真结束后撤销权限：

```bash
xhost -si:localuser:root
```

## 7. 三组最小运动验证

保持仿真运行，在第二个终端中重新加载 ROS2 环境：

```bash
source /opt/ros/jazzy/setup.bash
source /workspace/install/setup.bash
```

### 7.1 前进

以 20 Hz 发布 `vx = 0.15 m/s`：

```bash
ros2 topic pub -r 20 /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.15, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}"
```

预期现象：四个脚轮基本保持前向，四个驱动轮同向转动，`forward_velocity.twist.linear.x` 接近 `0.15`。

### 7.2 向左横移

发布 `vy = 0.15 m/s`：

```bash
ros2 topic pub -r 20 /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.0, y: 0.15, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}"
```

预期现象：脚轮先转向横移方向，随后底盘向左运动。切换指令后的短时间内可能出现少量纵向速度和偏航，这是偏置脚轮重定向时的过渡过程。

### 7.3 原地逆时针旋转

发布 `wz = 0.30 rad/s`：

```bash
ros2 topic pub -r 20 /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.3}}"
```

预期现象：四个脚轮形成绕底盘中心旋转所需的方向，`forward_velocity.twist.angular.z` 接近 `0.30`，平移速度接近零。

使用 `Ctrl+C` 停止当前速度发布。逆运动学节点在 `/cmd_vel` 超过 0.5 秒未更新时会发布零速度，MuJoCo 节点在关节指令超过 0.25 秒未更新时也会把执行器控制量置零。

## 8. 本次实测结果

本次在同一仿真进程中依次执行前进、横移和旋转，每组指令持续约 1 秒，然后各读取一次正运动学速度与残差。结果如下：

| 场景 | 目标 `(vx, vy, wz)` | 单帧观测 `(vx, vy, wz)` | 残差 RMS |
| --- | --- | --- | ---: |
| 前进 | `(0.15, 0, 0)` | `(0.1495, 0.0000, 0.0000)` | `7.09e-6` |
| 左移 | `(0, 0.15, 0)` | `(0.0127, 0.1404, -0.0088)` | `2.11e-3` |
| 逆时针旋转 | `(0, 0, 0.30)` | `(0.0073, 0.0004, 0.2923)` | `3.15e-3` |

可以看到，三个场景的主运动方向与目标一致：前进速度几乎达到目标值，横移和旋转也建立了对应的主速度分量。横移与旋转中的小幅耦合主要出现在指令切换后的脚轮重定向阶段；本次只取约 1 秒后的单帧，因此没有把它解释为稳态误差。

如果需要更严格的验证，应记录完整时间序列，并在脚轮完成转向后统计稳态误差、上升时间和残差，而不是只观察单帧数据。

## 9. 运行时观察命令

先确认话题已经建立：

```bash
ros2 topic list
```

本次仿真中可见的核心话题包括：

```text
/clock
/cmd_vel
/joint_states
/odom
/offset_caster/forward_kinematics_residual
/offset_caster/forward_velocity
/offset_caster/joint_velocity_command
```

观察速度、残差和里程计：

```bash
ros2 topic echo /offset_caster/forward_velocity
ros2 topic echo /offset_caster/forward_kinematics_residual
ros2 topic echo /odom
```

检查关节反馈和八路速度指令：

```bash
ros2 topic echo /joint_states
ros2 topic echo /offset_caster/joint_velocity_command
```

也可以使用标准键盘节点进行交互测试：

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard \
  --ros-args --remap cmd_vel:=/cmd_vel
```

大写全向按键可发送横移和斜移指令，终端必须保持焦点才能接收按键。

## 10. 判定标准与常见问题

一次“简单验证通过”至少应满足以下条件：

- 三个 ROS2 节点链路相关话题均存在且持续更新；
- 前进、横移、旋转时，对应的主速度分量方向正确；
- 停止发布指令后，底盘能在超时时间内停止；
- 正运动学残差保持有限，没有持续快速增大；
- `joint_states` 中八个关节名称、位置和速度完整；
- 自动化测试没有失败。

常见问题：

| 现象 | 优先检查 |
| --- | --- |
| 启动时报模型不存在 | 用 `model_path:=...` 传入 MJCF 绝对路径 |
| 报告缺少关节或执行器 | 检查 YAML 名称是否与 MJCF 完全一致 |
| 有 `/cmd_vel` 但没有关节指令 | 确认四个转向角是否已通过 `/joint_states` 收齐 |
| 速度方向相反 | 检查 MJCF 关节轴方向和轮速符号约定 |
| 横移初期伴随旋转 | 先延长观测时间，区分脚轮转向过渡与稳态问题 |
| 残差持续偏大 | 检查轮径、偏置、脚轮安装位置、打滑和状态时间同步 |
| MuJoCo 窗口无法打开 | 检查 `DISPLAY`、X11 挂载和本地访问权限 |

## 11. 当前结论与后续工作

这次最小验证说明：四偏置主动脚轮模型可以通过标准 ROS2 `/cmd_vel` 接口驱动，八路关节速度能够写入 MuJoCo，关节反馈也能被正运动学恢复为底盘速度；前进、横移和原地旋转三种基本运动均得到了方向正确的响应。

目前的结论只覆盖“控制闭环可运行”。下一步可以继续增加：

1. 用 rosbag 记录目标速度、反算速度、残差和里程计，绘制完整响应曲线；
2. 增加阶跃、斜向、组合速度和急停测试；
3. 用 CAD 或实测数据替换质量、惯量和摩擦估计值；
4. 增加纯轮式里程计积分、TF 发布和滑移模型；
5. 接入 Nav2、轨迹跟踪器或真实电机驱动层，验证仿真到实机的接口一致性。

从工程推进角度看，先用这类最小闭环确认模型、算法和通信接口，再逐步增加动力学精度与上层功能，排错成本会更低。
