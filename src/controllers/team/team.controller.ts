import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTeamDto } from 'src/dto/teams.dto';
import { TeamService } from 'src/services/team/team.service';
@ApiTags('Teams')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a team by name and optionally include players',
  })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  async getTeam(@Query() getTeamDto: GetTeamDto) {
    const { teamName, includePlayers } = getTeamDto;
    try {
      return this.teamService.getTeamByName(teamName, includePlayers);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
