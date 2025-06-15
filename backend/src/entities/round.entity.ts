import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad } from 'typeorm';
import { Tap } from './tap.entity';

export enum RoundStatus {
  COOLDOWN = 'Cooldown',
  ACTIVE = 'Активен',
  ENDED = 'Завершен',
}

@Entity()
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @OneToMany(() => Tap, (tap) => tap.round)
  taps: Tap[];

  status?: string;
  @AfterLoad()
  setStatus?(): void{
    if (new Date(this.startTime) > new Date()) {
      this.status = RoundStatus.COOLDOWN;
    } else if (new Date(this.startTime) <= new Date() && new Date(this.endTime) >= new Date()) {
      this.status = RoundStatus.ACTIVE;
    } else {
      this.status = RoundStatus.ENDED;
    }
  }
}
