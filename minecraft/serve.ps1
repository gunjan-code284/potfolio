# Minecraft Server Hub Local Dev Server
$port = 3000
$listener = New-Object System.Net.HttpListener

function Start-Server($p) {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Prefixes.Add("http://127.0.0.1:$p/")
    try {
        $l.Start()
        return $l
    } catch {
        return $null
    }
}

$listener = Start-Server $port
if ($null -eq $listener) {
    $port = 5000
    $listener = Start-Server $port
}
if ($null -eq $listener) {
    $port = 8085
    $listener = Start-Server $port
}

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  MINECRAFT SERVER HUB LOCAL SERVER" -ForegroundColor Green
Write-Host "  URL: http://localhost:$port/" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

$baseDir = $PSScriptRoot

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        try {
            $rel = $req.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($rel)) {
                $rel = "index.html"
            }
            $rel = [System.Uri]::UnescapeDataString($rel)
            $targetFile = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $rel))

            if (-not $targetFile.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $targetFile -PathType Leaf)) {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
                $res.ContentLength64 = $msg.Length
                $res.OutputStream.Write($msg, 0, $msg.Length)
                $res.OutputStream.Close()
                continue
            }

            $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($targetFile)

            $res.StatusCode = 200
            $res.ContentType = $contentType
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.OutputStream.Close()
        } catch {
            try {
                $res.StatusCode = 500
                $res.OutputStream.Close()
            } catch {}
        }
    }
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
