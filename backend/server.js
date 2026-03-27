const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => {
    console.error(' Error de conexión:', err.message);
    process.exit(1);
  });

// Esquema del estudiante
const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  programa: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

// ============================================
// RUTAS API
// ============================================

// GET - Obtener todos los estudiantes
app.get('/api/estudiantes', async (req, res) => {
  try {
    const estudiantes = await Estudiante.find().sort({ fechaRegistro: -1 });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear nuevo estudiante
app.post('/api/estudiantes', async (req, res) => {
  try {
    const { nombre, correo, programa } = req.body;
    
    if (!nombre || !correo || !programa) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoEstudiante = new Estudiante({ nombre, correo, programa });
    await nuevoEstudiante.save();
    
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar estudiante
app.delete('/api/estudiantes/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
    
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    res.json({ mensaje: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de Gestión de Estudiantes',
    endpoints: {
      GET: '/api/estudiantes',
      POST: '/api/estudiantes',
      DELETE: '/api/estudiantes/:id'
    }
  });
});

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});