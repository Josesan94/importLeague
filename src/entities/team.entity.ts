import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competition } from './competition.entity';
import { Player } from './player.entity';
import { Coach } from './coach.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tla: string;

  @Column()
  shortName: string;

  @Column()
  areaName: string;

  @Column()
  address: string;

  @ManyToOne(() => Competition, (competition) => competition.teams)
  competition: Competition;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToOne(() => Coach, (coach) => coach.team)
  coach: Coach;
}
