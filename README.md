# Docker Desktop 中文界面（Web 层注入方案）

给 **Docker Desktop（Windows）** 的 Electron 界面加上中文，不改动任何业务代码，随时可还原。

> 官方没有中文语言包。本方案在 `app.asar` 里加一个翻译脚本，并在页面里注入它；同时关闭 Electron 的 ASAR 完整性校验，否则改动会被拒绝加载。

## 原理

Docker Desktop 的界面是一个打包在 `app.asar` 里的 Electron 应用：

1. **`inject.js`** — 翻译引擎。遍历页面文本节点，按词典替换成中文，并用 `MutationObserver` 持续跟进动态内容（翻页、弹窗、表格刷新）。
2. **`patch-asar.js`** — 把 `inject.js` 塞进 `app.asar`，并在两个 `index.html` 的 `</head>` 前加一行 `<script src="/assets/cn.js"></script>`，然后重新打包。
3. **`flip-fuse.js`** — 关掉 Electron 的 `EnableEmbeddedAsarIntegrityValidation` fuse。不关的话，被修改的 `app.asar` 会被判定为损坏，界面进程启动即崩溃（`Integrity check failed for asar archive entry '<header>'`）。
4. **`还原英文.ps1`** — 从备份恢复官方的 `exe` 与 `app.asar`，一键回到英文原版。

引擎（WSL 里的 dockerd）、容器、镜像、数据卷**完全不受影响**。

## 用法

需要 Node.js ≥ 20，以及 `@electron/asar`、`@electron/fuses`：

```sh
npm install @electron/asar @electron/fuses
```

```powershell
# 1. 关掉 Docker Desktop（容器会中断，之后会自动恢复）
# 2. 关闭完整性校验
node flip-fuse.js "<DockerDesktop>\frontend\Docker Desktop.exe" ".\backup"

# 3. 注入并重新打包
node patch-asar.js `
  "<DockerDesktop>\frontend\resources\app.asar" `
  "<DockerDesktop>\frontend\resources\app-cn.asar" `
  ".\inject.js"

# 4. 替换（先备份原文件）
Move-Item "<...>\app.asar" "<...>\app.asar.orig"
Move-Item "<...>\app-cn.asar" "<...>\app.asar"
Remove-Item "<...>\app.asar.unpacked" -Recurse
Move-Item "<...>\app-cn.asar.unpacked" "<...>\app.asar.unpacked"

# 5. 启动 Docker Desktop
```

`<DockerDesktop>` 通常指 `%LOCALAPPDATA%\Programs\DockerDesktop`。

## 注意

- **Docker 更新会覆盖** `exe` 和 `app.asar`，界面自动变回英文（但不会崩）。重新跑一遍上面的步骤即可。
- **关闭完整性校验是安全权衡**：后续若有程序篡改 `app.asar`，Docker 不会再拦截。
- 翻译覆盖主要界面（导航、容器/镜像/数据卷、构建、设置主要栏目、按钮、提示）。**容器日志正文、错误详情、长段说明仍是英文**——那是程序输出，翻了反而不利于排错。
- 词典可以自己扩：改 `inject.js` 里的 `DICT` 和 `RULES`。

## 已验证环境

- Docker Desktop 4.92.0（Windows，按用户安装）
- Electron 43 / Chrome 150

## 许可

MIT
