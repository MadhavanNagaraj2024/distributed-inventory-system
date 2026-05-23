import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import {
  authProxy,
  inventoryProxy,
  orderProxy,
  productProxy,
  warehouseProxy,
} from './proxy/proxy.middleware';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { JwtMiddleware } from './middleware/jwt.middleware';

import { RoleMiddleware } from './middleware/role.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],

  controllers: [AppController],

  providers: [AppService, JwtMiddleware, RoleMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /* PUBLIC ROUTES */

    consumer.apply(authProxy).forRoutes('/auth');

    /* PRODUCT ROUTES */

    consumer.apply(JwtMiddleware, productProxy).forRoutes('/products');

    /* ADMIN ONLY ROUTES */

    consumer
      .apply(JwtMiddleware, RoleMiddleware, productProxy)
      .forRoutes('/products/create');

    /* INVENTORY ROUTES */

    consumer.apply(JwtMiddleware, inventoryProxy).forRoutes('/inventory');

    /* ORDER ROUTES */

    consumer.apply(JwtMiddleware, orderProxy).forRoutes('/orders');

    /* WAREHOUSE ROUTES */

    consumer.apply(JwtMiddleware, warehouseProxy).forRoutes('/warehouse');
  }
}
