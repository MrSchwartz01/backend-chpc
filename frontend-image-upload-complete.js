/**
 * CÓDIGO COMPLETO PARA EL FRONTEND - SUBIDA DE IMÁGENES
 * Copiar y adaptar según tu framework (React, Vue, Angular, etc.)
 */

// =============================================================================
// 1. FUNCIÓN PRINCIPAL PARA SUBIR IMÁGENES (CON AUTENTICACIÓN)
// =============================================================================

/**
 * Función para subir imagen al backend
 * @param {File} file - Archivo de imagen
 * @param {number} productId - ID del producto
 * @param {string} token - JWT token del usuario
 * @param {boolean} esPrincipal - Si es imagen principal
 * @param {number} orden - Orden de la imagen
 * @returns {Promise<Object>} Resultado de la subida
 */
async function subirImagen(file, productId, token, esPrincipal = false, orden = 0) {
  try {
    console.log('🚀 Iniciando subida de imagen...', {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      productId,
      esPrincipal,
      orden
    });

    // Validaciones previas
    if (!file) {
      throw new Error('No se seleccionó ningún archivo');
    }

    if (!token) {
      throw new Error('Token de autenticación requerido');
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.type}. Permitidos: ${allowedTypes.join(', ')}`);
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 10MB`);
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('es_principal', esPrincipal.toString());
    formData.append('orden', orden.toString());

    // Realizar petición
    const response = await fetch('https://backend-chpc.vercel.app/api/images/upload/' + productId, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // NO incluir Content-Type - el navegador lo configura automáticamente para multipart
      },
      body: formData
    });

    // Verificar respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Imagen subida exitosamente:', result);
    return result;

  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    throw error;
  }
}

// =============================================================================
// 2. FUNCIÓN CON AXIOS (ALTERNATIVA)
// =============================================================================

/**
 * Subir imagen usando Axios
 * @param {File} file - Archivo de imagen
 * @param {number} productId - ID del producto  
 * @param {string} token - JWT token del usuario
 * @param {boolean} esPrincipal - Si es imagen principal
 * @param {number} orden - Orden de la imagen
 */
async function subirImagenConAxios(file, productId, token, esPrincipal = false, orden = 0) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('es_principal', esPrincipal.toString());
    formData.append('orden', orden.toString());

    const response = await axios.post(
      `https://backend-chpc.vercel.app/api/images/upload/${productId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Axios maneja Content-Type automáticamente para FormData
        },
        timeout: 30000, // 30 segundos de timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Progreso: ${percentCompleted}%`);
        }
      }
    );

    console.log('✅ Imagen subida exitosamente:', response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      // El servidor respondió con un error
      console.error('❌ Error del servidor:', error.response.data);
      throw new Error(`Server Error ${error.response.status}: ${error.response.data.message}`);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ Error de red:', error.request);
      throw new Error('Error de conexión de red');
    } else {
      // Error al configurar la petición
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

// =============================================================================
// 3. EJEMPLO DE USO EN REACT
// =============================================================================

function ComponenteSubidaImagen() {
  const [file, setFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Selecciona un archivo primero');
      return;
    }

    setUploading(true);
    setMessage('🚀 Subiendo imagen...');

    try {
      // Obtener token del localStorage o context
      const token = localStorage.getItem('authToken'); // Ajusta según tu app
      const productId = 1; // Ajusta según tu contexto

      const result = await subirImagen(file, productId, token, true, 1);
      setMessage('✅ Imagen subida correctamente!');
      
      // Aquí puedes actualizar el estado de la UI, refrescar lista de imágenes, etc.
      // onImageUploaded(result); // Callback opcional
      
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

// =============================================================================
// 4. EJEMPLO DE USO EN VUE
// =============================================================================

const VueComponent = {
  data() {
    return {
      file: null,
      uploading: false,
      message: ''
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
      this.message = '';
    },
    async uploadImage() {
      if (!this.file) {
        this.message = '❌ Selecciona un archivo primero';
        return;
      }

      this.uploading = true;
      this.message = '🚀 Subiendo imagen...';

      try {
        const token = this.$store.getters.authToken; // Ajusta según tu store
        const productId = this.$route.params.id; // Ajusta según tu router

        const result = await subirImagen(this.file, productId, token, true, 1);
        this.message = '✅ Imagen subida correctamente!';
        
        // Emitir evento o actualizar store
        this.$emit('image-uploaded', result);
        
      } catch (error) {
        this.message = `❌ Error: ${error.message}`;
      } finally {
        this.uploading = false;
      }
    }
  }
};

// =============================================================================
// 5. FUNCIONES DE UTILIDAD ADICIONALES
// =============================================================================

/**
 * Validar archivo antes de subir
 */
function validarArchivo(file) {
  const errors = [];
  
  if (!file) {
    errors.push('No se seleccionó ningún archivo');
    return errors;
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Tipo de archivo no permitido: ${file.type}`);
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 10MB`);
  }

  return errors;
}

/**
 * Redimensionar imagen antes de subir (opcional)
 */
function redimensionarImagen(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convertir a blob
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
}

// =============================================================================
// 6. EXPORTAR FUNCIONES (Si usas módulos)
// =============================================================================

// Para ES6 modules
// export { subirImagen, subirImagenConAxios, validarArchivo, redimensionarImagen };

// Para CommonJS
// module.exports = { subirImagen, subirImagenConAxios, validarArchivo, redimensionarImagen };

console.log('📋 Código de subida de imágenes cargado correctamente');
console.log('🔧 Funciones disponibles: subirImagen, subirImagenConAxios, validarArchivo, redimensionarImagen');