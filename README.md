# 🔌 Protobuf Demo — 新人教學範例

這個專案展示 **Protocol Buffers (Protobuf)** 在前後端之間的完整通訊流程。

## 📁 專案結構

```
ProtoDemo/
├── PROTO/                    # 📝 原始 .proto 定義檔
│   └── demo.proto            #    定義了 DemoRequest / DemoResponse
│
├── SERVER/                   # 🖥️ Go + Gin 後端
│   ├── main.go               #    接收 Protobuf POST 請求
│   ├── pb/                   #    protoc 產生的 Go 程式碼
│   │   └── demo.pb.go
│   ├── generate.bat          #    一鍵產生 Go 程式碼
│   └── README.md
│
├── CLIENT/                   # 🌐 TypeScript 前端 (Vite)
│   ├── src/
│   │   ├── main.ts           #    發送 Protobuf 請求的邏輯
│   │   ├── style.css         #    UI 樣式
│   │   └── gen/              #    buf 產生的 TypeScript 程式碼
│   │       └── demo_pb.ts
│   ├── buf.gen.yaml          #    buf generate 設定
│   ├── generate.bat          #    一鍵產生 TypeScript 程式碼
│   └── README.md
│
└── README.md                 # 本檔案
```

## 🚀 快速開始

### 1. 啟動 SERVER

```bash
cd SERVER
go mod tidy       # 安裝 Go 依賴
go run main.go    # 啟動在 :8080
```

### 2. 啟動 CLIENT

```bash
cd CLIENT
npm install       # 安裝前端依賴
npm run dev       # 啟動在 :5173
```

### 3. 打開瀏覽器

訪問 `http://localhost:5173`，填寫表單，點擊「發送」按鈕！

## 📌 學習重點

| 概念 | 說明 |
|------|------|
| `.proto` 檔案 | 定義資料格式的「合約」，前後端共用 |
| `protoc` | Google 官方的 Protobuf 編譯器（SERVER 用） |
| `buf generate` | Buf 工具的程式碼產生（CLIENT 用） |
| `proto.Marshal` | Go: 序列化（struct → bytes） |
| `proto.Unmarshal` | Go: 反序列化（bytes → struct） |
| `toBinary()` | TS: 序列化（object → Uint8Array） |
| `fromBinary()` | TS: 反序列化（Uint8Array → object） |

## 🔧 重新產生 Protobuf 程式碼

修改 `PROTO/demo.proto` 後，需要重新產生程式碼：

```bash
# SERVER (Go) — 需要 protoc v4.25.1 + protoc-gen-go v1.28.1
cd SERVER
protoc --go_out=./pb --go_opt=module=proto-demo-server/pb -I../PROTO ../PROTO/demo.proto

# CLIENT (TypeScript) — 需要 npm install
cd CLIENT
npx buf generate ../PROTO
```
