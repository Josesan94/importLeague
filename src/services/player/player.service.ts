import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/entities/coach.entity';
import { Competition } from 'src/entities/competition.entity';
import { Player } from 'src/entities/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
  ) {}

  async getPlayersByLeague(leagueCode: string, teamName?: string) {
    //verify if league exist
    const competition = await this.competitionRepository.findOne({
      where: { code: leagueCode },
      relations: ['teams'],
    });
    console.log(competition);
    if (!competition) {
      throw new NotFoundException(`League with code ${leagueCode} not found.`);
    }

    //if teamName provided, search players in that team
    if (teamName) {
      const players = await this.playerRepository
        .createQueryBuilder('player')
        .innerJoin('player.team', 'team')
        .innerJoin(
          'team.competition',
          'competition',
          'competition.code = :leagueCode',
          {
            leagueCode,
          },
        )
        .where('team.name = :teamName', { teamName })
        .getMany();

      if (players.length === 0) {
        //if there are no players, search for coaches
        const coaches = await this.coachRepository
          .createQueryBuilder('coach')
          .innerJoin('coach.team', 'team')
          .innerJoin(
            'team.competition',
            'competition',
            'competition.code = :leagueCode',
            {
              leagueCode,
            },
          )
          .where('team.name = :teamName', { teamName })
          .getMany();

        if (coaches.length === 0) {
          throw new NotFoundException(
            `No players or coaches found for team ${teamName}.`,
          );
        }
        return coaches;
      }
      return players;
    }

    //if no team name is provided, it should return all players of the league
    const players = await this.playerRepository
      .createQueryBuilder('player')
      .innerJoin('player.team', 'team')
      .innerJoin(
        'team.competition',
        'competition',
        'competition.code = :leagueCode',
        {
          leagueCode,
        },
      )
      .getMany();

    if (players.length === 0) {
      // if there are no players, search for coaches
      const coaches = await this.coachRepository
        .createQueryBuilder('coach')
        .innerJoin('coach.team', 'team')
        .innerJoin(
          'team.competition',
          'competition',
          'competition.code = :leagueCode',
          {
            leagueCode,
          },
        )
        .getMany();

      if (coaches.length === 0) {
        throw new NotFoundException(
          `No players or coaches found for league ${leagueCode}.`,
        );
      }
      return coaches;
    }
    return players;
  }
}
