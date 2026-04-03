# Registrar usuario admin
$body = '{"username":"admin","email":"admin@test.com","password":"admin1234"}'
$reg = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method POST -Body $body -ContentType 'application/json' -ErrorAction SilentlyContinue

# Si ya existe, hacer login
if (-not $reg) {
    $reg = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method POST -Body '{"username":"admin","password":"admin1234"}' -ContentType 'application/json'
}

$token = $reg.token
Write-Host "Token obtenido: $($token.Substring(0,20))..."

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

$productos = @(
    @{ name="Uniforme Completo"; price=150000; stock=20; description="Uniforme de guardia penitenciario, alta resistencia y comodidad." },
    @{ name="Gorra Institucional"; price=35000; stock=50; description="Gorra oficial para personal de seguridad." },
    @{ name="Camisa Tactica"; price=65000; stock=30; description="Camisa tactica de manga larga, color azul institucional." },
    @{ name="Pantalon Cargo"; price=80000; stock=25; description="Pantalon cargo resistente con multiples bolsillos." },
    @{ name="Botas Seguridad"; price=120000; stock=15; description="Botas de seguridad con puntera reforzada." },
    @{ name="Cinturon Tactico"; price=45000; stock=40; description="Cinturon tactico con hebilla metalica de alta durabilidad." }
)

foreach ($prod in $productos) {
    $json = $prod | ConvertTo-Json -Compress
    $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/products/' -Method POST -Body $json -Headers $headers
    Write-Host "Creado: $($res.product.name) - $($res.product.price)"
}

Write-Host "Listo! Recarga localhost:3000"
