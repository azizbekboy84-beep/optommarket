# Windows uchun build script
Write-Host "🚀 Build jarayoni boshlandi..." -ForegroundColor Green

# Client qismini build qilish
Write-Host "`n🎨 Client qismini build qilish..." -ForegroundColor Cyan
npm run build:client

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client build xatolik bilan tugadi!" -ForegroundColor Red
    exit 1
}

# Server qismini build qilish (production entry point bilan)
Write-Host "`n⚙️ Server qismini build qilish..." -ForegroundColor Cyan
npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js --minify

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server build xatolik bilan tugadi!" -ForegroundColor Red
    exit 1
}

# Public papkasini yaratish va nusxalash
Write-Host "`n📂 Public fayllarini tayyorlash..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "dist/public" | Out-Null

if (Test-Path "client/dist") {
    Copy-Item -Path "client/dist/*" -Destination "dist/public/" -Recurse -Force
    Write-Host "✅ Client files ko'chirildi" -ForegroundColor Green
}

Write-Host "`n✅ Build muvaffaqiyatli yakunlandi!" -ForegroundColor Green
Write-Host "`n📁 Build natijasi:" -ForegroundColor Yellow
Get-ChildItem -Path "dist" -Recurse | Select-Object Name, Length, FullName | Format-Table -AutoSize
