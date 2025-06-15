import { Entity, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Round } from './round.entity';

@Entity()
export class Tap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.taps)
  user: User;

  @ManyToOne(() => Round, (round) => round.taps)
  round: Round;

  @UpdateDateColumn()
  tapedAt: Date;

  @Column({ default: false })
  bonus: boolean
}
