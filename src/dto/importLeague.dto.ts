import { ApiProperty } from '@nestjs/swagger';

export class ImportLeagueDTO {
  @ApiProperty({
    example: 'PL',
    description: 'Code of the league to be imported',
  })
  leagueCode: string;
}
