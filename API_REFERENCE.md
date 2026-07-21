# SocialGraph Atlas • API Reference

All APIs return standardized headers and correlation IDs (`X-Correlation-ID`).

---

## Endpoints

### 1. Submit Profile for Analysis
- **`POST /api/analyze`**
- **Rate Limit**: 30 requests / minute
- **Request Body**:
  ```json
  {
    "url": "https://github.com/torvalds"
  }
  ```
- **Response (202 Accepted)**:
  ```json
  {
    "success": true,
    "data": {
      "jobId": "c8a412f8-9a3d-4c3e-8a12-123456789abc",
      "status": "PENDING"
    },
    "meta": {
      "correlationId": "req-1721580000000"
    }
  }
  ```

---

### 2. Fetch Job Details & Data
- **`GET /api/analyze?jobId={jobId}`**
- **Response (200 OK)**:
  Returns full `AnalysisJob` model including `profiles`, `entities`, `locations`, `edges`, `evidenceItems`, and `metrics`.

---

### 3. Export Intelligence Data
- **`GET /api/exports?jobId={jobId}&format={json|csv|pdf|html}`**
- **Formats**:
  - `json`: Structured JSON attachment.
  - `csv`: Multi-section CSV report.
  - `pdf` / `html`: Printable standalone executive report HTML document.

---

### 4. Saved Reports History
- **`GET /api/reports?limit=50&offset=0&status=COMPLETED`**
- **`DELETE /api/reports?id={jobId}`**
