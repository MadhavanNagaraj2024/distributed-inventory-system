import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    next();
  }
}
