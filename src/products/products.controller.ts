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
import { Category } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  findAll(
    @Query('category') category?: Category,
    @Query('stock') stock?: Boolean,
  ) {
    return this.productsService.findAll(category,stock);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // console.log(image);
    console.log(updateProductDto);
    if (image) {
      const url = (await this.productsService.uploadImage(image)).url;
      return this.productsService.update(id, { ...updateProductDto, url });
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
