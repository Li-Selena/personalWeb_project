---
title: FlClash 配置补丁：修复 TUN 全部超时与桌面应用不走代理
slug: flclash-mtice-tun-codex
category: Linux 网络
tags:
  - FlClash
  - Mihomo
  - TUN
  - Codex
  - KDE
summary: 一份可套用的 FlClash/Mihomo 排障记录，覆盖 TUN 路由回环、策略组初始化和 Linux 桌面应用代理设置。
createdAt: 2026-08-15
updatedAt: 2026-08-15
---

本文记录一类常见的 FlClash/Mihomo 配置问题：系统代理可以使用，但部分桌面应用无法联网；打开 TUN 后，节点测速和所有网站又同时超时。

示例环境为 Linux、KDE Plasma、Wayland 和 FlClash，但排查思路也适用于其他桌面环境。文末提供一份已经去除订阅凭据、可自行填写的 YAML 模板。

> 使用代理工具时，请遵守所在地法律法规以及所用网络和服务的使用条款。本文只讨论本机网络配置和故障排查。

## 问题表现

可能同时遇到以下现象：

1. 打开系统代理后，浏览器可以访问网络，但 Codex 或其他桌面应用无法联网。
2. 关闭 TUN 时，本地 HTTP 代理端口可以正常连接外部网站。
3. 打开 TUN 后，所有节点测速超时，国内外网站均无法访问。
4. 换用简单订阅或全局模式后 TUN 又能工作，说明节点和核心不一定损坏。

这通常不是单一故障，而是“应用代理环境”和“TUN 出站路由”两个问题叠加。

## 使用前准备

开始修改前，建议完成以下工作：

- 更新到较新的 FlClash，并使用其自带或兼容的 Mihomo 内核。
- 备份当前配置和应用数据。
- 记录当前可用节点与策略组选择。
- 确认本地代理端口；不要假定所有配置都使用 `7890`。
- 暂时关闭 TUN，只保留本地代理进行基线测试。

本文配套模板使用：

| 用途 | 地址 |
| --- | --- |
| HTTP/HTTPS 代理 | `http://127.0.0.1:7890` |
| SOCKS5 代理 | `socks5h://127.0.0.1:7891` |
| Mihomo 控制接口 | `127.0.0.1:9090` |

如果使用自己的配置，请以其中的 `port`、`socks-port` 或 `mixed-port` 为准。

## 第一步：初始化订阅和策略组

复杂配置通常不会自动替你选好所有业务策略和真实节点。导入配置后，应先等待节点提供器和规则集下载完成，然后逐项检查：

- AI、GitHub、流媒体和国外网站应选择一个可用的代理组。
- 国内网站和不需要代理的厂商服务可以选择“直连”。
- 广告或明确需要阻止的内容可以选择“拒绝”。
- 至少进入一个地区手动组，选中真实可用节点。
- 不确定时先使用“所有-自动”或一个已经验证过的地区自动组。

如果策略组没有实际节点、选中了空地区组，节点健康检查通过也不代表业务组一定能够出站。

## 第二步：建立本地代理基线

保持 TUN 关闭，使用配置中的 HTTP 代理端口测试网络：

```bash
curl --proxy http://127.0.0.1:7890 \
  --connect-timeout 10 \
  --output /dev/null \
  --silent \
  --write-out 'HTTP=%{http_code} connect=%{time_connect}s tls=%{time_appconnect}s total=%{time_total}s\n' \
  https://www.gstatic.com/generate_204
```

正常情况下会得到 `HTTP=204`。如果这一步失败，应先检查节点、策略组、订阅提供器和规则集，不要急着排查 TUN。

也可以测试目标 API 是否能够到达。没有携带凭据时，某些 API 返回 `401` 或 `403` 仍然说明 DNS、TCP 和 TLS 路径已经建立；它不等于登录或 API 调用成功。

## 第三步：修复 TUN 出站接口检测

出现“关闭 TUN 正常，开启 TUN 后所有节点一起超时”时，重点检查：

```yaml
tun:
  auto-route: true
  auto-detect-interface: true
```

`auto-route` 让 Mihomo 配置系统路由，`auto-detect-interface` 让它自动选择实际出站网卡。如果没有正确选择物理出站接口，节点连接可能再次被送入 TUN，表现得像路由回环。

