// src/score/score.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Score } from './score.schema';
import { ResponseHandlerService } from 'src/common/response-handler.service';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('scores')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly responseHandler: ResponseHandlerService,
  ) { }

  // Lấy tất cả điểm số
  @Get()
  async findAll(): Promise<ResponseDto<Score[]>> {
    const scores = await this.scoreService.findAll();
    return this.responseHandler.success(scores, 'Scores fetched successfully');
  }

  // Lấy điểm số theo ID
  @Get(':sbd')
  async findOne(
    @Param('sbd') studentId: string,
  ): Promise<ResponseDto<Score>> {
    if (!studentId || studentId.length !== 8)
      return this.responseHandler.badRequest('Invalid student ID');

    const score = await this.scoreService.findOne({ studentId });
    if (!score) this.responseHandler.notFound('Score not found with sbd: ' + studentId);

    return this.responseHandler.success(score, 'Score fetched successfully');
  }
}
