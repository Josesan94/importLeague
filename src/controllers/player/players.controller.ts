import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPlayersDto } from 'src/dto/players.dto';
import { PlayerService } from 'src/services/player/player.service';

@ApiTags('Players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  @ApiOperation({ summary: 'Get players by league and optionally by team' })
  @ApiResponse({
    status: 200,
    description: 'List of players retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'League or team not found.' })
  async getPlayers(@Query() getPlayersDto: GetPlayersDto) {
    const { leagueCode, teamName } = getPlayersDto;
    try {
      return this.playerService.getPlayersByLeague(leagueCode, teamName);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
