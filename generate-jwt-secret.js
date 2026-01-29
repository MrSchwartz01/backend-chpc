/**
 * Script para generar JWT Secrets seguros
 * Uso: node generate-jwt-secret.js [longitud]
 * 
 * Ejemplos:
 *   node generate-jwt-secret.js        # Genera secret de 64 caracteres (default)
 *   node generate-jwt-secret.js 32     # Genera secret de 32 caracteres
 *   node generate-jwt-secret.js 128    # Genera secret de 128 caracteres
 */

const crypto = require('crypto');

function generateJwtSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

function generateHexSecret(length = 64) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function generateMultipleSecrets() {
  const length = parseInt(process.argv[2]) || 64;
  
  console.log('\n🔐 Generador de JWT Secrets\n');
  console.log('=' .repeat(70));
  
  // Secret principal (base64url - recomendado)
  const base64Secret = generateJwtSecret(length);
  console.log('\n📌 JWT_SECRET (Base64URL - Recomendado):');
  console.log(`   ${base64Secret}`);
  
  // Secret alternativo (hex)
  const hexSecret = generateHexSecret(length);
  console.log('\n📌 JWT_SECRET (Hexadecimal):');
  console.log(`   ${hexSecret}`);
  
  // Secret extra largo para mayor seguridad
  const longSecret = generateJwtSecret(128);
  console.log('\n📌 JWT_SECRET (Extra Seguro - 128 chars):');
  console.log(`   ${longSecret}`);
  
  console.log('\n' + '=' .repeat(70));
  
  // Formato para .env
  console.log('\n📋 Copia esto a tu archivo .env:\n');
  console.log(`JWT_SECRET=${base64Secret}`);
  console.log(`JWT_REFRESH_SECRET=${generateJwtSecret(length)}`);
  console.log(`JWT_EXPIRES_IN=1d`);
  console.log(`JWT_REFRESH_EXPIRES_IN=7d`);
  
  console.log('\n' + '=' .repeat(70));
  
  // Para Vercel
  console.log('\n☁️  Para agregar en Vercel (Settings → Environment Variables):\n');
  console.log(`   Variable: JWT_SECRET`);
  console.log(`   Value:    ${base64Secret}`);
  
  console.log('\n✅ Secrets generados exitosamente!\n');
}

// Ejecutar
generateMultipleSecrets();
