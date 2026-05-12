# PhysioTrack

Plataforma web para seguimiento fisioterapéutico infantil orientada a profesionales sanitarios. Combina un backend en Spring Boot, un frontend clásico en HTML/CSS/JS para autenticación y navegación, y un dashboard en React para visualización de estadísticas y progreso.

## Estructura

```
PhysoTruck-main/
├── physiotrack/                  # Backend Spring Boot (puerto 9090)
├── frontend base/                # Frontend HTML/CSS/JS (login y lista de pacientes)
├── gráfica/proyecto prácticas/   # Dashboard React + Vite + Recharts
└── PDF e Informes/               # Material auxiliar
```

## Stack

**Backend (`physiotrack/`):**
- Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA
- MySQL, JWT (jjwt), Lombok, Springdoc/Swagger

**Frontend estático (`frontend base/`):**
- HTML/CSS/JS vanilla
- JWT en `localStorage` bajo la clave `physiotrack_token`

**Dashboard React (`gráfica/proyecto prácticas/`):**
- React 19, Vite 8, Recharts, Framer Motion, Tailwind CSS

## Arrancar el proyecto

Ver [PASOS.md](PASOS.md).

## API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | — | Devuelve `{ token }` |
| GET | `/api/auth/me` | JWT | Datos del terapeuta autenticado |
| GET | `/api/patients` | JWT | Pacientes del terapeuta |
| GET | `/api/patients/{id}` | JWT | Detalle de un paciente |
| GET | `/api/patients/{id}/sessions/week/{week}` | JWT | Sesiones de una semana |
| GET | `/api/stats/weekly/{patientId}/{week}` | JWT | Métricas agregadas de una semana |
| GET | `/api/stats/progress/{patientId}` | JWT | Evolución por semanas |

Swagger UI disponible en `http://localhost:9090/swagger-ui.html`.

## Modelo de datos

```
User (terapeuta)
 └── Patient
      └── Session  (weekNumber 1–12, relativo a treatmentStart)
           └── SessionEvent  (COLLISIONS | HARSH_ACCELERATIONS | HARSH_STOPS)
```

## Datos de prueba

El backend carga `physiotrack/src/main/resources/datos_prueba.json` al arrancar si la base está vacía. Contiene dos pacientes: **Alberto** (210 sesiones) y **Alonso** (88 sesiones).

Credenciales: `fisio@physiotrack.es` / `password123`
