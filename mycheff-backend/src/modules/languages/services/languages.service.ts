import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../../entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async getAllLanguages() {
    const languages = await this.languageRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return {
      success: true,
      data: languages.map(lang => ({
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        isActive: lang.isActive,
        isDefault: lang.isDefault,
      })),
      message: 'Languages retrieved successfully',
    };
  }

  async getLanguageByCode(code: string) {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      return {
        success: false,
        message: 'Language not found',
      };
    }

    return {
      success: true,
      data: {
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        isActive: language.isActive,
        isDefault: language.isDefault,
      },
      message: 'Language retrieved successfully',
    };
  }

  async createLanguage(data: Partial<Language>) {
    const language = this.languageRepository.create(data);
    const savedLanguage = await this.languageRepository.save(language);

    return {
      success: true,
      data: {
        code: savedLanguage.code,
        name: savedLanguage.name,
        nativeName: savedLanguage.nativeName,
        isActive: savedLanguage.isActive,
        isDefault: savedLanguage.isDefault,
      },
      message: 'Language created successfully',
    };
  }

  async updateLanguage(code: string, data: Partial<Language>) {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      return {
        success: false,
        message: 'Language not found',
      };
    }

    Object.assign(language, data);
    const updatedLanguage = await this.languageRepository.save(language);

    return {
      success: true,
      data: {
        code: updatedLanguage.code,
        name: updatedLanguage.name,
        nativeName: updatedLanguage.nativeName,
        isActive: updatedLanguage.isActive,
        isDefault: updatedLanguage.isDefault,
      },
      message: 'Language updated successfully',
    };
  }

  async deleteLanguage(code: string) {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      return {
        success: false,
        message: 'Language not found',
      };
    }

    await this.languageRepository.remove(language);

    return {
      success: true,
      message: 'Language deleted successfully',
    };
  }
} 