import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../entities/language.entity';
import { LanguagesController } from './controllers/languages.controller';
import { LanguagesService } from './services/languages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language]),
  ],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {} 