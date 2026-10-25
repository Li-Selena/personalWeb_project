export type NavItem = {
  href: string;
  label: string;
};

export type LinkItem = {
  title: string;
  url: string;
  description: string;
  category: string;
  accessNote?: string;
};

export const siteConfig = {
  name: "Li Selena",
  title: "Li Selena｜个人学习记录与工具站",
  description:
    "机器人工程师 Li Selena 的个人学习记录与日常工具站，整理嵌入式、ROS 2、仿真、环境搭建和控制算法相关内容。",
  url: "https://www.liselena.cn",
  icp: {
    number: "鲁ICP备2026046668号-1",
    url: "https://beian.miit.gov.cn/",
  },
  publicSecurity: {
    number: "鲁公网安备37010302001838号",
    url: "https://beian.mps.gov.cn/#/query/webSearch?code=37010302001838",
    icon: "/images/gongan-beian.png",
  },
  nav: [
    { href: "/", label: "首页" },
    { href: "/about/", label: "关于我" },
    { href: "/wiki/", label: "Wiki" },
    { href: "/contact/", label: "联系方式" },
  ] satisfies NavItem[],
};

export const focusAreas = [
  {
    title: "嵌入式系统",
    description: "硬件驱动、实时系统、通信与设备控制",
    icon: "cpu",
  },
  {
    title: "运动控制",
    description: "控制算法、状态估计、建模与仿真验证",
    icon: "activity",
  },
  {
    title: "机器人工程",
    description: "感知融合、运动控制、系统集成与调试",
    icon: "bot",
  },
] as const;

export const expandingAreas = [
  {
    title: "ROS 2 相关技术",
    description: "继续整理机器人软件系统中的通信、导航与集成方法。",
  },
  {
    title: "机器人仿真与工具链",
    description: "记录从模型、场景到算法验证的完整仿真实践。",
  },
  {
    title: "环境搭建与工程化实践",
    description: "让开发环境、依赖配置和常用流程更稳定、更容易复现。",
  },
] as const;

export const wikiCategories = [
  { name: "STM32 教程", slug: "stm32" },
  { name: "ROS 2 教程", slug: "ros2" },
  { name: "仿真教程", slug: "simulation" },
  { name: "环境搭建教程", slug: "environment-setup" },
  { name: "控制算法教程", slug: "control-algorithms" },
] as const;

