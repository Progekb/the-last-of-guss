import { Controller, Post, Req, Get, Param, UseGuards } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Get()
  async getAll() {
    return this.roundsService.getAllActive();
  }

  @Get(':id')
  async getRound(@Param('id') id: string, @Req() req: Express.Request) {
    const user = req.user as User
    return this.roundsService.getRound(id, user?.id);
  }

  @Post()
  async create() {
    return this.roundsService.create();
  }

  @Transactional()
  @Post(':id/tap')
  async tap(@Param('id') roundId: string, @Req() req: Express.Request) {
    const score = await this.roundsService.tap(req.user as User, roundId);
    return { score };
  }
}
