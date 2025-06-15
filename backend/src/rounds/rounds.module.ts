import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundsService } from '../rounds/rounds.service';
import { RoundsController } from '../rounds/rounds.controller';
import { Round } from '../entities/round.entity';
import { Tap } from 'src/entities/tap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Round, Tap])],
  providers: [RoundsService],
  controllers: [RoundsController],
})
export class RoundsModule {}
