import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload;

      next();
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
