// src/score/score.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
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
  async findAll(
    @Query('sort') sort?: string | string[],
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ResponseDto<Score[]>> {
    const scores = await this.scoreService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort: typeof sort === 'string' ? [sort] : sort,
    });

    return this.responseHandler.success(scores, 'Scores fetched successfully');
  }

  @Get("range-counts")
  async getRangeCounts(@Query('subject') subject: string): Promise<ResponseDto<any>> {
    const result = await this.scoreService.getRangeCounts({ subject });
    return this.responseHandler.success(result, 'Range counts fetched successfully');
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
