package main

import (
	"fmt"
	"proto-demo-server/pb" // 這是由 protoc 從 .proto 產生的 Go 程式碼

	"google.golang.org/protobuf/proto"
)

// ============================================================================
// main.go — Go + Gin Protobuf Server 教學範例
// ============================================================================
// 這個 SERVER 接收 CLIENT 發送的 Protobuf 二進位資料，
// 解碼（反序列化）後讀取內容，再回傳 Protobuf 格式的回應。
//
// 📌 流程：
//   1. CLIENT 將表單資料序列化為 Protobuf 二進位格式
//   2. 透過 HTTP POST 發送到 /protobuf-test
//   3. SERVER 讀取 HTTP Body（二進位資料）
//   4. 使用 proto.Unmarshal 反序列化為 Go struct
//   5. 處理資料後，用 proto.Marshal 序列化回應
//   6. 回傳 Protobuf 二進位格式的回應
// ============================================================================

func main() {
	// demoRequest 是指向 pb.DemoRequest 的指標
	demoRequest := &pb.DemoRequest{
		Name:     "Alice",
		Age:      30,
		Score:    85,
		Height:   165.5,
		Weight:   60.0,
		IsActive: true,
		Priority: pb.DemoRequest_Priority(pb.Priority_PRIORITY_HIGH),
		Address: &pb.Address{
			City:    "Taipei",
			Street:  "123 Main St",
			ZipCode: 100,
		},
		Tags: []string{"golang", "protobuf", "gin"},
		Metadata: map[string]string{
			"version": "1.0",
			"env":     "production",
		},
	}
	fmt.Printf("DemoRequest struct:\n%+v\n", demoRequest)
	fmt.Printf("Height: %.2f\n", demoRequest.GetHeight())
	// 將資料轉成protobuf二進位格式
	protoData, err := proto.Marshal(demoRequest)
	if err != nil {
		fmt.Printf("Failed to marshal demoRequest: %v\n", err)
		return
	}
	fmt.Printf("Protobuf binary data: %v\n", protoData)
	// 將protobuf二進位格式轉回struct
	var decodedRequest pb.DemoRequest
	err = proto.Unmarshal(protoData, &decodedRequest)
	if err != nil {
		fmt.Printf("Failed to unmarshal protoData: %v\n", err)
		return
	}
	fmt.Printf("Decoded DemoRequest struct:\n%+v\n", &decodedRequest)
	// 使用pb提供的map 印出Priority
	priorityName := pb.Priority_name[int32(decodedRequest.GetPriority())]
	fmt.Printf("Decoded Priority: %s\n", priorityName)
	// 取得protobuf資料版本不符情況 – 取得資料欄位較少 定義多一個欄位的struct 欲轉回成demoResponse struct
	DemoResponseExtendFields := &pb.DemoResponseExtendFields{
		Success:             true,
		Message:             "Hello, World!",
		ProcessedAt:         1234567890,
		ReceivedDataSummary: "123",
		ExtraInfo:           "Extra Value 1",
	}
	protoDataExtend, err := proto.Marshal(DemoResponseExtendFields)

	if err != nil {
		fmt.Printf("Failed to marshal DemoResponseExtendFields: %v\n", err)
		return
	}
	var decodedResponse pb.DemoResponse
	err = proto.Unmarshal(protoDataExtend, &decodedResponse)
	if err != nil {
		fmt.Printf("Failed to unmarshal protoDataExtend: %v\n", err)
		return
	}
	fmt.Printf("Decoded DemoResponse struct:\n%+v\n", &decodedResponse)

	// 	// ===== 建立 Gin 路由器 =====
	// 	// gin.Default() 會自動加上 Logger 和 Recovery 中介軟體
	// 	r := gin.Default()

	// 	// ===== 處理 CORS（跨來源請求） =====
	// 	// 📌 因為 CLIENT 和 SERVER 在不同的 port，瀏覽器會擋住跨來源請求
	// 	// 我們需要手動設定 CORS headers 來允許 CLIENT 的請求
	// 	r.Use(func(c *gin.Context) {
	// 		c.Header("Access-Control-Allow-Origin", "*")
	// 		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS")
	// 		c.Header("Access-Control-Allow-Headers", "Content-Type")

	// 		// 📌 瀏覽器在發送非簡單請求前，會先發一個 OPTIONS 預檢請求
	// 		if c.Request.Method == "OPTIONS" {
	// 			c.AbortWithStatus(http.StatusNoContent)
	// 			return
	// 		}

	// 		c.Next()
	// 	})

	// 	// ===== 註冊路由 =====
	// 	// POST /protobuf-test — 接收 Protobuf 格式的請求
	// 	r.POST("/protobuf-test", handleProtobufTest)

	// 	// ===== 啟動伺服器 =====
	// 	log.Println("🚀 Server 啟動中，監聽 :6688")
	// 	log.Println("📡 POST http://localhost:6688/protobuf-test")
	// 	if err := r.Run(":6688"); err != nil {
	// 		log.Fatalf("❌ Server 啟動失敗: %v", err)
	// 	}
	// }

	// // handleProtobufTest 處理 Protobuf POST 請求
	// func handleProtobufTest(c *gin.Context) {
	// 	// ===== Step 1 & 2: 讀取 HTTP Body 並反序列化 =====
	// 	// 📌 使用 c.MustBindWith 搭配 binding.ProtoBuf 自動讀取並反序列化
	// 	req := &pb.DemoRequest{}
	// 	if err := c.MustBindWith(req, binding.ProtoBuf); err != nil {
	// 		log.Printf("❌ 讀取或反序列化 request body 失敗: %v", err)
	// 		// 📌 MustBindWith 出錯時會自動設定 400 Status，所以我們只要 return 即可
	// 		return
	// 	}
	// 	log.Printf("📦 成功解析 Protobuf 資料")

	// 	// ===== Step 3: 印出收到的資料 =====
	// 	log.Println("========== 收到的資料 ==========")
	// 	log.Printf("  Name:      %s", req.Name)
	// 	log.Printf("  Age:       %d", req.Age)
	// 	log.Printf("  Score:     %d", req.Score)
	// 	log.Printf("  Height:    %.2f", req.Height)
	// 	log.Printf("  Weight:    %.2f", req.Weight)
	// 	log.Printf("  IsActive:  %v", req.IsActive)
	// 	log.Printf("  Priority:  %s", req.Priority.String())
	// 	if req.Address != nil {
	// 		log.Printf("  Address:   %s, %s, %d", req.Address.City, req.Address.Street, req.Address.ZipCode)
	// 	}
	// 	log.Printf("  Tags:      %v", req.Tags)
	// 	log.Printf("  Metadata:  %v", req.Metadata)
	// 	log.Println("================================")

	// 	// ===== Step 4: 建立回應 =====
	// 	summary := buildSummary(req)
	// 	resp := &pb.DemoResponse{
	// 		Success:             true,
	// 		Message:             fmt.Sprintf("✅ 成功收到來自 %s 的資料！", req.Name),
	// 		ReceivedDataSummary: summary,
	// 		ProcessedAt:         time.Now().Unix(),
	// 	}

	// 	// ===== Step 5 & 6: 序列化並回傳 Protobuf 回應 =====
	// 	// 📌 c.ProtoBuf 自動將 Go struct 序列化為 Protobuf 二進位，
	// 	// 並設定 Content-Type 為 application/x-protobuf
	// 	c.ProtoBuf(http.StatusOK, resp)
	// 	log.Printf("📤 成功回傳 Protobuf 回應")

	// }

	// // buildSummary 將收到的資料組成摘要字串
	// func buildSummary(req *pb.DemoRequest) string {
	// 	var parts []string
	// 	parts = append(parts, fmt.Sprintf("Name=%s", req.Name))
	// 	parts = append(parts, fmt.Sprintf("Age=%d", req.Age))
	// 	parts = append(parts, fmt.Sprintf("Score=%d", req.Score))
	// 	parts = append(parts, fmt.Sprintf("Height=%.2f", req.Height))
	// 	parts = append(parts, fmt.Sprintf("Weight=%.2f", req.Weight))
	// 	parts = append(parts, fmt.Sprintf("IsActive=%v", req.IsActive))
	// 	parts = append(parts, fmt.Sprintf("Priority=%s", req.Priority.String()))
	// 	if req.Address != nil {
	// 		parts = append(parts, fmt.Sprintf("Address={%s, %s, %d}", req.Address.City, req.Address.Street, req.Address.ZipCode))
	// 	}
	// 	if len(req.Tags) > 0 {
	// 		parts = append(parts, fmt.Sprintf("Tags=[%s]", strings.Join(req.Tags, ", ")))
	// 	}
	// 	if len(req.Metadata) > 0 {
	// 		var metaParts []string
	// 		for k, v := range req.Metadata {
	// 			metaParts = append(metaParts, fmt.Sprintf("%s:%s", k, v))
	// 		}
	// 		parts = append(parts, fmt.Sprintf("Metadata={%s}", strings.Join(metaParts, ", ")))
	// 	}
	// 	return strings.Join(parts, " | ")
}
