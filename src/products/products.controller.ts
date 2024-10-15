import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Category } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  search(@Query('filter') filter: string) {
    return this.productsService.search(filter);
  }

  @Get('tipos/:category?')
  getTipos(@Param('category') category?: Category) {
    return this.productsService.getTipos(category);
  }

  @Get('brand/:category?')
  getBrand(@Param('category') category?: Category) {
    return this.productsService.getBrand(category);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      // throw new BadRequestException('Make sure that the file is an image');
      return this.productsService.create({ ...createProductDto, url: '' });
    }
    const url = (await this.productsService.uploadImage(image)).url;
    return this.productsService.create({ ...createProductDto, url });
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (image) {
      const url = (await this.productsService.uploadImage(image)).url;
      return this.productsService.update(id, { ...updateProductDto, url });
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
