import { DataSource } from 'typeorm';
import { Language } from '../../entities/language.entity';

export async function seedLanguages(dataSource: DataSource) {
  const languageRepository = dataSource.getRepository(Language);

  const languages = [
    { code: 'tr', name: 'Türkçe', isActive: true },
    { code: 'en', name: 'English', isActive: true },
    { code: 'es', name: 'Español', isActive: true },
    { code: 'fr', name: 'Français', isActive: true },
    { code: 'de', name: 'Deutsch', isActive: true },
    { code: 'ar', name: 'العربية', isActive: true },
  ];

  for (const langData of languages) {
    const existingLanguage = await languageRepository.findOne({
      where: { code: langData.code },
    });

    if (!existingLanguage) {
      const language = languageRepository.create(langData);
      await languageRepository.save(language);
      console.log(`Created language: ${langData.name}`);
    }
  }
} 