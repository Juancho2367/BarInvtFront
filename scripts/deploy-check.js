#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para deploy en Vercel...\n');

// Verificar archivos esenciales
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'vercel.json',
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'tailwind.config.cjs',
  'postcss.config.cjs'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar scripts en package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'preview'];
  
  console.log('\n📦 Scripts en package.json:');
  requiredScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    console.log(`${exists ? '✅' : '❌'} ${script}`);
    if (!exists) allFilesExist = false;
  });
} catch (error) {
  console.log('❌ Error leyendo package.json');
  allFilesExist = false;
}

// Verificar estructura de carpetas
const requiredDirs = [
  'src',
  'src/components',
  'src/pages',
  'src/types',
  'public'
];

console.log('\n📁 Estructura de carpetas:');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(path.join(process.cwd(), dir));
  console.log(`${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) allFilesExist = false;
});

// Verificar configuración de Vercel
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log('\n🚀 Configuración de Vercel:');
  console.log(`✅ vercel.json válido`);
  console.log(`✅ Builds configurados: ${vercelConfig.builds ? 'Sí' : 'No'}`);
  console.log(`✅ Rewrites configurados: ${vercelConfig.rewrites ? 'Sí' : 'No'}`);
} catch (error) {
  console.log('❌ Error en vercel.json');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 ¡Proyecto listo para deploy en Vercel!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Sube tu código a GitHub');
  console.log('2. Conecta tu repositorio en Vercel');
  console.log('3. Selecciona la carpeta "front" como directorio raíz');
  console.log('4. ¡Deploy automático!');
} else {
  console.log('⚠️  Hay problemas que necesitan ser resueltos antes del deploy');
}

console.log('\n🔗 Enlaces útiles:');
console.log('- Vercel: https://vercel.com');
console.log('- Documentación Vite: https://vitejs.dev');
console.log('- Tailwind CSS: https://tailwindcss.com'); 