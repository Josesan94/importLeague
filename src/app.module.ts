import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Team } from './entities/team.entity';
import { Player } from './entities/player.entity';
import { Coach } from './entities/coach.entity';
import { Competition } from './entities/competition.entity';
import { ImportLeagueService } from './services/importLeague/importLeague.service';
import { ImportLeagueController } from './controllers/importLeague/importLeague.controller';
import { HttpModule } from '@nestjs/axios';
import { PlayerService } from './services/player/player.service';
import { PlayerController } from './controllers/player/players.controller';
import { TeamService } from './services/team/team.service';
import { TeamController } from './controllers/team/team.controller';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.cwd() + '/.env';
config({ path: envFilePath });

const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Team, Player, Coach, Competition],
      synchronize: true,
      // logging: true,
    };
  },
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([Team, Player, Coach, Competition]),
    HttpModule,
  ],
  providers: [ImportLeagueService, PlayerService, TeamService],
  controllers: [ImportLeagueController, PlayerController, TeamController],
})
export class AppModule {}
