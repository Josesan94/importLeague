import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImportLeagueService } from 'src/services/importLeague/importLeague.service';
import { ImportLeagueDTO } from 'src/dto/importLeague.dto';

@ApiTags('Leagues')
@Controller('league')
export class ImportLeagueController {
  constructor(private readonly importLeagueService: ImportLeagueService) {}

  @Post('/import_league')
  @ApiOperation({ summary: 'Import a football league by leagueCode' })
  @ApiResponse({ status: 201, description: 'League imported successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request or league already imported.',
  })
  async importLeague(@Body() importLeagueDto: ImportLeagueDTO) {
    const { leagueCode } = importLeagueDto;

    if (!leagueCode) {
      throw new BadRequestException('leagueCode is required!');
    }

    try {
      await this.importLeagueService.importLeague(leagueCode);
      return {
        message: `League ${leagueCode} imported successfully`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
