// src/score/score.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { ScoreSchema } from './score.schema';
import { ResponseHandlerService } from 'src/common/response-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Score', schema: ScoreSchema }
    ]),
  ],
  controllers: [ScoreController],
  providers: [
    ScoreService,
    ResponseHandlerService
  ],
})
export class ScoreModule { }
