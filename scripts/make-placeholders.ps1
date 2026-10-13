Add-Type -AssemblyName System.Drawing

$dir = Join-Path (Get-Location) "public\images"
if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

function New-Canvas([int]$w, [int]$h) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    return @($bmp, $g)
}

function Get-Font([float]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
    foreach ($name in @('Space Grotesk', 'Segoe UI', 'Consolas')) {
        try { return New-Object System.Drawing.Font($name, $size, $style) } catch { continue }
    }
    return New-Object System.Drawing.Font('Arial', $size, $style)
}

# ---------- 1. PROFILE PLACEHOLDER (portrait 4:5) ----------
$c = New-Canvas 900 1125
$bmp, $g = $c
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point 900, 1125),
    [System.Drawing.Color]::FromArgb(18, 18, 24),
    [System.Drawing.Color]::FromArgb(10, 12, 8)
)
$g.FillRectangle($bg, 0, 0, 900, 1125)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(28, 28, 36)), 1
for ($x = 0; $x -lt 900; $x += 45) { $g.DrawLine($pen, $x, 0, $x, 1125) }
for ($y = 0; $y -lt 1125; $y += 45) { $g.DrawLine($pen, 0, $y, 900, $y) }

$accent = [System.Drawing.Color]::FromArgb(201, 242, 77)
$ringPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 201, 242, 77)), 2
$g.DrawEllipse($ringPen, 320, 300, 260, 260)
$g.DrawEllipse($ringPen, 352, 332, 196, 196)
$brush = New-Object System.Drawing.SolidBrush $accent
$g.FillEllipse($brush, 445, 455, 10, 10)

$ff = Get-Font 30 ([System.Drawing.FontStyle]::Bold)
$fb = New-Object System.Drawing.SolidBrush $accent
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("[YOUR PHOTO HERE]", $ff, $fb, (New-Object System.Drawing.RectangleF 0, 640, 900, 60), $sf)

$fm = Get-Font 19
$bm = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 120, 132))
$g.DrawString("public/images/profile.jpg", $fm, $bm, (New-Object System.Drawing.RectangleF 0, 700, 900, 40), $sf)
$g.DrawString("900 x 1125  -  drop your portrait here", $fm, $bm, (New-Object System.Drawing.RectangleF 0, 736, 900, 40), $sf)

$bmp.Save((Join-Path $dir "profile.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose()

# ---------- 2. PROJECT PLACEHOLDERS (16:10) ----------
$hues = @(
    @(201, 242, 77),
    @(120, 180, 255),
    @(255, 150, 90),
    @(160, 255, 200),
    @(210, 160, 255),
    @(255, 210, 110)
)

for ($i = 1; $i -le 6; $i++) {
    $c = New-Canvas 1200 750
    $bmp, $g = $c
    $rgb = $hues[($i - 1) % $hues.Count]
    $a = [System.Drawing.Color]::FromArgb(14, 15, 20)
    $b = [System.Drawing.Color]::FromArgb(10, 11, 15)
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point 0, 0), (New-Object System.Drawing.Point 1200, 750), $a, $b)
    $g.FillRectangle($bg, 0, 0, 1200, 750)

    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(22, 23, 30)), 1
    for ($x = 0; $x -lt 1200; $x += 50) { $g.DrawLine($pen, $x, 0, $x, 750) }
    for ($y = 0; $y -lt 750; $y += 50) { $g.DrawLine($pen, 0, $y, 1200, $y) }

    # abstract concentric motif
    $col = [System.Drawing.Color]::FromArgb(120, $rgb[0], $rgb[1], $rgb[2])
    for ($r = 340; $r -ge 90; $r -= 55) {
        $p = New-Object System.Drawing.Pen $col, 1.5
        $g.DrawEllipse($p, (600 - $r), (330 - $r), ($r * 2), ($r * 2))
        $p.Dispose()
    }
    $sb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, $rgb[0], $rgb[1], $rgb[2]))
    $g.FillEllipse($sb, 590, 320, 20, 20)

    $ff = Get-Font 34 ([System.Drawing.FontStyle]::Bold)
    $fb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 237, 236, 240))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("[PROJECT NAME]", $ff, $fb, (New-Object System.Drawing.RectangleF 0, 500, 1200, 60), $sf)

    $fm = Get-Font 20
    $bm = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(110, 154, 153, 166))
    $g.DrawString("project-$i.jpg  -  1200 x 750", $fm, $bm, (New-Object System.Drawing.RectangleF 0, 560, 1200, 40), $sf)

    $bmp.Save((Join-Path $dir "project-$i.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose(); $bmp.Dispose()
}

Write-Output "OK: placeholders written to public/images"
Get-ChildItem $dir | Select-Object Name, Length | Format-Table -AutoSize
