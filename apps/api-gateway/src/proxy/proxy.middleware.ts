import 'dotenv/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const productProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE,
  changeOrigin: true,
});

export const inventoryProxy = createProxyMiddleware({
  target: process.env.INVENTORY_SERVICE,
  changeOrigin: true,
});

export const orderProxy = createProxyMiddleware({
  target: process.env.ORDER_SERVICE,
  changeOrigin: true,
});

export const warehouseProxy = createProxyMiddleware({
  target: process.env.WAREHOUSE_SERVICE,
  changeOrigin: true,
});

export const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
});
