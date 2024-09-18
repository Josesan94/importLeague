import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { TeamService } from 'src/services/team/team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeam(
    @Query('teamName') teamName: string,
    @Query('includePlayers') includePlayers: boolean,
  ) {
    try {
      return this.teamService.getTeamByName(teamName, includePlayers);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
