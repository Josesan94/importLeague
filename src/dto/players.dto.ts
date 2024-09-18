import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetPlayersDto {
  @ApiProperty({
    example: 'PL',
    description: 'Code of the league to fetch players from',
  })
  leagueCode: string;

  @ApiPropertyOptional({
    example: 'Manchester United FC',
    description: 'Name of the team to filter players',
  })
  teamName?: string;
}
