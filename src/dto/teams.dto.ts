import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetTeamDto {
  @ApiProperty({
    example: 'Manchester United FC',
    description: 'Name of the team to fetch',
  })
  teamName: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Include players in the response',
  })
  includePlayers?: boolean;
}
