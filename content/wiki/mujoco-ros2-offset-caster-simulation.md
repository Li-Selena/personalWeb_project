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
  - Qt
summary: 搭建 ROS2 Jazzy 与 MuJoCo 四偏置主动脚轮仿真，验证六种高层运动模式、Qt 位置控制、实时曲线、IMU、TF 和安全停止链路。
createdAt: 2026-08-27
updatedAt: 2026-08-29
---

本文记录四偏置主动脚轮（Powered Caster）全向底盘从“基础速度闭环”升级到“多模式控制与仿真监测”的完整验证过程。新版工程在原有 MuJoCo 模型、正逆运动学和 `/cmd_vel` 控制链路之上，增加了六种高层运动模式、Qt 目标位置控制台、独立实时曲线窗口、IMU、TF 与端到端集成测试。

项目使用 **ROS2 Jazzy + MuJoCo 3.12.0 + C++17 + Python/Qt**。模型、控制包、消息接口与诊断资料位于 [Research_project 仓库](https://github.com/Li-Selena/Research_project) 的 `Offest_steeringWheel` 目录。

![MuJoCo 中的四偏置主动脚轮全向底盘模型](/media/wiki/offset-caster/offset-caster-mujoco-model.png)

## 1. 完整演示视频

下面的视频同时展示 MuJoCo 仿真、Qt 位置控制台、独立曲线监测窗口和 ROS2 运行状态，覆盖键盘速度控制、组合运动、世界位置控制、动态 Yaw 和安全停止。

[多模式控制与仿真监测演示（约 3 分钟）](/media/wiki/offset-caster/multi-mode-control-simulation-monitoring.mp4 "/media/wiki/offset-caster/multi-mode-control-simulation-monitoring-poster.jpg")

建议重点观察：

- 机器人系纵向、横向速度下的舵角和轮速分配；
- 平移与旋转同时非零时，底盘连续走弧线而不是分步运动；
- 世界位置目标执行期间，位置误差和 Yaw 误差逐步收敛；
- 固定 Yaw 与动态 Yaw 两种位置模式的姿态变化差异；
- 停止后四路轮速快速回零，舵角保持在停止瞬间的位置。

## 2. 新版工程组成

新版 ROS2 工作区包含三个功能包：

```text
src/
├── offset_caster_interfaces/       # MotionCommand / MotionStatus 自定义消息
├── offset_caster_mujoco_control/   # 运动学、MuJoCo、六模式控制器、IMU 与 TF
└── offset_caster_dashboard/        # Qt 位置控制台与独立曲线监测
```

与最初版本相比，主要新增内容如下：

| 新增能力 | 作用 |
| --- | --- |
| `motion_controller_node` | 把世界系/机器人系速度或世界位置目标转换为平滑 `/cmd_vel` |
| 六种运动模式 | 组合坐标系、速度/位置和固定/动态 Yaw 控制 |
| `MotionCommand` / `MotionStatus` | 传递高层命令、状态、误差和最终输出速度 |
| Qt 目标位置控制台 | 输入世界系目标 `X/Y/Yaw`，显示姿态、误差与实时命令 |
| 独立曲线监测 | 20 秒滚动显示位置/Yaw 误差、四路舵角和四路轮速 |
| `/imu/data` | 发布底盘中心姿态、角速度和线加速度 |
| `/tf`、`/tf_static` | 发布 `world → base_link → imu_link` 坐标关系 |
| 集成测试 | 在无界面 MuJoCo 中验证组合速度与两种位置模式 |

## 3. 模型与运动学参数

每个偏置主动脚轮包含一个转向关节和一个驱动轮关节。四个脚轮一共需要八路关节速度，但上层仍只需要给出底盘平面速度 `(vx, vy, wz)`。

当前关键参数为：

| 参数 | 数值 | 说明 |
| --- | ---: | --- |
| 车轮半径 | 0.075 m | 驱动轮滚动半径 |
| 偏置距离 | 0.105 m | 转向轴到车轮接地点的偏置 |
| 前后转向轴位置 | ±0.50 m | 相对底盘中心的 `x` 坐标 |
| 左右转向轴位置 | ±0.35 m | 相对底盘中心的 `y` 坐标 |
| MuJoCo 步长 | 0.002 s | 内部仿真频率 500 Hz |
| ROS2 控制频率 | 50 Hz | 运动控制、逆运动学与状态发布 |
| 最大转向速度 | 6.283 rad/s | 超限时八路指令同比例缩放 |
| 最大车轮速度 | 40 rad/s | 超限时八路指令同比例缩放 |

逆运动学根据当前舵角和目标 `(vx, vy, wz)` 计算四路舵速与四路轮速。正运动学使用八个脚轮约束求解三个底盘速度，并发布均方根残差。残差接近零说明脚轮状态较符合刚体运动约束；持续增大则可能来自转向过渡、打滑、参数不一致或状态异常。

当前质量、惯量和摩擦参数仍以“完成控制闭环验证”为主要目标，不能直接代替真实样机标定数据。

## 4. ROS2 数据链路

完整控制链路如下：

```text
Qt 位置控制台
    │ /offset_caster/motion_command
    ▼
motion_controller_node ───────────────┐
    │ /cmd_vel                        │ /offset_caster/motion_status
    ▼                                 ▼
inverse_kinematics_node        Qt 控制台 / 曲线监测
    │ /offset_caster/joint_velocity_command
    ▼
mujoco_state_node ──► MuJoCo 执行器与 mj_step
    │
    ├── /joint_states ─────────► 逆运动学 / 曲线监测
    ├── /offset_caster/forward_velocity
    ├── /offset_caster/forward_kinematics_residual
    ├── /odom ─────────────────► 高层控制器 / Qt 控制台
    ├── /imu/data ─────────────► 高层控制器 / Qt 控制台
    ├── /tf、/tf_static
    └── /clock

teleop_twist_keyboard ──► /cmd_vel
```

键盘速度控制直接发布 `/cmd_vel`。Qt 位置控制先发布高层 `MotionCommand`，再由 `motion_controller_node` 闭环生成 `/cmd_vel`。两种入口最终共用逆运动学和 MuJoCo 执行链路。

> 切换控制入口前必须先停车：键盘按 `k`，或在 Qt 控制台点击“停止”，避免多个节点同时竞争 `/cmd_vel`。

## 5. 六种高层运动模式

`MotionCommand` 定义了停止之外的六种运动模式：

| 模式 | `x/y` 含义 | Yaw 控制 | 典型用途 |
| --- | --- | --- | --- |
| 世界速度 · 固定 Yaw | 世界系 `vx/vy` | 闭环保持绝对目标 Yaw | 沿地图方向移动并保持朝向 |
| 世界速度 · 动态 Yaw | 世界系 `vx/vy` | 直接给定 `yaw_rate` | 世界系平移与连续旋转 |
| 机器人速度 · 固定 Yaw | 机器人系 `vx/vy` | 闭环保持绝对目标 Yaw | 机体系移动并锁定朝向 |
| 机器人速度 · 动态 Yaw | 机器人系 `vx/vy` | 直接给定 `yaw_rate` | 键盘式全向组合运动 |
| 世界位置 · 固定 Yaw | 世界系绝对 `x/y` | 全程保持目标 Yaw | 定点平移、姿态不随路径改变 |
| 世界位置 · 动态 Yaw | 世界系绝对 `x/y` | 随位置进度平滑过渡到最终 Yaw | 位置和姿态同步到达 |

控制器会统一执行：

- 线速度幅值限制：默认 `0.5 m/s`；
- 角速度限制：默认 `0.8 rad/s`；
- 线加速度限制：默认 `1.0 m/s²`；
- 角加速度限制：默认 `2.0 rad/s²`；
- 位置误差和最短角 Yaw 误差闭环；
- 目标容差与持续到达判定；
- 非有限命令、超时状态和无效模式检查。

Qt 控制台目前只暴露两种世界位置模式；速度控制继续使用键盘终端。控制器核心和自定义消息保留全部六种模式，便于后续接入规划器或其他上层节点。

## 6. 构建与启动

推荐使用工程提供的 Dev Container，容器内包含 ROS2 Jazzy、MuJoCo 3.12.0、GLFW3、Qt 绑定、CMake、colcon 和中文字体。

进入容器后构建全部三个包：

```bash
cd /workspace
source /opt/ros/jazzy/setup.bash

colcon build --symlink-install
source install/setup.bash
```

启动完整系统：

```bash
ros2 launch offset_caster_mujoco_control \
  simulation_control.launch.py \
  enable_viewer:=true
```

该命令默认启动五个节点：

```text
/mujoco_state_node
/inverse_kinematics_node
/motion_controller_node
/offset_caster_dashboard
/offset_caster_curve_monitor
```

服务器或 CI 中进行无界面验证：

```bash
ros2 launch offset_caster_mujoco_control \
  simulation_control.launch.py \
  enable_viewer:=false \
  enable_dashboard:=false \
  enable_monitor:=false
```

原生环境中模型不在默认位置时，增加：

```bash
model_path:=/absolute/path/to/offset_steering_wheel.xml
```

若容器内无法打开 MuJoCo 或 Qt 窗口，可在主机临时允许本地 root 用户访问 X11：

```bash
xhost +si:localuser:root
```

仿真结束后撤销：

```bash
xhost -si:localuser:root
```

## 7. 键盘速度与组合运动

保持完整仿真运行，在第二个终端执行：

```bash
source /opt/ros/jazzy/setup.bash
source /workspace/install/setup.bash

ros2 run teleop_twist_keyboard teleop_twist_keyboard \
  --ros-args --remap cmd_vel:=/cmd_vel
```

底盘约定 `+x` 为前进、`+y` 为左移、`+z` 正角速度为逆时针旋转。

| 按键 | 动作 |
| --- | --- |
| `i` / `,` | 前进 / 后退 |
| `Shift+J` / `Shift+L` | 左移 / 右移 |
| `j` / `l` | 逆时针 / 顺时针原地旋转 |
| `u` / `o` | 前进并旋转 |
| `m` / `.` | 后退并旋转 |
| `Shift+U` / `Shift+O` | 左前 / 右前斜移 |
| `k` | 停止 |

验证组合速度也可以直接发布：

```bash
ros2 topic pub -r 20 /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.3, y: 0.1, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.4}}"
```

此时 `/offset_caster/forward_velocity` 中线速度和角速度应同时非零，`/odom` 的位置和姿态也应同时变化。

## 8. Qt 世界位置控制

完整 launch 会自动打开目标位置控制台，也可以单独启动：

```bash
ros2 run offset_caster_dashboard offset_caster_dashboard
```

界面分为三个区域：

1. 左侧选择“世界位置 · 固定 Yaw”或“世界位置 · 动态 Yaw”，输入绝对 `X/Y/Yaw`；
2. 中间同时绘制固定世界坐标轴和随底盘 Yaw 旋转的机器人坐标轴；
3. 右侧显示当前模式、高层命令、实时 `/cmd_vel`、位置/Yaw 误差和控制器状态。

点击“发送 / 保持”后，界面以 20 Hz 维持当前高层命令；修改目标并再次发送会创建新的命令 ID。点击“停止”会立即发布停止命令。

### 固定 Yaw

输入世界系目标位置和绝对 Yaw。控制器根据世界位置误差生成平移速度，并在整个移动过程中持续保持指定 Yaw。

### 动态 Yaw

输入世界系目标位置与最终 Yaw。控制器记录起始姿态，再根据位置完成进度通过平滑插值生成当前 Yaw 参考值，使位置和姿态同步接近目标。

## 9. 独立曲线监测

监测窗口可单独启动：

```bash
ros2 run offset_caster_dashboard offset_caster_monitor
```

它使用 20 秒滚动窗口显示：

| 曲线 | 数据来源 | 含义 |
| --- | --- | --- |
| 位置/Yaw 误差 | `/offset_caster/motion_status` | 高层位置目标的闭环收敛情况 |
| 四路舵角 | `/joint_states.position` | 四个转向关节实际角度，单位 rad |
| 四路轮速 | `/joint_states.velocity` | 四个驱动轮实际角速度，单位 rad/s |

“暂停 / 继续”只停止或恢复图表采样，不会改变机器人控制；“清空”用于开始一轮新的对比实验。

键盘模式没有世界位置目标，因此误差曲线主要用于两种 Qt 位置模式。舵角和轮速曲线在键盘与位置控制期间都会更新。

## 10. IMU、里程计与 TF

MuJoCo 模型在底盘中心设置 `imu_site`，发布：

- `/imu/data`：姿态、角速度和线加速度；
- `/odom`：MuJoCo 世界系位姿与正运动学速度；
- `/tf`：动态 `world → base_link`；
- `/tf_static`：静态 `base_link → imu_link`，当前 `z = 0.07 m`。

运行时检查：

```bash
ros2 run tf2_ros tf2_echo world base_link
ros2 run tf2_ros tf2_echo world imu_link
ros2 run tf2_tools view_frames
```

当前 IMU 使用理想仿真数据和配置协方差，没有注入随机噪声。用于状态估计研究时，需要进一步增加噪声、偏置和漂移模型。

## 11. ROS2 接口

| 方向 | 话题 | 消息类型 | 用途 |
| --- | --- | --- | --- |
| 输入 | `/cmd_vel` | `geometry_msgs/msg/Twist` | 键盘或高层控制器生成的底盘速度 |
| 输入 | `/offset_caster/motion_command` | `offset_caster_interfaces/msg/MotionCommand` | 六模式高层运动命令 |
| 输入/反馈 | `/joint_states` | `sensor_msgs/msg/JointState` | 八个关节的位置与速度 |
| 内部控制 | `/offset_caster/joint_velocity_command` | `trajectory_msgs/msg/JointTrajectory` | 四路舵速和四路轮速 |
| 输出 | `/offset_caster/motion_status` | `offset_caster_interfaces/msg/MotionStatus` | 模式、状态、误差和实际输出 |
| 输出 | `/offset_caster/forward_velocity` | `geometry_msgs/msg/TwistStamped` | 正运动学反算底盘速度 |
| 输出 | `/offset_caster/forward_kinematics_residual` | `std_msgs/msg/Float64` | 正运动学均方根残差 |
| 输出 | `/odom` | `nav_msgs/msg/Odometry` | 世界系位姿与底盘速度 |
| 输出 | `/imu/data` | `sensor_msgs/msg/Imu` | 底盘中心 IMU 数据 |
| 输出 | `/tf`、`/tf_static` | TF | `world → base_link → imu_link` |
| 输出 | `/clock` | `rosgraph_msgs/msg/Clock` | MuJoCo 仿真时间 |

常用观察命令：

```bash
ros2 topic echo /offset_caster/motion_status
ros2 topic echo /offset_caster/forward_velocity
ros2 topic echo /offset_caster/forward_kinematics_residual
ros2 topic echo /joint_states
ros2 topic echo /odom
ros2 topic echo /imu/data
```

## 12. 自动化验证

构建后运行：

```bash
colcon test
colcon test-result --verbose
```

控制包当前包含七组自动化验证：

| 测试 | 验证内容 |
| --- | --- |
| 逆运动学 | 静止、直行、横移、组合速度、公式方向和统一限速 |
| 正运动学 | 多组舵角下正逆运动学往返一致性 |
| 坐标变换 | 世界系与机器人系速度、角度归一化和平滑插值 |
| 六模式控制器 | 坐标系、固定/动态 Yaw、位置到达、限速与无效命令 |
| MuJoCo 状态读取 | MJCF 加载、关节索引和关节状态闭环 |
| MuJoCo IMU 读取 | 姿态、角速度和线加速度传感器映射 |
| Launch 集成测试 | 组合速度、固定 Yaw 位置和动态 Yaw 位置的端到端执行 |

本次在无界面 MuJoCo 中实测 `offset_caster_mujoco_control`：

```text
100% tests passed, 0 tests failed out of 7
```

集成测试会先发送机器人系组合速度，确认底盘同时发生位移和 Yaw 变化；随后分别发送固定 Yaw 与动态 Yaw 的世界位置命令，并检查位置误差和最终 Yaw 误差进入容差。

Qt 测试需要可用的 Qt 平台环境；没有 X11/Wayland 的容器应采用匹配的 offscreen/minimal 平台插件，或只在无界面任务中关闭 dashboard 和 monitor。

## 13. 安全机制与验收标准

系统包含多层停止和输入检查：

- 高层命令、机器人状态和时间步必须为有限数值；
- 高层命令或状态超时后，运动控制器停止输出；
- `/cmd_vel` 超过 0.5 秒未更新时，逆运动学发布零速度；
- 关节指令超过 0.25 秒未更新时，MuJoCo 执行器置零；
- 逆运动学在四个转向角全部就绪前不会输出运动指令；
- 位置目标需要在位置与 Yaw 容差内持续 0.2 秒才判定 `REACHED`。

一次完整验收应满足：

- 五个节点均存在且只启动一套；
- 前进、横移、原地旋转和组合运动方向正确；
- 固定 Yaw 位置模式能够保持目标朝向并到达位置；
- 动态 Yaw 位置模式的位置和最终朝向均进入容差；
- `/imu/data`、`/odom`、`/tf` 和 `/tf_static` 持续有效；
- 曲线窗口能够显示误差、舵角和轮速，并在停止后看到轮速回零；
- 控制包七项自动化测试全部通过；
- 停止或通信超时后底盘不会继续运动。

## 14. 当前结论与后续方向

新版工程已经从单一 `/cmd_vel` 仿真扩展为可观测的多模式控制系统：底盘能够执行机器人系速度、世界系目标位置和 Yaw 协同控制；Qt 控制台提供命令输入与状态反馈；独立曲线窗口用于检查误差和关节响应；IMU、里程计与 TF 为后续导航和状态估计提供了标准接口。

当前结论仍属于仿真控制链路验证。下一步可以继续：

1. 使用 rosbag 记录命令、误差、关节、里程计、IMU 和 TF，离线统计上升时间与稳态误差；
2. 用 CAD 或实测数据替换质量、惯量、摩擦和执行器参数；
3. 为 IMU 增加噪声、零偏与漂移，并接入 `robot_localization`；
4. 增加路径跟踪、轨迹规划、Nav2 与避障接口；
5. 接入真实编码器和电机驱动层，验证仿真到实机的接口一致性。

从工程推进角度看，先用自动化测试与可视化监测同时确认“算法正确、链路可运行、状态可观察”，再逐步提高动力学精度，能够明显降低后续调试成本。
