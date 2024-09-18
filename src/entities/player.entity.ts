import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  nationality: string;

  @ManyToOne(() => Team, (team) => team.players)
  team: Team;
}
