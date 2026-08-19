window.PORTFOLIO_DATA = {
  videoBaseUrl: "",
  profile: {
    name: "曾飞扬",
    headline: "具身智能算法 / 机器人学习 / 机械臂运动规划与控制",
    bio:
      "聚焦双臂协同操控、机器人模仿学习、反应式规划与安全避障，熟悉机械臂运动学、末端轨迹规划、Diffusion Policy、ACT、Flow Matching 与实机部署。",
    about:
      "哈尔滨工业大学控制科学与工程硕士在读。本科毕业于四川大学自动化专业，保研至哈尔滨工业大学。具备 C/C++、Python、Matlab 与 Linux 开发经验，熟悉 ROS、Pinocchio、MuJoCo、Gazebo、Isaac Lab、IK、轨迹规划与零空间理论；使用过 Franka/FR3 与 Kinova 双臂系统，具备真实机械臂调试和数据采集经验。",
    email: "zengfeiyang1209@163.com",
    wechat: "zfyzfyzfy2002",
    location: "China",
    skills: [
      "Diffusion Policy",
      "机器人模仿学习",
      "双臂协同操控",
      "反应式规划",
      "任务优先级控制",
      "VR 遥操作",
      "ROS",
      "Pinocchio",
      "MuJoCo",
      "Isaac Lab",
    ],
    contacts: [
      {
        label: "Email",
        value: "zengfeiyang1209@163.com",
      },
      {
        label: "WeChat",
        value: "zfyzfyzfy2002",
      },
      {
        label: "Phone",
        value: "18161316315",
      },
    ],
  },

  projects: [
    {
      id: "diffusion-policy-inference",
      title: "基于 Diffusion Policy 的机械臂视觉模仿学习与实时推理优化",
      category: "机器人模仿学习",
      year: "2025-2026",
      featured: true,
      summary:
        "基于 FR3 单臂与 FR3+Kinova 双臂平台，构建视觉模仿学习与真机推理流程，完成抓取、搬运、放置等任务验证，并针对推理边界突变与动作回退问题进行实时推理优化。",
      highlights: [
        "负责多模态数据预处理，包括多源时间戳同步、ROI 裁剪、状态/动作归一化，提升训练数据一致性。",
        "设计 RTC 异步推理与基于历史动作先验的 HAPC 推理策略，缓解推理重规划导致的动作不连续。",
        "加入轨迹后处理机制，对新生成动作施加位置、速度、加速度约束，降低实机执行抖动与风险。",
        "RTC 使动作 chunk 边界跳变 p95 降低 72.3%，边界速度跳变 p95 降低 65.2%；HAPC 使边界跳变 p95 降低 52.3%，边界速度跳变 p95 降低 56.3%。",
      ],
      tags: ["Diffusion Policy", "RTC", "HAPC", "FR3", "Kinova", "Real Robot"],
      media: [
        {
          title: "单臂同步推理",
          type: "video",
          src: "assets/works_web/单臂同步推理.web.mp4",
          description: "FR3 单臂平台上的同步推理效果演示。",
        },
        {
          title: "单臂 RTC 推理",
          type: "video",
          src: "assets/works_web/单臂RTC推理.web.mp4",
          description: "通过 RTC 异步推理降低动作 chunk 边界突变。",
        },
        {
          title: "单臂 HAPC 推理",
          type: "video",
          src: "assets/works_web/单臂HAPC推理.web.mp4",
          description: "利用历史动作先验改善重规划阶段的动作连续性。",
        },
        {
          title: "双臂同步推理",
          type: "video",
          src: "assets/works_web/双臂同步推理.web.mp4",
          description: "FR3+Kinova 双臂平台上的同步推理效果演示。",
        },
        {
          title: "双臂 RTC 推理",
          type: "video",
          src: "assets/works_web/双臂RTC推理.web.mp4",
          description: "双臂任务中的 RTC 推理与动作连续性优化。",
        },
      ],
    },
    {
      id: "dual-arm-reactive-planning",
      title: "双臂协同搬运反应式规划与任务优先级控制系统",
      category: "运动规划与控制",
      year: "2025-2026",
      summary:
        "面向双 Franka 受限空间协同搬运任务，在仿真环境中构建高层反应式规划与底层任务优先级控制闭环，实现高层 100 Hz 规划与低层 1 kHz 控制。",
      highlights: [
        "设计多候选轨迹预测与连续力场绕障策略，融合吸引力、环绕力生成候选路径，并通过代价函数进行在线评价与策略切换。",
        "引入 SDF 全身距离感知与梯度避障任务，通过雅可比伪逆与零空间投影融合相对位姿、绝对位置、倾斜控制、关节限位和全身避障任务。",
        "在 3 类障碍场景中完成仿真消融验证，复杂场景平均最小安全距离由约 2.0 cm 提升至约 6.1 cm。",
        "相关论文工作：A Unified SDF-Based Framework for Obstacle Avoidance in Dual-Arm Cooperative Manipulation，ICUS 2026，已录用。",
      ],
      tags: ["Dual-Arm", "Reactive Planning", "Task Priority", "SDF", "Null Space", "ICUS 2026"],
      media: [],
    },
    {
      id: "vr-teleoperation-data-system",
      title: "双臂机器人 VR 遥操作与具身智能数据采集系统",
      category: "数据采集系统",
      year: "2025-2026",
      summary:
        "面向模仿学习数据采集，设计 FR3+Kinova 双臂 VR 遥操作系统，形成从人类示教、多源同步到 LeRobot 数据集保存的采集链路。",
      highlights: [
        "基于相对位姿锚点与 SE(3)/SO(3) 增量映射，实现 VR 手柄到双臂末端的控制映射。",
        "基于 Pinocchio 实现 IK 求解，并加入关节级安全约束，提高遥操作过程的稳定性和可控性。",
        "通过异步 bridge 解耦高层控制与底层执行，使用 UDP 下发关节目标并回传真实反馈。",
        "采用线程安全快照与时间戳偏移机制实现多源数据软同步，支撑后续模仿学习训练数据构建。",
      ],
      tags: ["VR Teleoperation", "LeRobot", "SE(3)", "SO(3)", "Pinocchio", "UDP"],
      media: [
        {
          title: "双臂 VR 数据采集系统",
          type: "video",
          src: "assets/works_web/双臂VR数据采集系统.web.mp4",
          description: "FR3+Kinova 双臂 VR 遥操作与数据采集链路演示。",
        },
      ],
    },
  ],
};
