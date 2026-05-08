# 研究發現

## 技術選型
- SERVER: Go + Gin, protoc-gen-go v1.28.1, protoc v4.25.1
- CLIENT: TypeScript + Vite, buf generate
- PROTO: proto3 語法

## Proto 設計
- 使用多種 Protobuf 型別：string, int32, int64, float, double, bool, bytes, repeated, enum, nested message, map
- 包含 DemoRequest 和 DemoResponse 展示完整請求/回應流程
