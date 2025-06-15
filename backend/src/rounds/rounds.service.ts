import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round, RoundStatus } from '../entities/round.entity';
import { Tap } from '../entities/tap.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { User } from '../entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Round)
    private roundsRepository: Repository<Round>,
    @InjectRepository(Tap)
    private tapsRepository: Repository<Tap>,
  ) {}

  async getAllActive() {
    return this.roundsRepository.find({ order: { 'startTime': 'DESC' } });
  }

  async getRound(id: string, userId: string) {
    const qb = this.roundsRepository
      .createQueryBuilder('r')
      .addSelect(['user.id'])
      .leftJoinAndSelect('r.taps', 'taps')
      .leftJoin('taps.user', 'user')
      .where({ id });
    const round = await qb.getOne();
    const qbWinner = this.tapsRepository
      .createQueryBuilder('t')
      .select('t.userId, COUNT(1), user.username')
      .leftJoin('t.user', 'user')
      .groupBy('t.userId, user.id')
      .orderBy('COUNT(1)', 'DESC');
    return {
      ...round,
      bestScore: await qbWinner.getRawOne(),
      myScore: round?.taps.filter(t => t.user?.id === userId).length,
      allScore: round?.taps.length,
      taps: undefined,
    }
  }

  async tap(user: User, roundId: string): Promise<number> {
    if (!user) throw new BadRequestException('Пользователь не найден')
    const round = await this.roundsRepository.findOne({ where: { id: roundId }, lock: { mode: 'pessimistic_write' } });
    if (!round) {
      throw new Error('Раунд не найден');
    }
    if (round.status !== RoundStatus.ACTIVE) {
      throw new Error('Раунд не активен');
    }
    if (user?.role === 'nikita') {
      return 0;
    }

    const tap = new Tap();
    tap.user = user;
    tap.round = round;
    await this.tapsRepository.save(tap);
    let userTaps = await this.tapsRepository.count({ where: { user: { id: user.id }, bonus: false, round: { id: roundId } } });
    if (userTaps % 11 === 0) {
      const tap = new Tap();
      tap.user = user;
      tap.round = round;
      tap.bonus = true;
      const taps = new Array(9).fill(tap);
      await this.tapsRepository.insert(taps);
    }

    return await this.tapsRepository.count({ where: { user: { id: user.id }, round: { id: roundId } } });
  }

  async create() {
    const currentStartTime = new Date();
    const cooldown = +(process.env.COOLDOWN_DURATION || 30);
    const newStartTime = new Date(currentStartTime.getTime());
    newStartTime.setSeconds(newStartTime.getSeconds() + cooldown);

    const currentEndTime = new Date();
    const roundDuration = +(process.env.ROUND_DURATION || 60);
    const newEndTime = new Date(currentEndTime.getTime());
    newEndTime.setMinutes(newEndTime.getMinutes() + roundDuration);

    const round = new Round();
    round.startTime = newStartTime;
    round.endTime = newEndTime;

    await this.roundsRepository.save(round);
  }
}
