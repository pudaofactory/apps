# 🚀 Turborepo Monorepo

基于 **PNPM + Turborepo** 的现代化全栈开发 monorepo，专为 Windows 10/11 环境优化。

## 📦 项目结构

```
repo/
├── apps/
│   ├── web/              # Next.js 应用 (App Router + TypeScript + Tailwind)
│   └── ext-clips/        # Chrome 扩展应用
├── packages/
│   ├── ui/               # 共享 React UI 组件库 (@repo/ui)
│   ├── config/           # 共享配置 (ESLint, Prettier, Tailwind)
│   ├── prompts/          # LLM 提示词配置
│   └── sdk/              # 共享 SDK 和工具
├── infra/                # 基础设施配置
├── turbo.json            # Turborepo 管道配置
├── pnpm-workspace.yaml   # PNPM 工作区配置
└── tsconfig.base.json    # 共享 TypeScript 配置
```

## ✨ 功能特性

- ✅ **Turborepo 2.0** - 快速的构建系统和任务管道
- ✅ **Next.js 14** - 带 App Router 的服务端渲染
- ✅ **TypeScript 5.5+** - 类型安全的开发体验
- ✅ **Tailwind CSS** - 实用优先的样式系统
- ✅ **共享 UI 组件** - Button, Card 等可复用组件
- ✅ **健康检查 API** - `/api/health` 端点
- ✅ **PNPM 工作区** - 高效的包管理
- ✅ **Windows 优化** - PowerShell 友好的命令

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18 (推荐 20 LTS)
- **pnpm** 9.x (通过 Corepack)
- **Git** 任何最新版本
- **Windows** 10/11 + PowerShell

### 安装

```powershell
# 1. 启用 Corepack 并激活 pnpm
corepack enable
corepack prepare pnpm@9.7.0 --activate

# 2. 克隆仓库并安装依赖
git clone <your-repo-url>
cd FromCodex/repo
pnpm install
```

### 开发模式

```powershell
# 并行启动所有应用的开发服务器
pnpm dev

# 只启动 web 应用
pnpm --filter @repo/web dev
```

访问 **http://localhost:3000** 查看应用。

### 构建

```powershell
# 构建所有应用和包
pnpm build

# 只构建 web 应用
pnpm --filter @repo/web build
```

### 代码质量

```powershell
# 运行 ESLint
pnpm lint

# 运行 TypeScript 类型检查
pnpm typecheck

# 运行所有质量检查
pnpm lint && pnpm typecheck
```

## 🎯 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有应用的开发服务器（并行） |
| `pnpm build` | 构建所有应用和包 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm --filter <package> <cmd>` | 对特定包运行命令 |

## 📚 API 端点

### GET /api/health

系统健康检查端点。

**响应示例：**
```json
{
  "ok": true,
  "ts": "2025-10-05T10:30:00.000Z"
}
```

## 🧩 共享包

### @repo/ui

可复用的 React UI 组件库。

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@repo/ui'

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">点击我</Button>
      </CardContent>
    </Card>
  )
}
```

**可用组件：**
- `Button` - 带变体的按钮组件 (primary, secondary, outline)
- `Card` - 卡片容器
- `CardHeader` - 卡片头部
- `CardTitle` - 卡片标题
- `CardContent` - 卡片内容

## 💡 Windows 开发提示

### 长路径支持

如果遇到 `ENAMETOOLONG` 错误，启用长路径：

```powershell
# 方法 1: Git 配置
git config --global core.longpaths true

# 方法 2: 注册表（管理员权限）
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### 端口冲突

如果 3000 端口已被占用：

```powershell
# 使用不同端口启动
pnpm --filter @repo/web dev -- -p 3001
```

### 性能优化

```powershell
# 跳过可选依赖安装（加快安装速度）
pnpm install --ignore-optional

# 清理缓存
pnpm store prune
```

## 🔧 Turborepo 配置

`turbo.json` 定义了任务管道：

- **build** - 按拓扑顺序构建，输出到 `.next/`, `dist/`
- **dev** - 持久化开发服务器，无缓存
- **lint** - 运行代码检查
- **typecheck** - 运行类型检查

## 📖 下一步

1. **国际化** - 添加 i18n 子路径路由（第 7 章）
2. **部署** - 部署到 Vercel（第 8 章）
3. **监控** - 集成 PostHog/Sentry（第 11 章）
4. **数据库** - 连接 Supabase/Neon 并配置 `DATABASE_URL`
5. **缓存** - 配置 KV 服务凭证

## 🐛 常见问题

### pnpm 命令未找到

```powershell
corepack enable
corepack prepare pnpm@9.7.0 --activate
```

### TypeScript 错误

```powershell
# 清理并重新安装
rm -r node_modules
pnpm install
pnpm typecheck
```

### 构建失败

```powershell
# 清理 Turbo 缓存
rm -r .turbo
pnpm build
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Pull Request！

---

**构建时间**: 2025-10-05  
**技术栈**: Next.js 14 · React 18 · TypeScript 5 · Tailwind CSS 3 · Turborepo 2 · PNPM 9


