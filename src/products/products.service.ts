import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';
import { SharpService } from 'nestjs-sharp';
import * as fs from 'fs';
import { Category, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly sharpService: SharpService,
  ) {}

  async search(filter: string) {
    const filterParts = filter.toLowerCase().split('_');
    const filterConditions: Prisma.productsWhereInput[] = filterParts.map(
      (part) => ({
        OR: [
          { tipo: { contains: part, mode: 'insensitive' } },
          { description: { contains: part, mode: 'insensitive' } },
          { brand: { contains: part, mode: 'insensitive' } },
          { amount: { contains: part, mode: 'insensitive' } },
          { url: { contains: part, mode: 'insensitive' } },
        ],
      }),
    );
    // Realiza la búsqueda utilizando las condiciones del filtro
    return this.prisma.products.findMany({
      where: {
        AND: filterConditions,
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.products.create({
      data: { ...createProductDto },
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
    const { limit = 10, page = 1, category } = paginationDto;
    const stock = paginationDto.stock && true;

    const offset = (page - 1) * limit;

    const totalProducts = await this.prisma.products.count({ where: { stock,category } });
    const totalPage = Math.ceil(totalProducts / limit);


    const data = await this.prisma.products.findMany({
      take: limit,
      skip: offset,
      where: {
        AND: [
          stock !== undefined ? { stock } : {},
          category !== undefined ? { category } : {},
        ],
      },
    });

    return {
      data,
      meta: {
        total: totalProducts,
        page,
        totalPage,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const stock = updateProductDto.stock ? true : false;
    return await this.prisma.products.update({
      data: { ...updateProductDto, stock },
      where: { id },
    });
  }

  async remove(id: string) {
    return await this.prisma.products.delete({ where: { id } });
  }
}
