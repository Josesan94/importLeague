import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  nationality: string;

  @OneToOne(() => Team, (team) => team.coach)
  team: Team;
}