export const bookmarks: LinkItem[] = [
  {
    title: "飞书",
    url: "https://sdutvincirobot.feishu.cn/drive/home/?src_domain_uid=7483508928941309956",
    description: "团队文档与资料入口",
    category: "文档与协作",
    accessNote: "可能需要登录或相应访问权限",
  },
  {
    title: "山理工VINCI机器人战队官网",
    url: "https://vinci.sdut.edu.cn/",
    description: "山理工 VINCI 机器人战队官方网站",
    category: "机器人战队",
  },
  {
    title: "山理工教学服务平台",
    url: "http://authserver-sdut-edu-cn-s.newvpn.sdut.edu.cn:8118/authserver/login?service=https%3A%2F%2Fnewvpn.sdut.edu.cn%3A443%2Fpassport%2Fv1%2Fauth%2Fcas%3FsfDomain%3Dcas.com",
    description: "教学服务入口",
    category: "校园服务",
    accessNote: "可能依赖校园网络、新 VPN 或登录状态",
  },
  {
    title: "知乎",
    url: "https://www.zhihu.com/",
    description: "问题检索与内容阅读",
    category: "内容社区",
  },
  {
    title: "东澈的折腾天地",
    url: "https://www.tungchiahui.cn/zh-cn",
    description: "技术记录与个人网站参考",
    category: "个人站点",
  },
  {
    title: "小房的空间",
    url: "https://fongtszho.github.io/fongtszho.web/",
    description: "个人学习记录",
    category: "个人站点",
  },
  {
    title: "山理工信息门户",
    url: "https://ehall.sdut.edu.cn/new/ehall.html",
    description: "校园信息与服务入口",
    category: "校园服务",
    accessNote: "可能需要校园账号登录",
  },
  {
    title: "机械臂混控分享",
    url: "https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzE5MTI2MzUzNw==&scene=1&album_id=4528530393700204550&count=3#wechat_redirect",
    description: "机械臂混合控制相关内容合集",
    category: "机器人技术",
    accessNote: "微信公众平台文章合集",
  },
  {
    title: "Leader 老师的 GitHub",
    url: "https://github.com/Leader-txt",
    description: "Leader 老师的开源项目与代码仓库",
    category: "个人主页",
  },
  {
    title: "Hello World 战队步兵导航分享",
    url: "https://github.com/Polyacetone/HWSentryNav26",
    description: "浙江大学 Hello World 战队的步兵导航开源项目",
    category: "导航开源",
  },
  {
    title: "LocoWiki 足式机器人开源仓库",
    url: "https://github.com/LocoWiki/LocoWiki",
    description: "足式机器人开源代码与项目资料",
    category: "足式机器人",
  },
  {
    title: "LocoWiki 足式机器人飞书资料",
    url: "https://wcn9j5638vrr.feishu.cn/wiki/BnbBwsINci9ijokLyyfcN9tInpe?from=from_copylink",
    description: "足式机器人相关飞书知识库",
    category: "足式机器人",
    accessNote: "可能需要登录或相应访问权限",
  },
  {
    title: "MATRiX 仿真平台",
    url: "https://github.com/zsibot/matrix",
    description: "结合 UE5 与 MuJoCo 的机器人仿真平台",
    category: "仿真平台",
  },
  {
    title: "达妙产品资料 GitHub",
    url: "https://github.com/dmBots/dmBot",
    description: "达妙机器人产品资料与开源代码总入口",
    category: "产品资料",
  },
  {
    title: "达妙产品资料飞书",
    url: "https://gl1po2nscb.feishu.cn/drive/folder/RJL7fFT4ll9PDSdvM6Pc5vntnPw",
    description: "达妙机器人产品资料飞书文件夹",
    category: "产品资料",
    accessNote: "可能需要登录或相应访问权限",
  },
  {
    title: "Robocon 上位机技术分享",
    url: "https://lumivers.feishu.cn/wiki/I0S2wsP9DiUsGdkp1kkc9s48ngb",
    description: "Robocon 上位机开发相关技术资料",
    category: "技术分享",
    accessNote: "可能需要登录或相应访问权限",
  },
  {
    title: "中北大学 ROBOCON 2026 主控板第二版",
    url: "https://oshwhub.com/ericyuhaotong/project_czxokunj",
    description: "中北大学 ROBOCON 2026 硬件开源企划主控板",
    category: "硬件开源",
  },
  {
    title: "中北大学 ROBOCON 2026 IO-Link 主站拓展板",
    url: "https://oshwhub.com/ericyuhaotong/project_leseyekn",
    description: "IO-Link 主站拓展板硬件与配套固件",
    category: "硬件开源",
  },
  {
    title: "RMUC OfflineRL",
    url: "https://github.com/Harkerbest/RMUC-OfflineRL",
    description: "用于训练机器人自主决策的离线强化学习框架",
    category: "强化学习",
  },
];

export const tools: LinkItem[] = [
  {
    title: "有道翻译",
    url: "https://www.youdao.com/",
    description: "日常中英文翻译",
    category: "翻译工具",
  },
  {
    title: "Google 翻译",
    url: "https://translate.google.com/?hl=zh-cn",
    description: "多语言在线翻译",
    category: "翻译工具",
  },
  {
    title: "腾讯云",
    url: "https://cloud.tencent.com/?Is=sdk-topnav",
    description: "云服务控制台与技术文档",
    category: "云服务",
  },
  {
    title: "Gmail",
    url: "https://mail.google.com/mail/u/0/#inbox",
    description: "邮箱快捷入口",
    category: "日常工具",
    accessNote: "使用浏览器中已登录的第一个 Google 账号",
  },
  {
    title: "英文朗读",
    url: "https://ttsreader.com/zh/",
    description: "在线英文文本朗读",
    category: "语言工具",
  },
  {
    title: "魔戒控制台",
    url: "https://47.242.128.61:8000/dashboard",
    description: "代理服务仪表盘与管理入口",
    category: "代理服务",
  },
  {
    title: "MITCE",
    url: "https://mitce.io/",
    description: "代理服务网站入口",
    category: "代理服务",
  },
  {
    title: "Wallhaven 壁纸",
    url: "https://wallhaven.cc/",
    description: "高清壁纸搜索与下载",
    category: "壁纸工具",
  },
];

export const contacts = [
  {
    id: "qq",
    label: "QQ",
    value: "2762335112",
    action: "copy",
  },
  {
    id: "github",
    label: "GitHub",
    value: "Li-Selena",
    href: "https://github.com/Li-Selena",
    action: "visit",
  },
  {
    id: "gmail",
    label: "Gmail",
    value: "060203selina@gmail.com",
    href: "mailto:060203selina@gmail.com",
    action: "email",
  },
  {
    id: "bilibili",
    label: "哔哩哔哩",
    value: "Li Selena",
    href: "https://space.bilibili.com/3546736119253659?spm_id_from=333.1007.0.0",
    action: "visit",
  },
] as const;
