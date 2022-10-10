import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';

@ApiTags('Jsonwebtoken User')
@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all data' })
  async getAll() {
    return this.userService.findAll();
  }

  @Get('product')
  getAllProduct() {
    return this.productService.findAll();
  }

  @Post('register')
  @ApiOperation({ summary: 'register new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'jacob',
          description: 'this is name',
        },
        email: {
          type: 'string',
          example: 'jacobtest@email.com',
          description: 'this is email',
        },
        password: {
          type: 'string',
          example: '123456789',
          description: 'this is password',
        },
      },
    },
  })
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.userService.register({
      name,
      email,
      password: hash,
    });

    delete user.password;

    return user;
  }

  @Post('login')
  @ApiOperation({ summary: 'login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'jacobtest@email.com',
          description: 'this is email',
        },
        password: {
          type: 'string',
          example: '123456789',
          description: 'this is password',
        },
      },
    },
  })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.login({ email });

    if (!user) {
      throw new BadRequestException('invalided');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalided');
    }

    const jwt = this.jwtService.sign({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: 'success',
    };
  }

  @Get('user')
  @ApiOperation({ summary: 'use jwt to get data' })
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verify(cookie);

    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.login({ id: data['id'] });

    const { password, ...result } = user;

    return result;
  }
  catch(e: any) {
    throw new UnauthorizedException();
  }

  @Post('user/add')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'mango',
          description: 'this is name product',
        },
        price: {
          type: 'number',
          example: '20',
          description: 'this is price',
        },
      },
    },
  })
  async addProduct(
    @Req() request: Request,
    @Body('name') name: string,
    @Body('price') price: number,
  ) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verify(cookie);

    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.login({ id: data['id'] });

    const { password, ...result } = user;

    const product = this.productService.addProduct({
      id_user: result.id,
      name,
      price,
    });

    return product;
  }

  @Get('user/product')
  async findAllProduct(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verify(cookie);

    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.login({ id: data['id'] });

    const { password, ...result } = user;

    const id_user = this.productService.findUserProduct({
      id_user: result.id,
    });

    return id_user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete data' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post('logout')
  @ApiOperation({ summary: 'logout' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'clear success!',
    };
    
  }
}
