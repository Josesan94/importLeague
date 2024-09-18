import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/entities/coach.entity';
import { Player } from 'src/entities/player.entity';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
  ) {}

  async getTeamByName(teamName: string, includePlayers: boolean) {
    // sarch the team and check if it exist
    const team = await this.teamRepository.findOne({
      where: { name: teamName },
      relations: ['competition'],
    });
    if (!team) {
      throw new NotFoundException(`Team with name ${teamName} not found.`);
    }

    // if players are looked for, query them
    if (includePlayers) {
      const players = await this.playerRepository
        .createQueryBuilder('player')
        .innerJoin('player.team', 'team')
        .where('team.name = :teamName', { teamName })
        .getMany();

      if (players.length === 0) {
        // if there are no players, return coaches
        const coaches = await this.coachRepository
          .createQueryBuilder('coach')
          .innerJoin('coach.team', 'team')
          .where('team.name = :teamName', { teamName })
          .getMany();

        if (coaches.length === 0) {
          throw new NotFoundException(
            `No players or coaches found for team ${teamName}.`,
          );
        }

        return {
          team,
          coaches,
        };
      }

      return {
        team,
        players,
      };
    }

    // if includePlayers don't apply, just query the teams
    return team;
  }
}
