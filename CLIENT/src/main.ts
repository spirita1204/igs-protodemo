// ============================================================================
// main.ts — Protobuf Client 教學範例
// ============================================================================
// 這個檔案實作前端邏輯：
//   1. 收集使用者輸入的表單資料
//   2. 使用 @bufbuild/protobuf 將資料序列化為 Protobuf 二進位格式
//   3. 發送 HTTP POST 到 SERVER
//   4. 接收 Protobuf 二進位回應並反序列化
//   5. 顯示回應結果
//
// 📌 關鍵概念：
//   - create(Schema) — 建立 Protobuf message 物件
//   - toBinary(Schema, msg) — 序列化為二進位（Uint8Array）
//   - fromBinary(Schema, bytes) — 從二進位反序列化
// ============================================================================

import { create, toBinary, fromBinary } from "@bufbuild/protobuf";
import {
  DemoRequestSchema,
  DemoResponseSchema,
  AddressSchema,
  Priority,
} from "./gen/demo_pb";
import type { DemoRequest, DemoResponse } from "./gen/demo_pb";
import "./style.css";

// ============================================================================
// 📌 Step 1: 建立 UI
// ============================================================================
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <header class="header">
      <div class="logo-glow"></div>
      <h1>🔌 Protobuf Demo</h1>
      <p class="subtitle">互動式 Protobuf 請求測試工具 — 新人教學範例</p>
    </header>

    <div class="main-grid">
      <!-- 左側：表單 -->
      <div class="card form-card">
        <h2>📝 請求參數</h2>
        <p class="card-desc">填寫以下欄位，每個欄位對應不同的 Protobuf 型別</p>
        
        <form id="proto-form">
          <!-- string 型別 -->
          <div class="form-group">
            <label for="name">
              <span class="type-badge">string</span> Name
            </label>
            <input type="text" id="name" placeholder="輸入你的名字" value="Alice" />
          </div>

          <!-- int32 型別 -->
          <div class="form-group">
            <label for="age">
              <span class="type-badge">int32</span> Age
            </label>
            <input type="number" id="age" placeholder="年齡（32 位元整數）" value="25" />
          </div>

          <!-- int64 型別 -->
          <div class="form-group">
            <label for="score">
              <span class="type-badge">int64</span> Score
            </label>
            <input type="number" id="score" placeholder="分數（64 位元整數）" value="9999999" />
          </div>

          <!-- float 型別 -->
          <div class="form-group">
            <label for="height">
              <span class="type-badge">float</span> Height
            </label>
            <input type="number" id="height" step="0.01" placeholder="身高（32 位元浮點數）" value="175.5" />
          </div>

          <!-- double 型別 -->
          <div class="form-group">
            <label for="weight">
              <span class="type-badge">double</span> Weight
            </label>
            <input type="number" id="weight" step="0.01" placeholder="體重（64 位元浮點數）" value="68.75" />
          </div>

          <!-- bool 型別 -->
          <div class="form-group checkbox-group">
            <label for="isActive">
              <span class="type-badge">bool</span> Is Active
            </label>
            <div class="toggle-wrapper">
              <input type="checkbox" id="isActive" checked />
              <span class="toggle-label" id="toggleLabel">true</span>
            </div>
          </div>

          <!-- enum 型別 -->
          <div class="form-group">
            <label for="priority">
              <span class="type-badge type-enum">enum</span> Priority
            </label>
            <select id="priority">
              <option value="0">UNSPECIFIED (0)</option>
              <option value="1">LOW (1)</option>
              <option value="2" selected>MEDIUM (2)</option>
              <option value="3">HIGH (3)</option>
            </select>
          </div>

          <!-- nested message 型別 -->
          <fieldset class="nested-group">
            <legend>
              <span class="type-badge type-message">message</span> Address（巢狀訊息）
            </legend>
            <div class="form-group">
              <label for="city">City <span class="field-type">string</span></label>
              <input type="text" id="city" placeholder="城市" value="Taipei" />
            </div>
            <div class="form-group">
              <label for="street">Street <span class="field-type">string</span></label>
              <input type="text" id="street" placeholder="街道" value="Xinyi Road" />
            </div>
            <div class="form-group">
              <label for="zipCode">Zip Code <span class="field-type">int32</span></label>
              <input type="number" id="zipCode" placeholder="郵遞區號" value="110" />
            </div>
          </fieldset>

          <!-- repeated 型別 -->
          <div class="form-group">
            <label for="tags">
              <span class="type-badge type-repeated">repeated</span> Tags
            </label>
            <input type="text" id="tags" placeholder="逗號分隔，例如：go,protobuf,demo" value="go,protobuf,demo" />
            <span class="hint">📌 repeated string = 字串陣列，用逗號分隔</span>
          </div>

          <!-- map 型別 -->
          <div class="form-group">
            <label for="metadata">
              <span class="type-badge type-map">map</span> Metadata
            </label>
            <textarea id="metadata" rows="3" placeholder="每行一組 key=value，例如：&#10;env=dev&#10;version=1.0">env=dev