对于同时连接有线、Wi-Fi、VPN 或多个出口的设备，自动识别也可能选错。这时不要反复切换节点，应查看实际路由，必要时明确指定出站接口。

修改配置后完全重启 FlClash，再检查实际运行配置。FlClash 可能覆盖源 YAML 中的 TUN 设备名、自动路由和 DNS 项，所以编辑器中看到的源文件不一定等于核心最终收到的配置。

在 Linux 上可以用以下命令检查 TUN 网卡和策略路由：

```bash
ip -brief address
ip rule
ip route show table 2022
ip route get 1.1.1.1
```

表号不一定总是 `2022`，应以实际输出为准。确认默认流量进入 TUN 后，再执行一次不带 `--proxy` 的 `curl` 测试。

## 第四步：让桌面应用显式使用代理

浏览器能联网而桌面应用不能联网，通常说明该应用没有继承 KDE 的系统代理。可以先从终端临时启动验证：

```bash
env \
  HTTP_PROXY=http://127.0.0.1:7890 \
  HTTPS_PROXY=http://127.0.0.1:7890 \
  ALL_PROXY=socks5h://127.0.0.1:7891 \
  NO_PROXY=localhost,127.0.0.1,::1 \
  chatgpt --proxy-server=http://127.0.0.1:7890
```

注意，`socks5h://` 必须对应 SOCKS 端口。本模板的 SOCKS 端口是 `7891`，不要误写成 HTTP 端口 `7890`。

如果终端启动有效，可以复制系统桌面启动器到用户目录：

```bash
mkdir -p ~/.local/share/applications
cp /usr/share/applications/chatgpt.desktop \
  ~/.local/share/applications/chatgpt.desktop
```

然后编辑用户级文件中的 `Exec=`，改成一整行：

```ini
Exec=env HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 ALL_PROXY=socks5h://127.0.0.1:7891 NO_PROXY=localhost,127.0.0.1,::1 chatgpt --proxy-server=http://127.0.0.1:7890 %U
```

不同发行版的可执行文件名和系统启动器路径可能不同，可以先查看原启动器的 `Exec=` 再修改。不要直接编辑 `/usr/share/applications` 下的文件，因为软件升级可能覆盖它。

启用 TUN 后，应用通常无需再显式设置代理。如果保留这些变量，应确保 FlClash 本地端口仍然开启，否则应用会继续尝试连接已经关闭的端口。

## DNS 与 IPv6 建议

为减少变量，模板默认关闭 IPv6，并使用 Fake IP 和 DoH：

```yaml
ipv6: false

dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  proxy-server-nameserver:
    - https://doh.pub/dns-query
```

这不是唯一正确的 DNS 配置。如果本地网络、节点或业务明确需要 IPv6，应同时检查顶层 `ipv6`、DNS 的 `ipv6` 和 TUN IPv6 地址设置，再逐步开启。

## 安全设置

公开分享配置前必须检查以下项目：

- 删除订阅 URL、token、用户名、密码和私钥。
- 控制接口默认只监听 `127.0.0.1`，不要无故使用 `0.0.0.0`。
- 只供本机使用时设置 `allow-lan: false`。
- 如果确实需要局域网代理，限制允许的网段并添加身份验证。
- 不要使用 `123456` 等弱控制接口密钥。
- 删除日志中的本机用户名、配置编号和绝对路径。

## 配套配置模板

[下载已脱敏的 FlClash/Mihomo YAML 模板](/downloads/flclash-mtice-template.yaml)

使用方法：

1. 下载模板并用文本编辑器打开。
2. 把 `YOUR_SUBSCRIPTION_URL` 替换为自己的订阅地址，不要把修改后的文件上传到公开仓库。
3. 把 `CHANGE_ME_TO_A_RANDOM_SECRET` 替换成随机长密码。
4. 导入 FlClash，等待节点和规则集加载。
5. 选择实际可用的策略组和节点。
6. 先关闭 TUN 完成本地代理基线测试。
7. 再打开 TUN，验证无显式代理的网络请求。
8. 如果出现全部超时，检查最终运行配置中的 `auto-route` 和 `auto-detect-interface`。
+
### 完整 YAML 模板

下面的内容与下载文件一致。复制后必须先替换 `YOUR_SUBSCRIPTION_URL` 和 `CHANGE_ME_TO_A_RANDOM_SECRET`。

