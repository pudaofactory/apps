# ========================================
# GitHub 上传脚本 - Turborepo Monorepo
# ========================================

Write-Host "`n🚀 准备上传项目到 GitHub...`n" -ForegroundColor Cyan

# 步骤 1: 配置 Git 用户信息
Write-Host "📝 步骤 1: 配置 Git 用户信息" -ForegroundColor Yellow
Write-Host "请输入您的 GitHub 用户名:" -ForegroundColor White
$username = Read-Host
Write-Host "请输入您的 GitHub 邮箱:" -ForegroundColor White
$email = Read-Host

git config --global user.name "$username"
git config --global user.email "$email"
Write-Host "✓ Git 配置完成`n" -ForegroundColor Green

# 步骤 2: 初始化 Git 仓库
Write-Host "📦 步骤 2: 初始化 Git 仓库" -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git 仓库已存在`n" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git 仓库初始化完成`n" -ForegroundColor Green
}

# 步骤 3: 添加所有文件
Write-Host "📁 步骤 3: 添加文件到 Git" -ForegroundColor Yellow
git add .
Write-Host "✓ 文件添加完成`n" -ForegroundColor Green

# 步骤 4: 创建首次提交
Write-Host "💾 步骤 4: 创建提交" -ForegroundColor Yellow
git commit -m "feat: 初始化 Turborepo monorepo

- 添加 Next.js 14 应用 (apps/web)
- 添加 Chrome 扩展 (apps/ext-clips)
- 添加共享 UI 组件库 (@repo/ui)
- 实现 Button 和 Card 组件
- 添加 /api/health 健康检查端点
- 集成 HealthWidget 动态组件
- 配置 Turborepo 2.0 管道
- 完整的 README 文档
- Windows 环境优化"
Write-Host "✓ 提交创建完成`n" -ForegroundColor Green

# 步骤 5: 添加远程仓库
Write-Host "🔗 步骤 5: 连接到 GitHub" -ForegroundColor Yellow
Write-Host "`n请在 GitHub 上创建一个新仓库（如果还没有的话）:" -ForegroundColor Cyan
Write-Host "1. 访问 https://github.com/new" -ForegroundColor White
Write-Host "2. 输入仓库名称（例如: turborepo-monorepo）" -ForegroundColor White
Write-Host "3. 选择 Public 或 Private" -ForegroundColor White
Write-Host "4. 不要勾选 'Initialize with README'" -ForegroundColor White
Write-Host "5. 点击 'Create repository'`n" -ForegroundColor White

Write-Host "请输入您的 GitHub 仓库 URL（例如: https://github.com/username/repo.git）:" -ForegroundColor White
$repoUrl = Read-Host

# 检查是否已有 origin
$hasOrigin = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠ 已存在 origin，正在更新..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}
Write-Host "✓ 远程仓库配置完成`n" -ForegroundColor Green

# 步骤 6: 推送到 GitHub
Write-Host "🚀 步骤 6: 推送到 GitHub" -ForegroundColor Yellow
Write-Host "正在推送代码到 GitHub...`n" -ForegroundColor Cyan

git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 成功！项目已上传到 GitHub！" -ForegroundColor Green
    Write-Host "`n🎉 您可以访问以下地址查看您的项目:" -ForegroundColor Cyan
    Write-Host "$repoUrl" -ForegroundColor White
    Write-Host "`n📝 后续更新代码请使用:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m ""更新说明""" -ForegroundColor White
    Write-Host "  git push" -ForegroundColor White
} else {
    Write-Host "`n❌ 推送失败。可能的原因:" -ForegroundColor Red
    Write-Host "1. 需要 GitHub 认证 - 请按提示输入用户名和密码（或 Personal Access Token）" -ForegroundColor Yellow
    Write-Host "2. 仓库 URL 不正确 - 请检查 URL 是否正确" -ForegroundColor Yellow
    Write-Host "3. 网络连接问题 - 请检查网络" -ForegroundColor Yellow
}

Write-Host "`n按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