version=1.0</textarea>
            <span class="hint">📌 map&lt;string, string&gt; = 字典，每行 key=value</span>
          </div>

          <!-- 送出按鈕 -->
          <button type="submit" id="sendBtn" class="send-btn">
            <span class="btn-icon">🚀</span>
            <span class="btn-text">發送 Protobuf 請求</span>
          </button>
        </form>
      </div>

      <!-- 右側：回應 -->
      <div class="card response-card">
        <h2>📡 回應結果</h2>
        
        <!-- 原始 bytes 資訊 -->
        <div class="info-section" id="bytesInfo" style="display:none">
          <h3>📦 傳輸資訊</h3>
          <div class="info-grid" id="transferInfo"></div>
        </div>

        <!-- 回應內容 -->
        <div id="responseArea" class="response-area">
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <p>尚未發送請求</p>
            <p class="empty-hint">填寫左側表單，點擊「發送」按鈕</p>
          </div>
        </div>

        <!-- 原始二進位 -->
        <div class="info-section" id="rawSection" style="display:none">
          <h3>🔍 原始二進位資料（Hex）</h3>
          <div class="hex-viewer" id="hexViewer"></div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>📚 教學提示：開啟瀏覽器 DevTools → Network 分頁，觀察 POST 請求的 Request/Response</p>
    </footer>
  </div>
