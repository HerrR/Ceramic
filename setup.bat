if not exist ".\temp\database" mkdir .\temp\database
call openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out local.crt -keyout local.key
call npm install
call copy mongo-express.js .\node_modules\mongo-express\config.js /Y
call gulp developer