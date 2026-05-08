# ============================================================================
# CLIENT — TypeScript Protobuf 前端範例
# ============================================================================
# 📌 這是一個 Vite + TypeScript 前端，用來發送和接收 Protobuf 格式的資料
#
# 🔧 前置準備：
#   1. 安裝 Node.js: https://nodejs.org/
#
# 🚀 快速開始：
#
#   Step 1: 安裝依賴
#   npm install
#
#   Step 2: 從 PROTO 資料夾產生 TypeScript 程式碼
#   npx buf generate ../PROTO
#   （產生的檔案會放在 src/gen/ 資料夾）
#
#   Step 3: 啟動開發伺服器
#   npm run dev
#
#   瀏覽器開啟 http://localhost:5173
#
# 📁 專案結構：
#   CLIENT/
#   ├── index.html           # HTML 入口
#   ├── package.json         # Node.js 依賴
#   ├── tsconfig.json        # TypeScript 設定
#   ├── buf.gen.yaml         # buf generate 設定
#   ├── generate.bat         # Windows: 一鍵產生 protobuf 程式碼
#   ├── src/
#   │   ├── main.ts          # 主程式（表單、Protobuf 發送邏輯）
#   │   ├── style.css        # 樣式
#   │   └── gen/             # buf 產生的 TypeScript 程式碼（自動產生）
#   │       └── demo_pb.ts
#   └── README.md            # 本檔案
#
# 📌 核心依賴：
#   - @bufbuild/protobuf  — Protobuf runtime（序列化/反序列化）
#   - @bufbuild/buf       — buf CLI（從 .proto 產生程式碼）
#   - @bufbuild/protoc-gen-es — buf 外掛（產生 TypeScript 程式碼）
# ============================================================================
