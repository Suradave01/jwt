import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private ProductRepository: Repository<Products>,
  ) {}

  async findAll() {
    return this.ProductRepository.find();
  }

  async findUserProduct(id: any) {
    return this.ProductRepository.findBy(id);
  }

  async addProduct(data: any) {
    return this.ProductRepository.save(data);
  }

  async remove(id: string) {
    await this.ProductRepository.delete(id);
  }
}
