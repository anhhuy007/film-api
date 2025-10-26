# Báo Cáo Hướng Dẫn Setup Database - API Film (NestJS & TypeORM)

---

## 1. Thiết Lập Môi Trường Database

Dự án sử dụng **Docker** để cô lập môi trường database, đảm bảo tính nhất quán giữa các môi trường phát triển.

### 1.1 Cấu hình Docker Database

Sử dụng image Docker chứa sẵn database **sakila** (MySQL mẫu):

**File**: `docker-compose.yml`
```yml
services:
  db:
    image: nxt964/sakila-mysql:latest
    container_name: mysql_db
    restart: always
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sakila
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

| Thuộc tính | Giá trị | Mục đích |
| :--- | :--- | :--- |
| **Image** | `nxt964/sakila-mysql:latest` | Chứa dữ liệu bảng `sakila` sẵn có. |
| **Container Name** | `mysql_db` | Tên container. |
| **Port Mapping** | `3306:3306` | Ánh xạ cổng DB ra host. |
| **MYSQL_USER** | `user` | Tài khoản kết nối từ ứng dụng. |
| **MYSQL_PASSWORD** | `password` | Mật khẩu tài khoản. |
| **MYSQL_DATABASE** | `sakila` | Tên database. |

### 1.2 Import Dữ Liệu

1. Khởi động container Docker: mở terminal trong thư mục dự án và gõ lệnh:
```
docker-compose up -d
```

2. Sử dụng công cụ **DBeaver** để kết nối đến DB với các thông số:
    * **Type**: `MySQL`
    * **Host**: `localhost`
    * **Port**: `3306`
    * **User**: `user`
    * **Password**: `password`
    * **Database**: `sakila`
3. Thực thi file SQL đã chuẩn bị trong thư mục dự án (`sakila-mysql.sql`) để đảm bảo các bảng và dữ liệu mẫu (row) đã sẵn sàng cho database

---

## 2. Tích hợp sử dụng TypeORM (Kết Nối NestJS)

### 2.1 Cài đặt các package dependency cần thiết:

```bash
npm install typeorm @nestjs/typeorm mysql2
```

### 2.2 Cấu hình TypeORM:

Ứng dụng **NestJS** kết nối đến container MySQL bằng module `TypeOrmModule.forRoot()`.

**File**: `src/app.module.ts`

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // Kết nối với cổng 3306 trên host (từ Docker)
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'sakila',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Rất quan trọng: Không tự động thay đổi schema DB.
    }),
    FilmModule,
  ],
  // ...
})
export class AppModule {}
```
### 2.3 Triển Khai Module Film (CRUD)
#### - Film Entity: 
File: `src/film/entities/film.entity.ts`

- Ánh xạ tới bảng `film`: `(@Entity('film'))`.

- Sử dụng `@PrimaryGeneratedColumn()` cho `filmId`.

- Sử dụng `@ApiProperty()` trên tất cả các trường để hỗ trợ tạo tài liệu Swagger *(Hướng dẫn tiếp theo trong `SetupSwagger.md`)*.

#### - Film DTOs (API Validation): 
Folder: `src/film/dto`
- `CreateFilmDto`: Chứa các **decorator** `class-validator` để kiểm tra tính hợp lệ của dữ liệu đầu vào (ví dụ: `@IsString()`, `@IsNotEmpty()` cho title, `@IsIn()` cho rating).

- `UpdateFilmDto`: Sử dụng `PartialType(CreateFilmDto)` để tự động làm cho tất cả các trường là tùy chọn, phù hợp cho hành động **PATCH**.

#### - Film Service (Business Logic)
File: `src/film/film.service.ts`

- Sử dụng `@InjectRepository(Film)` để tiêm **TypeORM Repository**

- Thực hiện logic CRUD cơ bản:
    - `create()`: Sử dụng `filmRepository.save(film)` sau khi tạo entity.

    - `findAll()`: `filmRepository.find()`.

    - `findOne()`: `filmRepository.findOneBy({ filmId: id })`. Xử lý `NotFoundException` nếu không tìm thấy.

    - `update()`: Sử dụng `filmRepository.preload()` để tải bản ghi hiện có và hợp nhất dữ liệu, sau đó xử lý `NotFoundException`.

    - `remove()`: Sử dụng `filmRepository.delete(id)` và kiểm tra `result.affected === 0` để xử lý `NotFoundException`.

#### - Film Controller (Endpoints)
File: `src/film/film.controller.ts`

- **Endpoint**: `/film`

- Sử dụng `ParseIntPipe` trong `@Param('id', ParseIntPipe)` để đảm bảo tham số ID trong URL là số nguyên hợp lệ và giúp **API Validation**.

- Các phương thức được định nghĩa:

    - **@POST /film:** `create(@Body() createFilmDto)`

    - **@GET /film:** `findAll()`

    - **@GET /film/:id:** `findOne(@Param('id'))`

    - **@PATCH /film/:id:** `update(@Param('id'), @Body() updateFilmDto)`

    - **@DELETE /film/:id:** `remove(@Param('id'))`