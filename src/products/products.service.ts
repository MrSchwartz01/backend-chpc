import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper para agregar imagen_url a los productos desde productImages
   */
  private addImagenUrl(productos: any[]): any[] {
    return productos.map(producto => {
      let imagen_url = '/Productos/placeholder-product.png';
      
      if (producto.productImages && producto.productImages.length > 0) {
        // Buscar imagen principal o usar la primera
        const imagenPrincipal = producto.productImages.find(img => img.es_principal);
        imagen_url = imagenPrincipal 
          ? imagenPrincipal.ruta_imagen 
          : producto.productImages[0].ruta_imagen;
      }
      
      return {
        ...producto,
        imagen_url,
      };
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(filters: FilterProductsDto): Promise<Product[]> {
    try {
      console.log('=== PRODUCTS findAll - START ===');
      console.log('Filters:', JSON.stringify(filters));
      
      const { minCosto, maxCosto, marca, almacen, search } = filters;

      const where: Prisma.ProductWhereInput = {};

      // Filtro por rango de costo
      if (minCosto !== undefined || maxCosto !== undefined) {
        where.costoTotal = {};
        if (minCosto !== undefined) {
          where.costoTotal.gte = minCosto;
        }
        if (maxCosto !== undefined) {
          where.costoTotal.lte = maxCosto;
        }
      }

      if (marca) {
        where.marca = {
          contains: marca,
          mode: 'insensitive',
        };
      }

      if (almacen) {
        where.almacen = {
          contains: almacen,
          mode: 'insensitive',
        };
      }

      if (search) {
        where.OR = [
          {
            producto: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            marca: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            medida: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            almacen: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      console.log('WHERE clause:', JSON.stringify(where));

      const productos = await this.prisma.product.findMany({ 
        where,
        orderBy: [
          { codigo: 'asc' },
        ],
        include: {
          productImages: {
            orderBy: [
              { es_principal: 'desc' },
              { orden: 'asc' },
            ],
          },
        },
      });

      console.log(`Found ${productos.length} products`);
      const result = this.addImagenUrl(productos);
      console.log('=== PRODUCTS findAll - END ===');
      return result;
    
    } catch (error) {
      console.error('=== ERROR in findAll ===');
      console.error('Error details:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error(`Error al obtener productos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async findOne(codigo: number): Promise<Product | null> {
    const producto = await this.prisma.product.findUnique({
      where: { 
        codigo,
      },
      include: {
        productImages: {
          orderBy: [
            { es_principal: 'desc' },
            { orden: 'asc' },
          ],
        },
      },
    });

    if (!producto) return null;

    // Agregar imagen_url
    const productosConImagen = this.addImagenUrl([producto]);
    return productosConImagen[0];
  }

  async update(codigo: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // Verificar que el producto existe
    const producto = await this.prisma.product.findUnique({ where: { codigo } });
    if (!producto) {
      throw new NotFoundException(`Producto con código ${codigo} no encontrado`);
    }

    return await this.prisma.product.update({
      where: { codigo },
      data: updateProductDto,
    });
  }

  async remove(codigo: number): Promise<Product> {
    // Verificar que el producto existe
    const producto = await this.prisma.product.findUnique({ where: { codigo } });
    if (!producto) {
      throw new NotFoundException(`Producto con código ${codigo} no encontrado`);
    }

    // Eliminación física del producto
    return await this.prisma.product.delete({
      where: { codigo },
    });
  }
}
