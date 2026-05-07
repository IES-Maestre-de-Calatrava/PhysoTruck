# PhysioTrack - Frontend Base

Frontend con Bootstrap para el sistema de gestión fisioterapéutica PhysioTrack.

## 📋 Características

- ✅ Sistema de autenticación con JWT
- ✅ Selección dinámica de pacientes
- ✅ Dashboard de información del paciente
- ✅ Interfaz moderna y responsiva
- ✅ Navegación fluida entre secciones
- ✅ Estilos optimizados con Bootstrap 5

## 🚀 Instalación

### Requisitos
- Backend de PhysioTrack corriendo en `http://localhost:9090`
- Un servidor HTTP local

### Opción 1: Python (Recomendado)

```bash
cd "frontend base"
python -m http.server 8000
```

Luego abre: `http://localhost:8000`

### Opción 2: Node.js

```bash
cd "frontend base"
npx http-server -p 8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🔑 Credenciales de Prueba

Usa las credenciales en tu base de datos MySQL. El backend debe estar ejecutándose y la base de datos poblada.

## 📁 Estructura de Archivos

```
frontend base/
├── index.html              # Página de login
├── inicio.html             # Selección de pacientes
├── alberto.html            # Dashboard de Alberto
├── alonso.html             # Dashboard de Alonso
├── js/
│   ├── api.js             # Cliente HTTP para comunicación con backend
│   ├── common.js          # Funciones compartidas (autenticación)
│   ├── index.js           # Lógica del login
│   ├── inicio.js          # Lógica de selección de pacientes
│   └── paciente.js        # Lógica del dashboard del paciente
├── css/
│   ├── login.css          # Estilos de la página de login
│   ├── inicio.css         # Estilos de la página de inicio
│   ├── paciente.css       # Estilos del dashboard
│   ├── shared.css         # Estilos compartidos
│   └── subpages.css       # Estilos de subpáginas
└── galeria/               # Imágenes del proyecto
```

## 🎨 Características de Diseño

- **Diseño Moderno**: Gradientes degradados, glassmorphism y animaciones suaves
- **Responsive**: Funciona perfectamente en desktop, tablet y móvil
- **Color Scheme**: Morado/azul (#667eea a #764ba2)
- **Tipografía**: Inter Font Stack
- **Animaciones**: Transiciones fluidas y efecto hover

## 🔧 Configuración del Backend

El frontend espera que el backend esté disponible en:
```
http://localhost:9090
```

Si necesitas cambiar esta URL, edita `js/api.js`:
```javascript
const API_BASE_URL = "http://localhost:9090";
```

## 📝 Endpoints del API Esperados

- `POST /api/auth/login` - Autenticación
- `GET /api/patients` - Obtener lista de pacientes (requiere autenticación)
- `GET /api/stats/patient/{patientId}` - Obtener estadísticas del paciente

## 🛠️ Notas de Desarrollo

- Los datos del localStorage se guardan bajo las claves: `physiotrack_token` y `physiotrack_user_email`
- La autenticación usa JWT (Bearer token)
- Los errores de conexión con el API se muestran en mensajes de alerta
- Los datos de prueba se cargan automáticamente si el API no responde

## 📄 Licencia

Este proyecto es parte de PhysioTrack para la gestión de terapias fisioterapéuticas.
