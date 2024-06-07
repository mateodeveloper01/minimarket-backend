import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { SharpModule } from 'nestjs-sharp';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { envs } from 'src/config/envs';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [
    SharpModule,
    CloudinaryModule.forRoot({
      isGlobal: true,
      cloud_name: envs.CLOUDINARY_NAME,
      api_key: envs.CLOUDINARY_API_KEY,
      api_secret: envs.CLOUDINARY_API_SECRET,
    }),
  ],
})
export class ProductsModule {}
