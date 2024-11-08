import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScoreModule } from './score/score.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI, // Lấy URI từ biến môi trường
      }),
    }),
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
