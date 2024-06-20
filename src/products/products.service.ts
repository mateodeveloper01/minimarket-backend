import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';
import { SharpService } from 'nestjs-sharp';
import * as fs from 'fs';
import { Category } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly sharpService: SharpService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const stock = createProductDto.stock === 'true' ? true : false;
    return await this.prisma.products.create({
      data: { ...createProductDto, stock },
    });
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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, category, stock } = paginationDto;
    return await this.prisma.products.findMany({
      take: limit,
      skip: offset,
      where:
        stock || category
          ? { stock: true, category: category }
          : { category: category },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const stock = updateProductDto.stock === 'true' ? true : false;
    return await this.prisma.products.update({
      data: { ...updateProductDto, stock },
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
