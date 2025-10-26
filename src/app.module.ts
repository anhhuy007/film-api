import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModule } from './film/film.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging';
import LokiTransport from 'winston-loki';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'sakila',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          dirname: 'logs',                    // thư mục chứa log
          filename: 'app.log.csv',            // file CSV
          level: 'info',                      // chỉ ghi log với level 'info' trở lên
          maxsize: 20 * 1024 * 1024,          // giới hạn file 20MB
          maxFiles: 1,                        // chỉ 1 file
          tailable: true,                     // tự xoay vòng (backup 1 file cũ sau đó ghi đè)
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, message }) => {
              return `${timestamp},${message}`; // format CSV
            }),
          ),
        }),
        new LokiTransport({
          host: 'http://localhost:3100',  // Host Loki server đã chạy trong docker-compose 
          labels: { app: 'nestjs-film-api', env: process.env.NODE_ENV || 'development' }, // Labels để nhóm log trong Loki (rất quan trọng)
          json: true,
          format: winston.format.json(), // Sử dụng JSON format để Loki dễ dàng phân tích
          level: 'info', // Gửi tất cả log từ level 'info' trở lên
        }),
      ],
    }),
    FilmModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}