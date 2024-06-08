import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';
import { SharpService } from 'nestjs-sharp';
import * as fs from 'fs';
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly sharpService: SharpService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.products.create({ data: createProductDto });
  }

  async uploadImage(image: Express.Multer.File) {
    try {
      const webpBuffer = await this.sharpService
        .edit(image.buffer)
        .webp()
        .toBuffer();

      fs.writeFileSync(`temp.webp`, webpBuffer);

      const result =
        await this.cloudinaryService.cloudinary.uploader.upload(`temp.webp`);
      fs.unlinkSync(`temp.webp`);
      return { url: result.secure_url };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.prisma.products.findMany({ where: { stock: true } });
    // return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // return `This action updates a #${id} product`;
    return await this.prisma.products.update({
      data: updateProductDto,
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
