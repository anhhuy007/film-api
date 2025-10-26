## Hướng dẫn chạy và kiểm thử Film API

Tài liệu này hướng dẫn cách cài đặt, chạy và kiểm thử Film API. Dự án hỗ trợ ba nhóm người dùng chính:

* **Internal services** – dịch vụ nội bộ.
* **Partner** – đối tác nhỏ (dưới 10 người dùng).
* **Public users** – người dùng công khai đăng nhập qua JWT.

---

### 1. Cài đặt và chạy ứng dụng

1. Cài đặt các dependencies:

   ```bash
   npm install
   ```

2. Thiết lập các biến môi trường cần thiết (trong file `.env`):

   * `INTERNAL_API_KEY`: API key dành cho các dịch vụ nội bộ.
   * `CLIENTS_API_KEYS`: JSON object ánh xạ API key của đối tác với tên client.
     Ví dụ:
     `{"partner-key-abc": "partnerA", "partner-key-def": "partnerB"}`

3. Chạy ứng dụng ở chế độ phát triển:

   ```bash
   npm run start:dev
   ```

   Trước đó cần chạy lệnh docker-compose để start database:

   ```bash
   docker-compose up -d
   ```

---

### 2. Danh sách các endpoint chính

Film API được chia thành ba nhóm endpoint theo loại người dùng:

#### **Internal (dành cho dịch vụ nội bộ)**

| Method | Endpoint             | Mô tả              |
| :----- | :------------------- | :----------------- |
| POST   | `/internal/film`     | Tạo film mới       |
| GET    | `/internal/film`     | Lấy danh sách film |
| GET    | `/internal/film/:id` | Xem chi tiết film  |
| PATCH  | `/internal/film/:id` | Cập nhật film      |
| DELETE | `/internal/film/:id` | Xóa film           |

**Authentication:**
Dùng header:
`x-api-key: <INTERNAL_API_KEY>`

---

#### **Partner (dành cho đối tác nhỏ)**

| Method | Endpoint            | Mô tả                                        |
| :----- | :------------------ | :------------------------------------------- |
| POST   | `/partner/film`     | Tạo film (tự động gán `request.client.name`) |
| GET    | `/partner/film`     | Lấy danh sách film                           |
| GET    | `/partner/film/:id` | Xem chi tiết film                            |
| PATCH  | `/partner/film/:id` | Cập nhật film                                |
| DELETE | `/partner/film/:id` | Xóa film                                     |

**Authentication:**
Header:
`x-api-key: <partner-api-key>`
(API key ánh xạ qua biến `CLIENTS_API_KEYS` trong config)

---

#### **Public (người dùng đăng nhập bằng JWT)**

| Method | Endpoint           | Mô tả                      |
| :----- | :----------------- | :------------------------- |
| POST   | `/public/film`     | Tạo film (chỉ ADMIN)       |
| GET    | `/public/film`     | Lấy danh sách public       |
| GET    | `/public/film/:id` | Xem chi tiết (yêu cầu JWT) |
| PATCH  | `/public/film/:id` | Cập nhật (yêu cầu JWT)     |
| DELETE | `/public/film/:id` | Xóa (yêu cầu JWT)          |

**Authentication:**
Header:
`Authorization: Bearer <accessToken>`
Token lấy từ endpoint `/auth/login`

---

### 3. Lấy JWT cho public users

Để đăng nhập (hiện đang dùng mock users trong `AuthService`):

**Endpoint:**
`POST /auth/login`

**Body:**

```json
{ "username": "admin", "password": "password123" }
```

**Response:**

```json
{ "accessToken": "<jwt>" }
```

**Ví dụ sử dụng curl:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

---

### 4. Ví dụ curl cho từng loại người dùng

#### **Internal service**

```bash
curl -X POST http://localhost:3000/internal/film \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${INTERNAL_API_KEY}" \
  -d '{"title":"Internal Movie","description":"..."}'
```

#### **Partner**

```bash
curl -X POST http://localhost:3000/partner/film \
  -H "Content-Type: application/json" \
  -H "x-api-key: partner-key-abc" \
  -d '{"title":"Partner Movie","description":"..."}'
```

#### **Public user**

```bash
# Lấy token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r .accessToken)

# Gọi endpoint với Bearer token
curl -X POST http://localhost:3000/public/film \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Public Movie","description":"..."}'
```

> ⚠️ **Lưu ý:**
> `AuthService` hiện chỉ mock sẵn hai user:
> `admin/password123` và `john/password456`.
> Trong môi trường production, thông tin tài khoản user sẽ được lưu trữ trên database.

---

### 5. Kiểm thử nhanh (Smoke Tests)

1. **Kiểm tra Internal API key**

   ```bash
   curl -I -s -X GET http://localhost:3000/internal/film \
     -H "x-api-key: ${INTERNAL_API_KEY}"
   ```

2. **Kiểm tra Partner API key**

   ```bash
   curl -I -s -X GET http://localhost:3000/partner/film \
     -H "x-api-key: partner-key-abc"
   ```

3. **Kiểm tra đăng nhập và endpoint Public**

   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password123"}' | jq -r .accessToken)

   curl -I -s -X GET http://localhost:3000/public/film \
     -H "Authorization: Bearer $TOKEN"
   ```
