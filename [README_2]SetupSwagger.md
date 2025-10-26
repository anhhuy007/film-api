# Báo Cáo Hướng Dẫn Setup Swagger (API Documentation)

---

## 1. Cài Đặt Các Dependencies

Cài đặt gói `@nestjs/swagger` và các thư viện hỗ trợ giao diện người dùng.

```bash
npm install --save @nestjs/swagger swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

## 2. Cấu Hình Swagger trong main.ts
Sử dụng `DocumentBuilder` và `SwaggerModule` để tạo và khởi tạo tài liệu API trong file bootstrap chính của ứng dụng.

**File**: `src/main.ts`

```typescript
// Thêm import
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Áp dụng Global Validation Pipe:
  // - `whitelist: true`: Đảm bảo chỉ các thuộc tính được định nghĩa trong DTO mới được phép.
  // - `transform: true`: Tự động chuyển đổi các payload thành kiểu DTO đã định nghĩa.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  // --- Cấu Hình Swagger (OpenAPI) ---
  const config = new DocumentBuilder()
    .setTitle('Film API')
    .setDescription('NestJS CRUD API for Films')
    .setVersion('1.0')
    .addBearerAuth() // Nếu có sử dụng xác thực token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Thiết lập đường dẫn để truy cập tài liệu Swagger tại: http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  // Thêm log để check 
  console.log(`Server is running on http://localhost:3000`);
  console.log(`Swagger docs at http://localhost:3000/api`);
}

bootstrap();
```

## 3. Thêm Decorator API Property vào DTOs và Entities

Để Swagger có thể tạo schema chính xác và đầy đủ, cần sử dụng các decorator của nó:

- `@ApiProperty()` / `@ApiPropertyOptional()`: Được thêm vào các trường trong **DTOs** (`CreateFilmDto`, `UpdateFilmDto`) và **Entities**(`Film`) để mô tả kiểu dữ liệu, yêu cầu, và giá trị enum/mặc định cho tài liệu.

- Ví dụ trong **DTO**: `src/film/dto/create-film.dto.ts`

```typescript
// Import
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFilmDto {
  @ApiProperty() // Hiển thị trường bắt buộc trong Swagger
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'] })
  @IsString()
  @IsOptional()
  @IsIn(['G', 'PG', 'PG-13', 'R', 'NC-17'])
  rating?: string;
  // ... Tương tự cho các field khác
}
```

## 4. Hướng Dẫn Khởi Động Ứng Dụng
### 4.1 Khởi động Database (Docker)
1. Đảm bảo đã cài đặt **Docker** và **Docker Compose**.
2. Mở terminal tại thư mục chứa file `docker-compose.yml`.

3. Chạy lệnh sau để tải image, tạo và khởi động container MySQL:

```bash
docker-compose up -d
```
=> Database MySQL sẽ chạy trên cổng 3306 với database sakila.

### 4.2 Khởi động NestJS App
1. Đảm bảo đã cài đặt các dependencies: mở terminal tại thư mục dự án và chạy 

```bash
npm install
```

2. Khởi động ứng dụng NestJS:

```bash
npm run start
```

### 4.3 Kiểm Tra Kết Quả
Sau khi khởi động thành công, truy cập vào:

- **API Server**: http://localhost:3000

- **Tài liệu GUI Swagger (API Docs)**: http://localhost:3000/api

## 5. Lưu Ý Quan Trọng về API Validation
Việc sử dụng đồng thời `ValidationPipe` và các decorator `class-validator` (như `@IsNotEmpty()`, `@IsInt()`, `@IsIn()`) đảm bảo rằng API đã được bảo vệ khỏi dữ liệu không hợp lệ. **Swagger** sử dụng các decorator `@ApiProperty()` để hiển thị các quy tắc này một cách trực quan trong tài liệu API.