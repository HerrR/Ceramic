if not exist ".\temp\database" mkdir .\temp\database
call npm install
call copy mongo-express.js .\node_modules\mongo-express\config.js /Y
call gulp developer