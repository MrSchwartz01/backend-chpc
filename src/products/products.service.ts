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
   * Helper para agregar imagen_url y precioA a los productos
   */
  private addImagenUrlAndPrecio(productos: any[]): any[] {
    return productos.map(producto => {
      let imagen_url = '/placeholder.jpg';
      
      if (producto.productImages && producto.productImages.length > 0) {
        // Buscar imagen principal o usar la primera
        const imagenPrincipal = producto.productImages.find(img => img.es_principal);
        imagen_url = imagenPrincipal 
          ? imagenPrincipal.ruta_imagen 
          : producto.productImages[0].ruta_imagen;
      }
      
      // Obtener precioA de la relación precioUnitario
      const precioA = producto.precioUnitario?.precioA ?? null;
      
      return {
        ...producto,
        imagen_url,
        precioA,
        // Mantener costoTotal como respaldo si no hay precioA
        costoTotal: precioA ?? producto.costoTotal,
      };
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(filters: FilterProductsDto): Promise<{ data: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      console.log('=== PRODUCTS findAll - START ===');
      console.log('Filters:', JSON.stringify(filters));
      
      const { minCosto, maxCosto, marca, almacen, search, page = 1, limit } = filters;

      const where: Prisma.ProductWhereInput = {
        // Filtrar productos que tengan stock > 0
        // existenciaTotal es string, así que filtramos los que NO sean "0" ni vacíos ni null
        NOT: [
          { existenciaTotal: '0' },
          { existenciaTotal: '' },
          { existenciaTotal: null },
        ],
      };

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
          mode: Prisma.QueryMode.insensitive,
        };
      }

      if (almacen) {
        where.almacen = {
          contains: almacen,
          mode: Prisma.QueryMode.insensitive,
        };
      }

      if (search) {
        where.OR = [
          {
            producto: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            marca: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            medida: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            almacen: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            codigo: !isNaN(Number(search)) ? Number(search) : undefined,
          },
        ].filter(condition => {
          // Filtrar condiciones con undefined
          if ('codigo' in condition && condition.codigo === undefined) {
            return false;
          }
          return true;
        });
      }

      console.log('WHERE clause:', JSON.stringify(where));

      // Contar total de productos
      const total = await this.prisma.product.count({ where });

      // Si no hay limit, devolver todos los productos (para compatibilidad)
      const queryOptions: any = {
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
          precioUnitario: true, // Incluir precio unitario para obtener precioA
        },
      };

      // Aplicar paginación solo si se especifica limit
      if (limit) {
        queryOptions.skip = (page - 1) * limit;
        queryOptions.take = limit;
      }

      const productos = await this.prisma.product.findMany(queryOptions);

      console.log(`Found ${productos.length} products (total: ${total})`);
      const result = this.addImagenUrlAndPrecio(productos);
      console.log('=== PRODUCTS findAll - END ===');
      
      const totalPages = limit ? Math.ceil(total / limit) : 1;
      
      return {
        data: result,
        total,
        page: Number(page),
        limit: limit || total,
        totalPages,
      };
    
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
        precioUnitario: true, // Incluir precio unitario para obtener precioA
      },
    });

    if (!producto) return null;

    // Agregar imagen_url y precioA
    const productosConImagen = this.addImagenUrlAndPrecio([producto]);
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
