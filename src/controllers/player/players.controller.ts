import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PlayerService } from 'src/services/player/player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayers(
    @Query('leagueCode') leagueCode: string,
    @Query('teamName') teamName?: string,
  ) {
    try {
      return this.playerService.getPlayersByLeague(leagueCode, teamName);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
