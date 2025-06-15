import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tap } from 'src/entities/tap.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Tap, (tap) => tap.user)
  taps: Tap[];
}