```yaml
# ========================
# FlClash / Mihomo 可复用配置模板
# ========================
# 可公开分享的模板；填写私人订阅地址后请勿再次公开上传。
# 使用说明：https://liselena.cn/wiki/flclash-mtice-tun-codex/
# 配置框架参考：https://github.com/tungchiahui/ClashYaml

# 机场节点订阅

proxy-providers:

  MyProvider:
    url: "YOUR_SUBSCRIPTION_URL"
    type: http
    interval: 86400
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300
    proxy: 直连

proxies:
  - {name: 直连, type: direct}
  - {name: 拒绝, type: reject}

# ========================
# 主要端口设置
# ========================
port: 7890
socks-port: 7891
redir-port: 7892
mixed-port: 7893
tproxy-port: 7895

allow-lan: false
mode: rule
log-level: info

external-controller: 127.0.0.1:9090
# external-ui: ui
# external-ui-name: zashboard
# external-ui-url: https://gh-proxy.com/github.com/Zephyruso/zashboard/archive/refs/heads/gh-pages.zip
secret: "CHANGE_ME_TO_A_RANDOM_SECRET"

# ========================
# DNS 设置
# ========================
dns:
  enable: true
  listen: 127.0.0.1:7874
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - +.lan
    - +.local
    - geosite:cn

ipv6: false

# ========================
# TUN 模块
# ========================
tun:
  enable: true
  stack: gvisor
  device: utun
  endpoint-independent-nat: false
  auto-route: true
  auto-detect-interface: true
  auto-redirect: false
  strict-route: false

profile:
  store-selected: true
  store-fake-ip: true
 

# ========================
# 策略组定义
# ========================
default: &default
  type: select
  proxies:
    - 直连
    - 所有-自动
    - 所有-手动
    - 香港-自动
    - 香港-故转
    - 澳门-自动
    - 澳门-故转
    - 台湾-自动
    - 台湾-故转
    - 日本-自动
    - 日本-故转
    - 韩国-自动
    - 韩国-故转
    - 新加坡-自动
    - 新加坡-故转
    - 美国-自动
    - 美国-故转
    - 其他-自动
    - 其他-故转
    - 拒绝

proxy-groups:

  # 业务分流组
  - {name: AI, <<: *default}
  - {name: Stream Media, <<: *default}
  - {name: GitHub, <<: *default}
  - {name: Reddit, <<: *default}  
  - {name: Nvidia, <<: *default}
  - {name: Apple, <<: *default}
  - {name: Microsoft, <<: *default}
  - {name: Games, <<: *default}
  - {name: Crypto, <<: *default}
  - {name: Test, <<: *default}
  - {name: Block, <<: *default}
  - {name: 国外, <<: *default}
  - {name: 国内, <<: *default}
  - {name: 其他, <<: *default}  

  - name: 所有-手动
    type: select
    include-all: true
    filter: "^((?!(直连|拒绝)).)*$"

  - name: 所有-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "^((?!(直连|拒绝)).)*$"

  # 香港组
  - name: 香港-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 香港-手动
      - 香港-自动
  
  - name: 香港-手动
    type: select
    include-all: true
    filter: "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$"
    
  - name: 香港-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(广港|香港|HK|Hong Kong|🇭🇰|HongKong)).*$"
 
  # 澳门组
  - name: 澳门-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 澳门-手动
      - 澳门-自动

  - name: 澳门-手动
    type: select
    include-all: true
    filter: "(?=.*(澳门|澳門|澳|MO|Macau|Macao|🇲🇴)).*$"

  - name: 澳门-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(澳门|澳門|澳|MO|Macau|Macao|🇲🇴)).*$"

  # 台湾组
  - name: 台湾-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 台湾-手动
      - 台湾-自动
  - name: 台湾-手动
    type: select
    include-all: true
    filter: "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$"
  - name: 台湾-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan)).*$"

  # 日本组
  - name: 日本-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 日本-手动
      - 日本-自动
  - name: 日本-手动
    type: select
    include-all: true
    filter: "(?=.*(广日|日本|JP|川日|东京|大阪|泉日|埼玉|沪日|深日|🇯🇵|Japan)).*$"
  - name: 日本-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(广日|日本|JP|川日|东京|大阪|泉日|埼玉|沪日|深日|🇯🇵|Japan)).*$"

  # 韩国组
  - name: 韩国-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 韩国-手动
      - 韩国-自动

  - name: 韩国-手动
    type: select
    include-all: true
    filter: "(?=.*(韩国|韓國|KR|Korea|Seoul|首尔|🇰🇷)).*$"

  - name: 韩国-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(韩国|韓國|KR|Korea|Seoul|首尔|🇰🇷)).*$"

  # 新加坡组
  - name: 新加坡-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 新加坡-手动
      - 新加坡-自动
  - name: 新加坡-手动
    type: select
    include-all: true
    filter: "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$"
  - name: 新加坡-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(广新|新加坡|SG|坡|狮城|🇸🇬|Singapore)).*$"

  # 美国组
  - name: 美国-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 美国-手动
      - 美国-自动
  - name: 美国-手动
    type: select
    include-all: true
    filter: "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$"
  - name: 美国-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "(?=.*(广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States)).*$"

  # 其他组
  - name: 其他-故转
    type: fallback
    interval: 300
    lazy: false
    proxies:
      - 其他-手动
      - 其他-自动
  - name: 其他-手动
    type: select
    include-all: true
    filter: "^((?!(直连|拒绝|广港|香港|HK|Hong Kong|🇭🇰|HongKong|广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan|广日|日本|JP|川日|东京|大阪|泉日|埼玉|沪日|深日|🇯🇵|Japan|广新|新加坡|SG|坡|狮城|🇸🇬|Singapore|广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States|韩国|韓國|KR|Korea|Seoul|首尔|🇰🇷|澳门|澳門|MO|Macau|🇲🇴)).)*$"
  
  - name: 其他-自动
    type: url-test
    include-all: true
    tolerance: 50
    interval: 300
    filter: "^((?!(直连|拒绝|广港|香港|HK|Hong Kong|🇭🇰|HongKong|广台|台湾|台灣|TW|Tai Wan|🇹🇼|🇨🇳|TaiWan|Taiwan|广日|日本|JP|川日|东京|大阪|泉日|埼玉|沪日|深日|🇯🇵|Japan|广新|新加坡|SG|坡|狮城|🇸🇬|Singapore|广美|US|美国|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|洛杉|圣何塞|圣克拉|西雅|芝加|🇺🇸|United States|韩国|韓國|KR|Korea|Seoul|首尔|🇰🇷|澳门|澳門|MO|Macau|🇲🇴)).)*$"

# ========================
# 规则引擎（rules）
# ========================
rules:

  - RULE-SET,TEST / Domain,Test
  - RULE-SET,Block / Domain,Block  
  - RULE-SET,GitHub / Domain,GitHub    
  - RULE-SET,ChatGPT / Domain,AI
  - RULE-SET,Claude / Domain,AI
  - RULE-SET,Copilot / Domain,AI
  - RULE-SET,Gemini / Domain,AI
  - RULE-SET,Groq / Domain,AI
  - RULE-SET,Grok / Domain,AI
  - RULE-SET,Meta AI / Domain,AI
  - RULE-SET,Perplexity / Domain,AI
  - RULE-SET,Microsoft / Domain,Microsoft
  - RULE-SET,Apple / Domain,Apple
  - RULE-SET,Apple-CN / Domain,Apple  
  - RULE-SET,Apple-Custome / Domain,Apple  
  - RULE-SET,OKX / Domain,Crypto
  - RULE-SET,Bybit / Domain,Crypto
  - RULE-SET,Binance / Domain,Crypto
  - RULE-SET,TikTok / Domain,Stream Media
  - RULE-SET,Netflix / Domain,Stream Media
  - RULE-SET,Netflix / IP,Stream Media,no-resolve
  - RULE-SET,Disney / Domain,Stream Media
  - RULE-SET,Amazon / Domain,Stream Media
  - RULE-SET,HBO / Domain,Stream Media
  - RULE-SET,Crunchyroll / Domain,Stream Media
  - RULE-SET,Popcorn / Domain,Stream Media  
  - RULE-SET,Spotify / Domain,Stream Media
  - RULE-SET,Steam / Domain,Games
  - RULE-SET,Epic / Domain,Games
  - RULE-SET,EA / Domain,Games
  - RULE-SET,Blizzard / Domain,Games
  - RULE-SET,UBI / Domain,Games
  - RULE-SET,PlayStation / Domain,Games
  - RULE-SET,Nintend / Domain,Games
  - RULE-SET,Nvidia / Domain,Nvidia
  - RULE-SET,Reddit / Domain,Reddit  
  - RULE-SET,Proxy / Domain,国外
  - RULE-SET,Globe / Domain,国外  
  - RULE-SET,Direct / Domain,国内
  - RULE-SET,China / Domain,国内
  - RULE-SET,China / IP,国内,no-resolve
  - RULE-SET,Private / Domain,国内
  - MATCH,其他

# ========================
# 规则集提供者
# ========================
rule-anchor:
  ip: &ip {type: http, interval: 86400, behavior: ipcidr, format: mrs}
  domain: &domain {type: http, interval: 86400, behavior: domain, format: mrs}
  class: &class {type: http, interval: 86400, behavior: classical, format: text}

rule-providers:
  TEST / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Check.list"}
  ChatGPT / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/openai.mrs"}
  Claude / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Claude/Claude.list"}
  Meta AI / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/MetaAi.list"}
  Perplexity / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/perplexity.mrs"}
  Copilot / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Copilot.list"}
  Gemini / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Gemini.list"}
  GitHub / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/github.mrs"}
  Amazon / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/amazon.mrs"}
  Apple-CN / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/apple-cn.mrs"}
  Apple / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/apple.mrs"} 
  Apple-Custome / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Apple.list"}
  Microsoft / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/microsoft.mrs"}
  OKX / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/okx.mrs"}
  Bybit / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/bybit.mrs"}
  Binance / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/binance.mrs"}
  TikTok / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/tiktok.mrs"}
  Netflix / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/netflix.mrs"}
  Netflix / IP: {<<: *ip, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geoip/netflix.mrs"}
  Disney / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/disney.mrs"}
  HBO / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/hbo.mrs"}
  Spotify / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/spotify.mrs"}
  Steam / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/steam.mrs"}
  Epic / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.list"}
  EA / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/EA/EA.list"}
  Blizzard / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Blizzard/Blizzard.list"}
  UBI / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/UBI/UBI.list"}
  PlayStation / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/PlayStation/PlayStation.list"}
  Nintend / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Nintendo/Nintendo.list"}
  Proxy / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Proxy.list"}
  Globe / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Global/Global.list"} 
  Block / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Block.list"}
  Nvidia / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Nvidia/Nvidia.list"}
  Crunchyroll / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Crunchyroll.list"}
  Reddit / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/reddit.mrs"}
  Groq / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/groq.mrs"}
  Grok / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Grok.list"}
  Popcorn / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Popcorn.list"}
  Direct / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/liandu2024/clash/refs/heads/main/list/Direct.list"}
  Private / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/private.mrs"}
  China / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/cn.mrs"}
  China / IP: {<<: *ip, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geoip/cn.mrs"}
#  Twitter / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/x.mrs"}
#  WhatsApp / Domain: {<<: *class, url: "https://gh-proxy.com/raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Whatsapp/Whatsapp.list"}
#  Facebook / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/facebook.mrs"}
#  Telegram / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/telegram.mrs"}  
#  Telegram / IP: {<<: *ip, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geoip/telegram.mrs"}
#  Youtube / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/youtube.mrs"}  
#  Google / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/google.mrs"}  
#  Google / IP: {<<: *ip, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geoip/google.mrs"}
#  GateFireWall / Domain: {<<: *domain, url: "https://gh-proxy.com/github.com/metacubex/meta-rules-dat/raw/refs/heads/meta/geo/geosite/gfw.mrs"}
```


## 快速回退

修改后完全断网时：

1. 关闭 TUN。
2. 恢复修改前的配置备份。
3. 重新载入原订阅。
4. 用本地 HTTP 代理重新建立基线。
5. 每次只改变一个设置并记录结果。

不要在断网状态下同时修改 DNS、IPv6、协议栈、路由和策略组，否则很难确定真正起作用的补丁。

## 参考资料

- [FlClash 项目主页](https://github.com/chen08209/FlClash)
- [ClashYaml 配置项目](https://github.com/tungchiahui/ClashYaml)
- [Mihomo TUN 配置](https://wiki.metacubex.one/config/inbound/tun/)
- [Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)
- [Mihomo 全局与控制接口配置](https://wiki.metacubex.one/config/general/)
