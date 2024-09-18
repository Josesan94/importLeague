import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Coach } from 'src/entities/coach.entity';
import { Competition } from 'src/entities/competition.entity';
import { Player } from 'src/entities/player.entity';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImportLeagueService {
  private readonly footballApiUrl = 'http://api.football-data.org/v4';

  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    private readonly httpService: HttpService,
  ) {}

  async importLeague(leagueCode: string): Promise<void> {
    const token = process.env.FOOTBALL_API_TOKEN; // Asegurarse de que el token esté configurado

    if (!token) {
      throw new BadRequestException('Football API token is missing');
    }

    try {
      //verify if the league is already imported on the DB
      const existingLeague = await this.competitionRepository.findOne({
        where: { code: leagueCode },
      });
      if (existingLeague) {
        throw new BadRequestException(
          `League with code ${leagueCode} is already imported.`,
        );
      }

      // first call to obtain competition info
      const competitionUrl = `${this.footballApiUrl}/competitions/${leagueCode}`;
      const competitionResponse = await firstValueFrom(
        this.httpService.get(competitionUrl, {
          headers: { 'X-Auth-Token': token },
        }),
      );

      const competitionData = competitionResponse.data;

      if (!competitionData) {
        throw new NotFoundException(`League with code ${leagueCode} not found`);
      }

      // Segunda llamada para obtener los equipos de la liga
      const teamsUrl = `${this.footballApiUrl}/competitions/${leagueCode}/teams`;
      const teamsResponse = await firstValueFrom(
        this.httpService.get(teamsUrl, {
          headers: { 'X-Auth-Token': token },
        }),
      );

      const { teams } = teamsResponse.data;

      if (!teams) {
        throw new NotFoundException(
          `No teams found for league with code ${leagueCode}`,
        );
      }

      // save the league information
      const competition = this.competitionRepository.create({
        name: competitionData.name,
        code: competitionData.code,
        areaName: competitionData.area.name, // Ahora estamos guardando el areaName
      });
      await this.competitionRepository.save(competition);

      // save teams informations and players/coach info
      for (const teamData of teams) {
        //verify if the teams already exist on this league
        const existingTeam = await this.teamRepository.findOne({
          where: { tla: teamData.tla, competition },
        });
        if (existingTeam) {
          continue; // skip and check the other teams
        }
        const team = this.teamRepository.create({
          name: teamData.name,
          tla: teamData.tla,
          shortName: teamData.shortName,
          areaName: teamData.area.name,
          address: teamData.address,
          competition,
        });
        await this.teamRepository.save(team);

        // Verificar si el equipo tiene jugadores
        if (teamData.squad && teamData.squad.length > 0) {
          for (const playerData of teamData.squad) {
            // verify if player already exist in that team
            const existingPlayer = await this.playerRepository.findOne({
              where: { name: playerData.name, team },
            });
            if (existingPlayer) {
              continue; // skip and check the other players
            }
            const player = this.playerRepository.create({
              name: playerData.name,
              position: playerData.position,
              dateOfBirth: playerData.dateOfBirth,
              nationality: playerData.nationality,
              team,
            });
            await this.playerRepository.save(player);
          }
        } else {
          // if there are no players, saves the coach
          const coachData = teamData.coach;

          // verify if coach already exist in that team
          const existingCoach = await this.coachRepository.findOne({
            where: { name: coachData.name, team },
          });
          if (existingCoach) {
            continue; // skip and check the other coaches
          }
          const coach = this.coachRepository.create({
            name: coachData.name,
            dateOfBirth: coachData.dateOfBirth,
            nationality: coachData.nationality,
            team,
          });
          await this.coachRepository.save(coach);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new BadRequestException(
          'Unauthorized request. Please check your API token.',
        );
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
