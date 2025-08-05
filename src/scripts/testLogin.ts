/**
 * Script para probar el login y verificar la redirección
 * Uso: npm run test-login
 */

// Simular el proceso de login
const testLogin = async () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  console.log('🧪 Probando login...');
  console.log('🔗 API URL:', API_URL);
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'admin', 
        password: 'admin123' 
      }),
    });

    const data = await response.json();
    
    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Login exitoso');
      console.log('👤 Usuario:', data.user);
      console.log('🔑 Token:', data.token ? 'Presente' : 'Ausente');
      
      // Verificar token
      const profileResponse = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (profileResponse.ok) {
        console.log('✅ Token válido - Perfil accesible');
      } else {
        console.log('❌ Token inválido');
      }
    } else {
      console.log('❌ Login fallido');
      console.log('Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar prueba
testLogin();

export { testLogin }; 