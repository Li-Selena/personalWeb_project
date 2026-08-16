# Li Selena 个人网站

面向公开访问的个人学习记录与日常工具站，使用 Next.js、TypeScript、App Router 和纯静态导出构建。线上内容只通过仓库中的 Markdown、数据文件和静态资源更新。

## 本地开发

PowerShell 可以使用以下命令：

```powershell
Set-Location -LiteralPath 'D:\VirtualC\个人\个人网页\personalWeb_project'
npm.cmd install
npm.cmd run dev
```

如果 PowerShell 已允许执行 npm 脚本，也可以把 `npm.cmd` 写成 `npm`。

## 检查与构建

```powershell
npm.cmd run check
```

该命令会依次执行 ESLint、TypeScript 类型检查和生产构建。静态文件输出到 `out/`。

## 添加 Wiki 文章

在 `content/wiki/` 中添加 Markdown 文件，Front Matter 格式参考该目录内的 `_README.md`。支持 GFM 表格与任务列表、标题目录、代码高亮与复制、图片点击查看原图。

完成修改后执行：

```powershell
npm.cmd run check
git add .
git commit -m "docs: add wiki article"
git push origin main
```

## EdgeOne Pages

- 根目录：`./`
- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 输出目录：`out`
- 环境变量：无需填写
- Node.js：22

生产域名为 `www.liselena.cn`。在 EdgeOne Makers 中同时绑定 `liselena.cn` 与 `www.liselena.cn`，并将根域名永久重定向到 `www`；代码推送到 `main` 后会自动触发部署。
