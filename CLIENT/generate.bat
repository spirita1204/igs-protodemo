@echo off
REM ============================================================================
REM generate.bat — 從 .proto 產生 TypeScript 程式碼（Windows）
REM ============================================================================
REM 📌 使用方式：在 CLIENT 資料夾內執行此腳本
REM
REM 前置條件：
REM   1. 已執行 npm install（安裝了 @bufbuild/buf 和 @bufbuild/protoc-gen-es）
REM ============================================================================

echo 🔨 正在從 .proto 產生 TypeScript 程式碼...

REM 執行 buf generate
REM   ../PROTO    : 指定 proto 檔案的路徑
REM   buf 會讀取 buf.gen.yaml 的設定來決定輸出位置和格式
npx buf generate ../PROTO

if %errorlevel% equ 0 (
    echo ✅ 成功！產生的檔案在 src/gen/ 資料夾
) else (
    echo ❌ 失敗！請檢查是否已執行 npm install
)

pause
