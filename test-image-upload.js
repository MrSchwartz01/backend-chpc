// Test script para verificar endpoints de imágenes
// Ejecutar en la consola del navegador o Node.js

console.log('🧪 Iniciando tests de endpoints de imágenes...');

// 1. Test de información del endpoint
async function testEndpointInfo() {
  console.log('\n1️⃣ Testing endpoint info...');
  try {
    const response = await fetch('https://backend-chpc.vercel.app/api/images/test-upload-info');
    const data = await response.json();
    console.log('✅ Endpoint info:', data);
    return true;
  } catch (error) {
    console.error('❌ Error getting endpoint info:', error);
    return false;
  }
}

// 2. Test de salud de la API
async function testApiHealth() {
  console.log('\n2️⃣ Testing API health...');
  try {
    const response = await fetch('https://backend-chpc.vercel.app/api/health');
    const data = await response.json();
    console.log('✅ API Health:', data);
    return true;
  } catch (error) {
    console.error('❌ Error checking API health:', error);
    return false;
  }
}

// 3. Test de endpoint sin archivo (debe dar error controlado)
async function testNoFile() {
  console.log('\n3️⃣ Testing upload without file...');
  try {
    const formData = new FormData();
    formData.append('es_principal', 'true');
    formData.append('orden', '1');
    
    const response = await fetch('https://backend-chpc.vercel.app/api/images/test-upload/1', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('✅ No file test result:', data);
    return true;
  } catch (error) {
    console.error('❌ Error in no file test:', error);
    return false;
  }
}

// 4. Test completo con archivo (necesita ser ejecutado en el navegador)
function createTestFileUpload() {
  console.log('\n4️⃣ Creating test file upload function...');
  
  return `
// Función para probar subida con archivo real (ejecutar en navegador)
async function testFileUpload() {
  // Crear input file temporal
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    console.log('📁 Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('es_principal', 'true');
    formData.append('orden', '1');
    
    try {
      console.log('🚀 Uploading file...');
      const response = await fetch('https://backend-chpc.vercel.app/api/images/test-upload/1', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      console.log('✅ Upload result:', result);
    } catch (error) {
      console.error('❌ Upload error:', error);
    }
  };
  
  input.click();
}

// Ejecutar: testFileUpload()
`;
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Ejecutando todos los tests...\n');
  
  const results = {
    endpointInfo: await testEndpointInfo(),
    apiHealth: await testApiHealth(),
    noFileTest: await testNoFile()
  };
  
  console.log('\n📊 Resumen de resultados:');
  console.log('- Endpoint info:', results.endpointInfo ? '✅' : '❌');
  console.log('- API Health:', results.apiHealth ? '✅' : '❌');
  console.log('- No file test:', results.noFileTest ? '✅' : '❌');
  
  console.log('\n📝 Para probar subida con archivo:');
  console.log(createTestFileUpload());
  
  return results;
}

// Auto-ejecutar si está en el navegador
if (typeof window !== 'undefined') {
  runAllTests();
} else {
  console.log('Ejecuta runAllTests() para iniciar los tests');
}