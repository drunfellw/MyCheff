import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcryptjs from 'bcryptjs';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      username: 'admin',
      email: 'admin@mycheff.com',
      password: 'password123',
      preferredLanguage: 'tr',
    },
    {
      username: 'testuser',
      email: 'test@mycheff.com',
      password: 'test123',
      preferredLanguage: 'en',
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      // Hash password
      const hashedPassword = await bcryptjs.hash(userData.password, 10);
      
      const user = userRepository.create({
        username: userData.username,
        email: userData.email,
        passwordHash: hashedPassword,
        preferredLanguage: userData.preferredLanguage,
      });
      
      await userRepository.save(user);
      console.log(`Created user: ${userData.email}`);
    }
  }
} 