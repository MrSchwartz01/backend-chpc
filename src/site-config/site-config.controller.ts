import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Configuración del Sitio')
@Controller('configuracion')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener toda la configuración del sitio' })
  findAll() {
    return this.siteConfigService.findAll();
  }

  @Get(':clave')
  @ApiOperation({ summary: 'Obtener una configuración por clave' })
  findByKey(@Param('clave') clave: string) {
    return this.siteConfigService.findByKey(clave);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar o crear una configuración (solo administradores)' })
  upsert(@Body() updateSiteConfigDto: UpdateSiteConfigDto) {
    return this.siteConfigService.upsert(updateSiteConfigDto);
  }

  @Get('logo/url')
  @ApiOperation({ summary: 'Obtener la URL del logo actual' })
  getLogo() {
    return this.siteConfigService.getLogo();
  }

  // ========== ENDPOINTS DE COLORES ==========

  @Get('colores/tema')
  @ApiOperation({ summary: 'Obtener los colores de énfasis del sitio' })
  getColores() {
    return this.siteConfigService.getColores();
  }

  @Post('colores/tema')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar los colores de énfasis del sitio (solo administradores)' })
  updateColores(@Body() colores: {
    primary?: string;
    primaryDark?: string;
    primaryLight?: string;
    success?: string;
    error?: string;
  }) {
    return this.siteConfigService.updateColores(colores);
  }

  @Post('colores/reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restablecer colores a valores por defecto (solo administradores)' })
  resetColores() {
    return this.siteConfigService.resetColores();
  }
}
