// Importar dependencias necesarias
const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno desde archivo .env (si existe)
dotenv.config();

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Ruta para obtener todas las variables de entorno (solo para desarrollo)
app.get('/api/env/all', (req, res) => {
  // NOTA: Solo usar esta ruta en entornos de desarrollo
  // Ya que exponer todas las variables de entorno puede ser un riesgo de seguridad
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Esta ruta solo está disponible en entorno de desarrollo' });
  }
  
  res.json(process.env);
});

// Ruta para obtener una variable de entorno específica
app.get('/api/env/:variable', (req, res) => {
  const variableName = req.params.variable;
  
  // Verificar si la variable existe
  if (process.env[variableName] === undefined) {
    return res.status(404).json({ error: `La variable de entorno "${variableName}" no existe` });
  }
  
  // Opcional: Lista de variables protegidas que nunca deberían ser expuestas
  const protectedVars = ['DATABASE_PASSWORD', 'API_SECRET', 'JWT_SECRET', 'SECRET_KEY'];
  if (protectedVars.includes(variableName)) {
    return res.status(403).json({ error: 'No se puede acceder a esta variable por razones de seguridad' });
  }
  
  // Retornar la variable solicitada
  res.json({
    name: variableName,
    value: process.env[variableName]
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`API de variables de entorno ejecutándose en el puerto ${PORT}`);
});