import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    await this.redisService.client.set(`refresh:${user.id}`, refreshToken);

    await this.redisService.client.expire(
      `refresh:${user.id}`,
      60 * 60 * 24 * 7,
    );

    const storedToken = await this.redisService.client.get(
      `refresh:${user.id}`,
    );

    console.log('REDIS TOKEN:', storedToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const storedToken = await this.redisService.client.get(
        `refresh:${payload.sub}`,
      );

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.redisService.client.del(`refresh:${payload.sub}`);

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
        },
        {
          expiresIn: '7d',
        },
      );

      await this.redisService.client.set(
        `refresh:${payload.sub}`,
        newRefreshToken,
      );

      await this.redisService.client.expire(
        `refresh:${payload.sub}`,
        60 * 60 * 24 * 7,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
