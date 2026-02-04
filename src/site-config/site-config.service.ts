import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';

@Injectable()
export class SiteConfigService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.siteConfig.findMany();
  }

  async findByKey(clave: string) {
    const config = await this.prisma.siteConfig.findUnique({
      where: { clave },
    });

    if (!config) {
      throw new NotFoundException(`Configuración con clave '${clave}' no encontrada`);
    }

    return config;
  }

  async upsert(updateSiteConfigDto: UpdateSiteConfigDto) {
    const { clave, valor } = updateSiteConfigDto;

    return this.prisma.siteConfig.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    });
  }

  async updateLogo(logoUrl: string) {
    return this.upsert({ clave: 'logo_url', valor: logoUrl });
  }

  async getLogo() {
    try {
      const config = await this.findByKey('logo_url');
      return { valor: config.valor }; // Retornar objeto con propiedad 'valor'
    } catch (error) {
      return { valor: null }; // Si no existe, retornar objeto con valor null
    }
  }

  // ========== CONFIGURACIÓN DE COLORES ==========

  /**
   * Obtiene todos los colores de énfasis configurados
   */
  async getColores() {
    const coloresDefault = {
      primary: '#ffa726',
      primaryDark: '#fb8c00',
      primaryLight: '#ffb74d',
      success: '#4caf50',
      error: '#f44336',
    };

    try {
      const config = await this.prisma.siteConfig.findUnique({
        where: { clave: 'colores_enfasis' },
      });

      if (config) {
        return { valor: JSON.parse(config.valor) };
      }
      return { valor: coloresDefault };
    } catch (error) {
      return { valor: coloresDefault };
    }
  }

  /**
   * Actualiza los colores de énfasis del sitio
   */
  async updateColores(colores: {
    primary?: string;
    primaryDark?: string;
    primaryLight?: string;
    success?: string;
    error?: string;
  }) {
    // Obtener colores actuales para mantener los no modificados
    const coloresActuales = await this.getColores();
    const nuevosColores = {
      ...coloresActuales.valor,
      ...colores,
    };

    return this.prisma.siteConfig.upsert({
      where: { clave: 'colores_enfasis' },
      update: { valor: JSON.stringify(nuevosColores) },
      create: { clave: 'colores_enfasis', valor: JSON.stringify(nuevosColores) },
    });
  }

  /**
   * Restablece los colores a los valores por defecto
   */
  async resetColores() {
    const coloresDefault = {
      primary: '#ffa726',
      primaryDark: '#fb8c00',
      primaryLight: '#ffb74d',
      success: '#4caf50',
      error: '#f44336',
    };

    return this.prisma.siteConfig.upsert({
      where: { clave: 'colores_enfasis' },
      update: { valor: JSON.stringify(coloresDefault) },
      create: { clave: 'colores_enfasis', valor: JSON.stringify(coloresDefault) },
    });
  }
}
