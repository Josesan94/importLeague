import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity('competition')
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  areaName: string;

  @OneToMany(() => Team, (team) => team.competition)
  teams: Team[];
}
