import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ImportLeagueService } from 'src/services/importLeague/importLeague.service';

@Controller('league')
export class ImportLeagueController {
  constructor(private readonly importLeagueService: ImportLeagueService) {}

  @Post('/import_league')
  async importLeague(@Body('leagueCode') leagueCode: string) {
    if (!leagueCode) {
      throw new BadRequestException('leagueCode is required!');
    }

    try {
      await this.importLeagueService.importLeague(leagueCode);
      return { message: `League ${leagueCode} imported successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
