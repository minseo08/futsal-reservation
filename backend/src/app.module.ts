// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FieldsModule } from './fields/fields.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', 
      port: 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'futsal_db',
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
    }),
    FieldsModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}