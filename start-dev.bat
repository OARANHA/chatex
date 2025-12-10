@echo off
echo Iniciando 28web SaaS em modo desenvolvimento...

echo.
echo 1. Verificando se PostgreSQL esta rodando na porta 5432...
netstat -an | findstr ":5432" > nul
if %errorlevel% neq 0 (
    echo ERRO: PostgreSQL nao esta rodando na porta 5432
    echo Por favor, inicie o PostgreSQL antes de continuar
    pause
    exit /b 1
)

echo.
echo 2. Verificando se Redis esta rodando na porta 6379...
netstat -an | findstr ":6379" > nul
if %errorlevel% neq 0 (
    echo ERRO: Redis nao esta rodando na porta 6379
    echo Por favor, inicie o Redis antes de continuar
    pause
    exit /b 1
)

echo.
echo 3. Iniciando backend...
cd backend
start "Backend 28web" cmd /k "npm run dev:server"

echo.
echo 4. Aguardando backend iniciar...
timeout /t 10 /nobreak > nul

echo.
echo 5. Iniciando frontend...
cd ../frontend
start "Frontend 28web" cmd /k "npm run dev"

echo.
echo 6. Aguardando frontend iniciar...
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo 28web SaaS iniciado com sucesso!
echo ========================================
echo.
echo Acesse a aplicacao em: http://localhost:3003
echo Backend API: http://localhost:3100
echo.
echo Usuarios para teste:
echo - Super Admin: super@28web.io / 123456
echo - Admin: admin@28web.io / 123456
echo.
echo Pressione qualquer tecla para sair...
pause > nul