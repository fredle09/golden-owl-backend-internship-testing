// src/common/response-handler.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class ResponseHandlerService {
  // Tạo response khi thành công
  success<T>(data: T, message: string = 'Request successful'): ResponseDto<T> {
    return new ResponseDto(data, message, 200); // 200 là mã trạng thái HTTP cho thành công
  }

  badRequest<T>(message: string, data?: T): ResponseDto<T> {
    throw new BadRequestException(new ResponseDto(data || null, message, 400)); // 400 là mã trạng thái HTTP cho lỗi từ phía client
  }

  notFound<T>(message: string, data?: T): ResponseDto<T> {
    throw new NotFoundException(new ResponseDto(data || null, message, 404)); // 404 là mã trạng thái HTTP cho không tìm th
  }

  // Tạo response khi có lỗi
  error<T>(message: string, data?: T): ResponseDto<T> {
    throw new InternalServerErrorException(new ResponseDto(data || null, message, 500)); // 500 là mã trạng thái HTTP cho lỗi từ phía server
  }
}
