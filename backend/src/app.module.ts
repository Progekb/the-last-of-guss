import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundsModule } from './rounds/rounds.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Round } from './entities/round.entity';
import { Tap } from './entities/tap.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Round, Tap],
      synchronize: true,
    }),
    RoundsModule,
    AuthModule,
  ],
})
export class AppModule {}
