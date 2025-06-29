import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, email, password, fullName, preferredLanguageCode } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
      fullName: fullName || username,
      preferredLanguage: preferredLanguageCode || 'tr',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT
    const payload = { 
      sub: savedUser.id, 
      email: savedUser.email, 
      username: savedUser.username 
    };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          fullName: savedUser.fullName,
          preferredLanguageCode: savedUser.preferredLanguage,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        },
        token,
      },
      message: 'User registered successfully',
      timestamp: new Date().toISOString(),
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate JWT
    const payload = { 
      sub: user.id, 
      email: user.email, 
      username: user.username 
    };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          preferredLanguageCode: user.preferredLanguage,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };
  }

  async getAllUsers(): Promise<any> {
    try {
      const users = await this.userRepository.find({
        select: [
          'id', 
          'username', 
          'email', 
          'fullName', 
          'preferredLanguage', 
          'isActive', 
          'lastLoginAt', 
          'createdAt', 
          'updatedAt'
        ],
        order: { createdAt: 'DESC' }
      });

      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.fullName?.split(' ')[0] || '',
        lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
        fullName: user.fullName,
        username: user.username,
        preferredLanguageCode: user.preferredLanguage,
        isVerified: user.isActive,
        isActive: user.isActive,
        isPremium: false, // TODO: Check subscription status
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: true,
        data: formattedUsers,
        message: 'Users retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Soft delete by setting isActive to false
      await this.userRepository.update(userId, {
        isActive: false,
        updatedAt: new Date(),
      });

      console.log(`User ${userId} soft deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
  }
} 