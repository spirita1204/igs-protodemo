@echo off
REM ============================================================================
REM generate.bat — 從 .proto 產生 Go 程式碼（Windows）
REM ============================================================================
REM 📌 使用方式：在 SERVER 資料夾內執行此腳本
REM
REM 前置條件：
REM   1. 已安裝 protoc v4.25.1
REM   2. 已安裝 protoc-gen-go v1.28.1
REM      go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28.1
REM ============================================================================

echo 🔨 正在從 .proto 產生 Go 程式碼...

REM 建立 pb 資料夾（如果不存在）
if not exist "pb" mkdir pb

REM 執行 protoc
REM   --go_out=.                  : 輸出到當前目錄
REM   --go_opt=paths=source_relative : 使用相對路徑
REM   -I../PROTO                  : proto 檔案的搜尋路徑
REM   ../PROTO/demo.proto         : 要編譯的 proto 檔案
protoc --go_out=./pb --go_opt=module=proto-demo-server/pb -I../PROTO ../PROTO/demo.proto

if %errorlevel% equ 0 (
    echo ✅ 成功！產生的檔案在 pb/ 資料夾
) else (
    echo ❌ 失敗！請檢查 protoc 和 protoc-gen-go 是否已安裝
)

pause