`;

// ============================================================================
// 📌 Step 2: 綁定事件
// ============================================================================

// 切換 bool 顯示文字
const isActiveCheckbox = document.getElementById("isActive") as HTMLInputElement;
const toggleLabel = document.getElementById("toggleLabel")!;
isActiveCheckbox.addEventListener("change", () => {
  toggleLabel.textContent = isActiveCheckbox.checked ? "true" : "false";
});

// 表單送出
const form = document.getElementById("proto-form") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await sendProtobufRequest();
});

// ============================================================================
// 📌 Step 3: 發送 Protobuf 請求的核心邏輯
// ============================================================================
async function sendProtobufRequest(): Promise<void> {
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
  const responseArea = document.getElementById("responseArea")!;
  const bytesInfo = document.getElementById("bytesInfo")!;
  const transferInfo = document.getElementById("transferInfo")!;
  const rawSection = document.getElementById("rawSection")!;
  const hexViewer = document.getElementById("hexViewer")!;

  // 顯示載入狀態
  sendBtn.disabled = true;
  sendBtn.classList.add("loading");
  responseArea.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>發送中...</p></div>';

  try {
    // ===== 3a: 收集表單資料 =====
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const age = parseInt((document.getElementById("age") as HTMLInputElement).value) || 0;
    const score = BigInt((document.getElementById("score") as HTMLInputElement).value || "0");
    const height = parseFloat((document.getElementById("height") as HTMLInputElement).value) || 0;
    const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value) || 0;
    const isActive = (document.getElementById("isActive") as HTMLInputElement).checked;
    const priority = parseInt((document.getElementById("priority") as HTMLSelectElement).value) as Priority;

    const city = (document.getElementById("city") as HTMLInputElement).value;
    const street = (document.getElementById("street") as HTMLInputElement).value;
    const zipCode = parseInt((document.getElementById("zipCode") as HTMLInputElement).value) || 0;

    const tagsStr = (document.getElementById("tags") as HTMLInputElement).value;
    const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const metadataStr = (document.getElementById("metadata") as HTMLTextAreaElement).value;
    const metadata: { [key: string]: string } = {};
    if (metadataStr) {
      metadataStr.split("\n").forEach((line) => {
        const [k, ...vParts] = line.split("=");
        if (k && vParts.length > 0) {
          metadata[k.trim()] = vParts.join("=").trim();
        }
      });
    }

    // ===== 3b: 建立 Protobuf Message =====
    // 📌 create(Schema) 建立一個新的 message 物件
    const address = create(AddressSchema, { city, street, zipCode });

    const request: DemoRequest = create(DemoRequestSchema, {
      name,
      age,
      score,
      height,
      weight,
      isActive,
      priority,
      address,
      tags,
      metadata,
    });

    console.log("📤 準備發送的資料:", request);

    // ===== 3c: 序列化為二進位 =====
    // 📌 toBinary() 將 message 轉換為 Uint8Array（二進位陣列）
    // 這就是 Protobuf 的核心：資料被壓縮成緊湊的二進位格式
    const requestBytes: Uint8Array = toBinary(DemoRequestSchema, request);
    console.log(`📦 序列化後大小: ${requestBytes.length} bytes`);

    // ===== 3d: 發送 HTTP POST 請求 =====
    // 📌 Content-Type 設為 application/x-protobuf
    // 📌 body 直接放 Uint8Array（二進位資料）
    const response = await fetch("http://localhost:6688/protobuf-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-protobuf",
      },
      body: requestBytes as unknown as BodyInit,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // ===== 3e: 反序列化回應 =====
    // 📌 response.arrayBuffer() 取得回應的二進位資料
    // 📌 fromBinary() 將二進位資料轉換回 message 物件
    const responseBuffer = await response.arrayBuffer();
    const responseBytes = new Uint8Array(responseBuffer);
    const demoResponse: DemoResponse = fromBinary(DemoResponseSchema, responseBytes);
    console.log("📥 收到的回應:", demoResponse);

    // ===== 3f: 顯示傳輸資訊 =====
    bytesInfo.style.display = "block";
    transferInfo.innerHTML = `
      <div class="info-item">
        <span class="info-label">📤 Request 大小</span>
        <span class="info-value">${requestBytes.length} bytes</span>
      </div>
      <div class="info-item">
        <span class="info-label">📥 Response 大小</span>
        <span class="info-value">${responseBytes.length} bytes</span>
      </div>
      <div class="info-item">
        <span class="info-label">💡 對比 JSON</span>
        <span class="info-value">~${JSON.stringify(Object.fromEntries(
          Object.entries(request).filter(([k]) => !k.startsWith("$"))
        ), (_, v) => typeof v === 'bigint' ? v.toString() : v).length} bytes</span>
      </div>
    `;

    // ===== 3g: 顯示回應結果 =====
    const processedDate = new Date(Number(demoResponse.processedAt) * 1000);
    responseArea.innerHTML = `
      <div class="response-success ${demoResponse.success ? "success" : "error"}">
        <div class="response-field">
          <span class="field-name">success</span>
          <span class="field-value ${demoResponse.success ? "val-true" : "val-false"}">${demoResponse.success}</span>
        </div>
        <div class="response-field">
          <span class="field-name">message</span>
          <span class="field-value">${demoResponse.message}</span>
        </div>
        <div class="response-field">
          <span class="field-name">received_data_summary</span>
          <span class="field-value summary-value">${demoResponse.receivedDataSummary}</span>
        </div>
        <div class="response-field">
          <span class="field-name">processed_at</span>
          <span class="field-value">${demoResponse.processedAt.toString()} (${processedDate.toLocaleString()})</span>
        </div>
      </div>
    `;

    // ===== 3h: 顯示原始二進位（Hex） =====
    rawSection.style.display = "block";
    hexViewer.innerHTML = `
      <div class="hex-block">
        <div class="hex-label">Request (${requestBytes.length} bytes):</div>
        <code>${formatHex(requestBytes)}</code>
      </div>
      <div class="hex-block">
        <div class="hex-label">Response (${responseBytes.length} bytes):</div>
        <code>${formatHex(responseBytes)}</code>
      </div>
    `;

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    responseArea.innerHTML = `
      <div class="response-error">
        <div class="error-icon">❌</div>
        <h3>請求失敗</h3>
        <p>${errMsg}</p>
        <p class="error-hint">💡 請確認 SERVER 已在 localhost:6688 啟動</p>
      </div>
    `;
    bytesInfo.style.display = "none";
    rawSection.style.display = "none";
  } finally {
    sendBtn.disabled = false;
    sendBtn.classList.remove("loading");
  }
}

// ============================================================================
// 📌 工具函式：將 Uint8Array 格式化為 Hex 字串
// ============================================================================
function formatHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}
