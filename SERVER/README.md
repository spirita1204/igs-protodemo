# ============================================================================
# SERVER — Go + Gin Protobuf 範例
# ============================================================================
# 📌 這是一個簡單的 Go Server，用來接收和回應 Protobuf 格式的資料
#
# 🔧 前置準備：
#   1. 安裝 Go: https://go.dev/dl/
#   2. 安裝 protoc v4.25.1: https://github.com/protocolbuffers/protobuf/releases
#   3. 安裝 protoc-gen-go:
#      go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28.1
#
# 🚀 快速開始：
#
#   Step 1: 從 PROTO 資料夾產生 Go 程式碼
#   protoc --go_out=./pb --go_opt=module=proto-demo-server/pb -I../PROTO ../PROTO/demo.proto
#   （產生的檔案會放在 pb/ 資料夾）
#
#   Step 2: 安裝依賴
#   go mod tidy
#
#   Step 3: 啟動 Server
#   go run main.go
#
#   Server 會在 http://localhost:8080 啟動
#   接收 POST 請求: http://localhost:8080/protobuf-test
#
# 📁 專案結構：
#   SERVER/
#   ├── main.go          # 主程式（Gin 路由 + Protobuf 處理）
#   ├── go.mod           # Go module 定義
#   ├── go.sum           # 依賴鎖定檔
#   ├── pb/              # protoc 產生的 Go 程式碼（自動產生，不要手動修改）
#   │   └── demo.pb.go
#   ├── generate.bat     # Windows: 一鍵產生 protobuf 程式碼
#   ├── generate.sh      # macOS/Linux: 一鍵產生 protobuf 程式碼
#   └── README.md        # 本檔案
# ============================================================================
