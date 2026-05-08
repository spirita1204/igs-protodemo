# 任務計畫：Protobuf Demo 教學專案

## 目標
建立一個包含 PROTO、SERVER、CLIENT 三個資料夾的教學專案，展示 Protobuf 在 Go(Gin) 後端與 TypeScript 前端之間的完整通訊流程。

## 目前階段
階段 5（已完成）

## 各階段

### 階段 1：需求確認
- [x] 理解使用者意圖 — 新人教學用 Demo
- [x] 確定技術選型
- **狀態：** complete

### 階段 2：建立 PROTO 資料夾
- [x] 建立 .proto 檔案，涵蓋多種 Protobuf 型別
- [x] 確保 proto 定義清楚且有教學註解
- **狀態：** complete

### 階段 3：建立 SERVER (Go + Gin)
- [x] 初始化 Go module
- [x] 使用 protoc 產生 Go 程式碼 (protoc-gen-go v1.28.1, protoc v4.25.1)
- [x] 實作 POST /protobuf-test 路由
- [x] 加入教學註解
- **狀態：** complete

### 階段 4：建立 CLIENT (TypeScript)
- [x] 初始化前端專案 (Vite + TypeScript)
- [x] 使用 buf generate 產生 TypeScript 程式碼
- [x] 實作表單 UI（各種 Protobuf 型別輸入）
- [x] 實作發送 Protobuf POST 請求
- [x] 顯示回應結果
- **狀態：** complete

### 階段 5：驗證與交付
- [x] 確認三個資料夾結構完整
- [x] 確認所有檔案都有教學註解
- [x] 交付給使用者
- **狀態：** complete

## 已做決策
| 決策 | 理由 |
|------|------|
| Proto 使用 DemoRequest/DemoResponse 包含多種型別 | 教學目的：展示 string, int32, float, bool, repeated, enum, nested message |
| SERVER 使用 protoc CLI 產生程式碼 | 使用者指定 protoc-gen-go v1.28.1 + protoc v4.25.1 |
| CLIENT 使用 buf generate | 使用者指定 |
| CLIENT 使用 Vite + TypeScript | 輕量且適合教學 |

## 遇到的錯誤
| 錯誤 | 嘗試次數 | 解決方案 |
|------|---------|---------|
|      | 1       |         |
