# 参与制作课堂游戏

每周我们选定一节课，大家各自构思能帮助学生理解这节课的游戏，用 Claude Code 或 Codex 做出来，提交 PR。
**每周二组会**一起试玩所有 PR，通过的合并进 `main`，网站会自动更新。

## 每周流程

1. **周会后**：确定本周的课程和要覆盖的概念（课程列表见 `src/data/courses.json`）。
2. **各自制作**：每人一个游戏、一个分支、一个 PR（步骤见下）。
3. **周二前**：PR 的自动检查要通过（绿色 ✓），并且有 Vercel 预览链接。
4. **周二组会**：一起打开每个 PR 的预览链接试玩、提意见；通过的直接合并（Merge）。
5. **合并后**：网站自动部署到阿里云服务器，几分钟后就能在线上看到。

## 用 AI 编程工具做一个游戏

第一次准备：

```bash
git clone https://github.com/YCPyc/guangyu-game-hub.git
cd guangyu-game-hub
npm install
```

（项目文件夹不要放在 iCloud 同步的“桌面 / 文稿”里，否则安装会非常慢甚至卡住。）

每做一个新游戏：

```bash
git checkout main && git pull
git checkout -b game/<游戏英文名>      # 例如 game/token-sorter
```

然后在项目文件夹里打开 Claude Code 或 Codex，直接描述你的游戏，比如：

> 为「聊天机器人背后的大脑」第 1 节做一个游戏：屏幕上出现一句话，全班猜 AI 下一个会说什么词……

AI 会自动读取 `AGENTS.md`（Claude Code 通过 `CLAUDE.md`）里的规则：放到正确的课程下、沿用网站的样式、
不用外部资源、做完自查。你只需要把想法说清楚，然后在浏览器里试玩、继续提修改意见。

本地试玩：

```bash
npm run dev
# 打开 http://localhost:5173/games/<游戏英文名>/index.html
```

做好后提交并创建 PR（也可以直接让 AI 帮你做这一步）：

```bash
npm run build                 # 先确认检查都通过
git add games/<游戏英文名>
git commit -m "新游戏：<游戏名>"
git push -u origin game/<游戏英文名>
gh pr create --fill            # 或者在 GitHub 网页上点 “Compare & pull request”
```

## 好游戏的标准

- **一节课一个重点**：游戏只帮学生理解一个核心概念，15–25 分钟能玩完。
- **全班一起玩**：老师投屏操作，学生看、猜、举手投票、讨论。不要求学生有设备。
- **每个环节结尾有一个讨论问题**，把游戏和课上的概念连起来。
- **能留下成果**：导出的图片和表格能放进给资助方的报告。

完整的技术和样式要求见 [AGENTS.md](AGENTS.md)。
