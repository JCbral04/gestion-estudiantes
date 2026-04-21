# Sistema de Gestión de Estudiantes

## miembros del equipo
 - Juan Esteban Cabral Bautista 
 - Óscar Fabián Forero Díaz 
 - Manuel Osorio Feo
 - Juan Camilo Céspedes 

Aplicación web full-stack para el registro y administración de estudiantes. Permite crear, listar y eliminar estudiantes con una interfaz moderna y responsive.

## Características

- Registro de estudiantes con nombre, correo y programa
- Listado dinámico de estudiantes con fecha de registro
- Eliminación de estudiantes con confirmación
- Validación de datos en cliente y servidor
- Notificaciones interactivas (toast notifications)
- Diseño responsive (móvil y escritorio)
- Conexión a base de datos MongoDB Atlas

## Tecnologías

**Frontend:**
- HTML5 semántico
- CSS3 con variables CSS y animaciones
- JavaScript vanilla (ES6+)
- Font Awesome (iconos)
- Google Fonts (Inter)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

## Estructura del Proyecto

```
gestion-estudiantes/
├── index.html              # Página principal (UI)
├── styles.css              # Estilos CSS
├── app.js                  # Lógica frontend (CRUD)
├── backend/
│   ├── server.js           # Servidor Express + API REST
│   ├── package.json        # Dependencias Node.js
│   └── .env                # Variables de entorno
└── README.md
```

## Instalación

### 1. Clonar o descargar el proyecto

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```
MONGODB_URI=tu_uri_de_mongodb_atlas
PORT=3000
```

### 3. Iniciar servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 4. Abrir Frontend

Abrir `index.html` directamente en el navegador, o servir con un servidor local.

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información de la API |
| GET | `/api/estudiantes` | Obtener todos los estudiantes |
| POST | `/api/estudiantes` | Crear nuevo estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante |

### Ejemplo POST `/api/estudiantes`

```json
{
  "nombre": "María González",
  "correo": "maria@email.com",
  "programa": "Desarrollo Web"
}
```

## Modelo de Datos

**Estudiante:**
- `nombre`: String (requerido)
- `correo`: String (requerido, único)
- `programa`: String (requerido)
- `fechaRegistro`: Date (automático)

## Programas Disponibles

- Desarrollo Web
- Base de Datos
- Programación JavaScript
- Diseño UX/UI
- Marketing Digital
- Análisis de Datos

## Scripts NPM

| Comando | Descripción |
|---------|-------------|
| `npm start` | Iniciar servidor en producción |
| `npm run dev` | Iniciar con nodemon (desarrollo) |

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `PORT` | Puerto del servidor (default: 3000) |

## Características de la UI

- Diseño moderno con gradientes y sombras
- Indicadores de carga (spinner)
- Estados vacíos personalizados
- Notificaciones toast animadas
- Tabla responsive con hover effects
- Validación de email en tiempo real

## Despliegue

- **Frontend**: Puede desplegarse en Netlify, Vercel, o GitHub Pages
- **Backend**: Desplegado en Render (URL configurada en `app.js`)

## URL del Backend en Producción

```
https://gestion-estudiantes-api-14x6.onrender.com/api
```
