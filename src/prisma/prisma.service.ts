import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Verificar que DATABASE_URL esté configurada
    const databaseUrl = process.env.DATABASE_URL;
    
    console.log('=== PRISMA INITIALIZATION ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!databaseUrl);
    console.log('DATABASE_URL starts with postgresql:', databaseUrl?.startsWith('postgresql'));
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL no está configurada');
      throw new Error('DATABASE_URL no está configurada. Verifica las variables de entorno en Vercel.');
    }
    
    if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
      console.error('❌ DATABASE_URL tiene formato incorrecto:', databaseUrl.substring(0, 20) + '...');
      throw new Error('DATABASE_URL debe comenzar con postgresql:// o postgres://');
    }
    
    console.log('✅ DATABASE_URL configurada correctamente');
    
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      console.log('🔌 Conectando a la base de datos...');
      await this.$connect();
      console.log('✅ Conexión a la base de datos exitosa');
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
