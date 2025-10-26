$srcTxt = "$env:USERPROFILE\Downloads\world-map-data-uri.txt"
if (-Not (Test-Path $srcTxt)) { Write-Error "$srcTxt not found"; exit 1 }
$txt = Get-Content $srcTxt -Raw
$b64 = if ($txt.StartsWith('data:')) { $txt.Split(',')[1] } else { $txt }
$out = Join-Path (Get-Location) 'public\world-map-user.jpg'
[IO.File]::WriteAllBytes($out, [Convert]::FromBase64String($b64))
Write-Host "Wrote $out"
npm run build
