# 🚨 Debug: Subida de Imágenes - Error 400

## ✅ **Cambios Implementados**

### 1. **Configuración Multer Mejorada**
- ✅ Límites aumentados a 10MB
- ✅ Filtrado de archivos mejorado
- ✅ Validación de tipos MIME
- ✅ Storage en memoria configurado

### 2. **Validaciones Mejoradas**
- ✅ Validación de buffer vacío
- ✅ Mejor manejo de errores 400
- ✅ Mensajes de error más descriptivos
- ✅ Logging detallado

### 3. **CORS Configurado**
- ✅ Headers adicionales para multipart
- ✅ Opciones preflight configuradas
- ✅ Exposición de headers necesarios

### 4. **Endpoint de Test**
- ✅ Endpoint sin autenticación: `/api/images/test-upload/:productId`
- ✅ Debugging completo de requests

## 📋 **Cómo Probar desde Frontend**

### **1. Test Básico (Sin Autenticación)**
```javascript
// URL de test
const testUrl = 'https://backend-chpc.vercel.app/api/images/test-upload/1';

const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('es_principal', 'true');
formData.append('orden', '1');

try {
  const response = await fetch(testUrl, {
    method: 'POST',
    body: formData,
    // NO incluir Content-Type para multipart
  });
  
  const result = await response.json();
  console.log('Test result:', result);
} catch (error) {
  console.error('Test error:', error);
}
```

### **2. Subida Real (Con Autenticación)**
```javascript
// URL real
const uploadUrl = 'https://backend-chpc.vercel.app/api/images/upload/1';

const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('es_principal', 'true');
formData.append('orden', '1');

try {
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NO incluir Content-Type para multipart
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HTTP ${response.status}: ${errorData.message}`);
  }
  
  const result = await response.json();
  console.log('Upload successful:', result);
} catch (error) {
  console.error('Upload error:', error);
}
```

### **3. Con Axios**
```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('es_principal', 'true');
formData.append('orden', '1');

try {
  const response = await axios.post(
    'https://backend-chpc.vercel.app/api/images/upload/1',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Axios maneja Content-Type automáticamente
      },
      timeout: 30000, // 30 segundos
    }
  );
  
  console.log('Upload successful:', response.data);
} catch (error) {
  if (error.response) {
    console.error('Server error:', error.response.data);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    console.error('Network error:', error.request);
  } else {
    console.error('Error:', error.message);
  }
}
```

## 🔍 **Debugging Steps**

### **1. Verificar Conectividad**
```javascript
// Test de salud del API
fetch('https://backend-chpc.vercel.app/api/health')
  .then(response => response.json())
  .then(data => console.log('API Health:', data))
  .catch(error => console.error('API Down:', error));
```

### **2. Test de Autenticación**
```javascript
// Verificar token
fetch('https://backend-chpc.vercel.app/api/usuarios', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(response => response.json())
  .then(data => console.log('Auth OK:', data))
  .catch(error => console.error('Auth Error:', error));
```

### **3. Test de Subida Sin Archivo**
```javascript
// Probar qué pasa sin archivo
fetch('https://backend-chpc.vercel.app/api/images/test-upload/1', {
  method: 'POST',
  body: new FormData()
})
  .then(response => response.json())
  .then(data => console.log('No file test:', data));
```

## 🚨 **Errores Comunes y Soluciones**

### **Error 400: "No se proporcionó ningún archivo"**
```javascript
// ❌ Problema: Campo con nombre incorrecto
formData.append('imagen', file); // Mal

// ✅ Solución: Usar 'file'
formData.append('file', file); // Correcto
```

### **Error 400: "Tipo de archivo no permitido"**
```javascript
// ✅ Verificar tipos permitidos:
// - image/jpeg
// - image/jpg  
// - image/png
// - image/webp
// - image/gif

// Verificar antes de enviar
if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
  alert('Tipo de archivo no permitido');
  return;
}
```

### **Error 400: "Archivo demasiado grande"**
```javascript
// ✅ Máximo: 10MB
if (file.size > 10 * 1024 * 1024) {
  alert('Archivo muy grande. Máximo 10MB');
  return;
}
```

### **Error de CORS**
- ✅ Verificar que el dominio esté en allowedOrigins
- ✅ No enviar Content-Type manualmente en multipart
- ✅ Incluir credentials: true si es necesario

## 📊 **Logs de Debug**

El backend ahora muestra logs detallados:
- ✅ Recepción del archivo
- ✅ Validaciones paso a paso
- ✅ Proceso de optimización
- ✅ Guardado en base de datos
- ✅ Errores con stack trace

## 🔄 **Pasos Siguientes**

1. **Probar endpoint de test** primero
2. **Revisar logs del backend** en Vercel
3. **Verificar configuración CORS**
4. **Probar con autenticación**
5. **Revisar formato del FormData**

## 🛠️ **Comandos Útiles**

```bash
# Ver logs en tiempo real
vercel logs https://backend-chpc.vercel.app --follow

# Test desde curl
curl -X POST \
  https://backend-chpc.vercel.app/api/images/test-upload/1 \
  -F 'file=@test-image.jpg' \
  -F 'es_principal=true' \
  -F 'orden=1'
```

---

**Nota:** Una vez identificado y solucionado el problema, remover el endpoint `test-upload` por seguridad.