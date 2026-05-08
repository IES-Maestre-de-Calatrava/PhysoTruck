# PhysioTrack

Plataforma web para seguimiento fisioterapéutico infantil orientada a profesionales sanitarios. El proyecto combina un backend en Spring Boot, un frontend clásico en HTML/CSS/JS para autenticación y navegación, y un dashboard moderno en React para visualización de estadísticas y progreso.

Este README está pensado para que una persona o una IA pueda entender rápido:

- qué contiene realmente este repositorio,
- cómo se conectan sus partes,
- qué funcionalidades existen hoy,
- qué flujo sigue el usuario,
- cómo arrancarlo en local,
- y cuáles son sus limitaciones actuales.

## Objetivo del proyecto

PhysioTrack centraliza el seguimiento de pacientes pediátricos con dificultades motoras a partir de sesiones registradas en una plataforma de conducción terapéutica. El sistema permite:

- autenticar a un fisioterapeuta,
- consultar sus pacientes asignados,
- revisar métricas por semana,
- visualizar evolución del rendimiento,
- revisar sesiones recientes,
- y exportar datos resumidos.

La idea general es que el profesional pueda seguir el progreso funcional de cada paciente a lo largo del tratamiento mediante indicadores simples y gráficos interpretables.

## Qué hay en este repositorio

El repo no es una única aplicación monolítica de frontend. Contiene varias piezas que conviven:

```text
PhysoTruck-main/
├── physiotrack/                  # Backend principal Spring Boot
├── frontend base/                # Frontend clásico HTML/CSS/JS
├── gráfica/proyecto prácticas/   # Dashboard moderno React + Vite + Recharts
├── PDF e Informes/               # Material auxiliar / trabajo paralelo
├── fisio/                        # Recursos gráficos
└── README.md                     # Este documento
```

## Arquitectura real

### 1. Backend principal: `physiotrack/`

Aplicación Spring Boot con:

- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- MySQL
- Lombok
- Springdoc / Swagger UI

Responsabilidades principales:

- autenticación del fisioterapeuta,
- autorización por paciente asignado,
- carga inicial de datos demo,
- consulta de pacientes,
- consulta de sesiones por semana,
- cálculo de métricas semanales,
- agregación de progreso por semanas.

### 2. Frontend clásico: `frontend base/`

Frontend estático tradicional con:

- `index.html`: login,
- `inicio.html`: lista de pacientes,
- `alberto.html` y `alonso.html`: resumen clásico por paciente,
- subpáginas HTML que redirigen al dashboard moderno.

Este frontend sigue siendo la puerta de entrada del sistema. Gestiona:

- sesión con JWT,
- persistencia del token en `localStorage`,
- carga del usuario autenticado,
- listado visual de pacientes,
- navegación entre páginas.

### 3. Frontend moderno de gráficas: `gráfica/proyecto prácticas/`

Proyecto React + Vite usado para las vistas de estadísticas más modernas.

Tecnologías:

- React 19
- Vite 8
- Recharts
- ESLint

Este frontend no vive aislado: se compila directamente dentro de `frontend base/charts/` para que el frontend clásico pueda redirigir hacia él.

## Flujo completo del usuario

El flujo actual del sistema es:

1. El usuario abre `frontend base/index.html`.
2. Introduce credenciales.
3. El frontend hace `POST /api/auth/login`.
4. Si el login es correcto, guarda el JWT en `localStorage`.
5. Redirige a `frontend base/inicio.html`.
6. La página de inicio consulta `GET /api/patients`.
7. El fisioterapeuta ve los pacientes asignados.
8. Al seleccionar un paciente:
   - en el frontend clásico entra en una página fija (`alberto.html` o `alonso.html`),
   - y desde varias subpáginas se redirige al dashboard React con `?patient=Nombre`.
9. El dashboard React resuelve el paciente por nombre, obtiene su `id` y consulta:
   - progreso semanal,
   - sesiones recientes,
   - métricas agregadas.

## Funcionalidades existentes

### Autenticación

- Login mediante correo y contraseña.
- Token JWT con expiración.
- Redirección al login cuando la sesión caduca.
- Persistencia opcional del correo recordado en el frontend clásico.

### Gestión de pacientes

- Listado de pacientes vinculados al fisioterapeuta autenticado.
- Filtro por nombre, diagnóstico y nivel.
- Tarjetas visuales con información clínica básica:
  - nombre,
  - diagnóstico,
  - nivel actual,
  - fecha de inicio de tratamiento,
  - estado activo.

### Dashboard por paciente

En el frontend clásico:

- cabecera de paciente,
- nivel actual,
- línea temporal de semanas,
- métricas semanales,
- gráfica de evolución con Chart.js.

En el frontend React:

- nombre del paciente,
- badge de nivel,
- exportación CSV,
- tarjetas resumen,
- gráfica de evolución del score,
- gráfica combinada de sesiones y tiempo,
- tabla semanal,
- historial reciente de sesiones,
- modal para ampliar la gráfica.

### Estadísticas semanales

El backend calcula o expone:

- número total de sesiones,
- tiempo total de movimiento,
- tiempo medio de movimiento,
- score medio de conducción,
- score medio de estabilidad,
- total de eventos asociados a sesiones,
- suma del conteo de eventos.

### Progreso longitudinal

Por cada semana de tratamiento se agrupa:

- número de sesiones,
- score medio de conducción,
- score medio de estabilidad,
- nivel más reciente observado en la semana.

### Sesiones recientes

El dashboard React consulta las sesiones de la última semana disponible y muestra:

- tipo o nivel de conducción,
- semana,
- fecha de inicio,
- estado completado.

### Exportación

El dashboard React incluye exportación CSV con:

- semana,
- número de sesiones,
- score,
- tiempo.

## Estado funcional actual

El proyecto tiene una mezcla de piezas terminadas, piezas heredadas y puntos en transición.

### Qué está integrado de verdad

- El backend Spring Boot es la fuente principal de datos.
- El login del frontend clásico funciona contra ese backend.
- El listado de pacientes funciona contra ese backend.
- El dashboard React se construye para incrustarse en `frontend base/charts`.
- Varias páginas antiguas ya redirigen al dashboard React.

### Qué sigue siendo legado

- Hay una capa HTML/JS clásica que aún controla gran parte de la navegación.
- Algunas páginas antiguas siguen existiendo aunque ya delegan el contenido a React.
- Hay componentes React presentes pero no usados actualmente.
- Hay clases Java antiguas o auxiliares que no parecen estar en el flujo principal.

## Estructura detallada

### Backend `physiotrack/`

Archivos importantes:

- `pom.xml`: dependencias Maven y configuración del proyecto.
- `src/main/resources/application.properties`: puerto, MySQL, JWT.
- `src/main/java/.../config/SecurityConfig.java`: seguridad, filtro JWT, CORS.
- `src/main/java/.../security/JwtService.java`: generación y validación de tokens.
- `src/main/java/.../controller/AuthController.java`: login y usuario actual.
- `src/main/java/.../controller/PatientController.java`: pacientes y sesiones por semana.
- `src/main/java/.../controller/StatsController.java`: estadísticas y progreso.
- `src/main/java/.../controller/PatientAccessHelper.java`: control de acceso por terapeuta.
- `src/main/java/.../seeder/DataSeeder.java`: carga inicial de datos demo.

### Frontend clásico `frontend base/`

Archivos importantes:

- `index.html`: login.
- `inicio.html`: selector de pacientes.
- `alberto.html` / `alonso.html`: paneles clásicos por paciente.
- `js/api.js`: cliente HTTP y gestión del token.
- `js/common.js`: helpers de autenticación.
- `js/index.js`: lógica del login.
- `js/inicio.js`: carga de pacientes y navegación.
- `js/paciente.js`: resumen clásico del paciente.
- `js/subpages.js`: lógica para páginas auxiliares por semana.

### Dashboard React `gráfica/proyecto prácticas/`

Archivos importantes:

- `package.json`: dependencias y scripts.
- `vite.config.js`: build hacia `../../frontend base/charts`.
- `src/main.jsx`: entrada React.
- `src/App.jsx`: composición principal del dashboard.
- `src/api.js`: cliente API del dashboard.
- `src/components/ui/`: badge, exportación y utilidades visuales.
- `src/components/stats/`: bloques de resumen e historial.
- `src/components/charts/`: gráficas con Recharts.

## Build y despliegue interno del frontend React

El detalle más importante de integración es este:

- el proyecto React no genera una carpeta `dist/` para uso independiente,
- genera su build dentro de `frontend base/charts/`,
- por eso el frontend clásico puede enlazar directamente a `../charts/?patient=...`.

Esto está definido en `gráfica/proyecto prácticas/vite.config.js`:

- `base: './'`
- `outDir: ../../frontend base/charts`

## API disponible

### Autenticación

- `POST /api/auth/login`
  - recibe email y password,
  - devuelve `{ token }`.

- `GET /api/auth/me`
  - requiere JWT,
  - devuelve información básica del fisioterapeuta autenticado.

### Pacientes

- `GET /api/patients`
  - devuelve los pacientes del terapeuta autenticado.

- `GET /api/patients/{id}`
  - devuelve el detalle básico del paciente si pertenece al terapeuta.

- `GET /api/patients/{id}/sessions/week/{week}`
  - devuelve sesiones de una semana concreta.

### Estadísticas

- `GET /api/stats/weekly/{patientId}/{week}`
  - devuelve métricas agregadas de una semana.

- `GET /api/stats/progress/{patientId}`
  - devuelve la evolución agrupada por semanas.

### Documentación interactiva

Swagger UI está habilitado a través de Springdoc cuando el backend está corriendo.

## Modelo de datos

### `User`

Representa al fisioterapeuta:

- `id`
- `email`
- `passwordHash`
- `fullName`
- `sescamId`
- `active`

Relación:

- un `User` tiene muchos `Patient`.

### `Patient`

Representa al paciente:

- `id`
- `fullName`
- `birthDate`
- `diagnosis`
- `treatmentStart`
- `currentLevel`
- `active`
- `therapist`

Relación:

- un `Patient` tiene muchas `Session`.

### `Session`

Representa una sesión registrada:

- `id`
- `externalId`
- `startedAt`
- `endedAt`
- `movementTime`
- `stabilityScore`
- `drivingScore`
- `drivingLevel`
- `weekNumber`
- `patient`

Relación:

- una `Session` tiene muchos `SessionEvent`.

### `SessionEvent`

Eventos agregados por sesión:

- `id`
- `eventType`
- `count`
- `session`

Tipos usados en el seed:

- `COLLISIONS`
- `HARSH_ACCELERATIONS`
- `HARSH_STOPS`

## Dataset de prueba

El proyecto se apoya en `physiotrack/src/main/resources/datos_prueba.json`.

### Qué hace el seed

Cuando la base de datos está vacía:

- crea un fisioterapeuta demo,
- recorre el JSON,
- crea pacientes,
- crea sesiones,
- crea eventos por sesión,
- calcula la semana del tratamiento,
- establece el nivel actual según la sesión más reciente.

### Credenciales demo

Si la base está vacía y se deja actuar al seed:

- email: `fisio@sescam.es`
- contraseña: `password123`

### Alcance real del dataset

Actualmente el dataset contiene 2 pacientes principales:

- `Alberto`
- `Alonso`

Resumen aproximado del material cargado:

- Alberto: 40 días con sesiones, 210 sesiones.
- Alonso: 9 días con sesiones, 88 sesiones.

## Cómo arrancarlo en local

## Requisitos

- Java 21
- Maven Wrapper o Maven
- MySQL local
- Node.js y npm
- un servidor HTTP simple para el frontend clásico

## 1. Configurar backend

En `physiotrack/src/main/resources/application.properties`:

- la base esperada es `physiotrack`,
- el puerto es `9090`,
- la contraseña se toma desde `DB_PASSWORD`,
- el secreto JWT se toma desde `JWT_SECRET` o usa un valor por defecto de desarrollo.

Puedes usar un `.env` si quieres apoyarte en la importación configurada por Spring.

## 2. Arrancar backend

Desde `physiotrack/`:

```bash
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

## 3. Instalar dependencias del dashboard React

Desde `gráfica/proyecto prácticas/`:

```bash
npm install
```

## 4. Ejecutar React en desarrollo

```bash
npm run dev
```

Esto sirve el proyecto React por Vite para trabajar directamente sobre esa parte.

## 5. Generar el build integrado

```bash
npm run build
```

El resultado se copia a:

```text
frontend base/charts/
```

## 6. Servir el frontend clásico

Desde `frontend base/`, por ejemplo:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000
```

## Scripts útiles

### React / Vite

En `gráfica/proyecto prácticas/`:

- `npm run dev`: entorno de desarrollo Vite.
- `npm run build`: build para `frontend base/charts`.
- `npm run preview`: previsualización del build.
- `npm run lint`: lint del código React.

### Backend

En `physiotrack/`:

- `./mvnw spring-boot:run`: arranque local.
- `./mvnw test`: tests del backend.

## Decisiones de diseño relevantes

### JWT en `localStorage`

Tanto el frontend clásico como el dashboard React usan la misma clave:

- `physiotrack_token`

Eso permite compartir sesión entre ambas capas.

### Nombre de paciente por query string

El dashboard React usa:

```text
../charts/?patient=Alberto
```

Con ese nombre:

- busca el paciente en `/api/patients`,
- obtiene el `id`,
- y después llama al resto de endpoints.

### Semanas de tratamiento

El backend calcula ventanas de 12 semanas máximas a partir de `treatmentStart`.

La lógica está centralizada en `PatientAccessHelper`.

## Limitaciones y deuda técnica actual

Esta sección es importante porque describe el estado real, no el ideal.

### 1. Navegación hardcodeada a dos pacientes

El frontend clásico actualmente reconoce de forma explícita solo:

- Alberto
- Alonso

Si aparece otro paciente en la base de datos, la navegación visual actual no lo resuelve automáticamente hacia una página propia.

### 2. Contrato desalineado entre React y backend

El dashboard React espera en la respuesta de progreso algunos campos que el backend no entrega con esos nombres.

Ejemplo:

- React usa `totalSessions` y `avgMovementTime` sobre la respuesta de `/stats/progress/{id}`.
- El backend devuelve `sessionCount`, `avgDrivingScore`, `avgStabilityScore` y `level`.

Consecuencia:

- parte de la información mostrada en el dashboard React puede aparecer a cero o incompleta aunque el backend tenga datos válidos.

### 3. Dataset con anomalías de fecha

El JSON de prueba contiene al menos una fecha antigua (`2001-11-02`) asociada a `Alonso`.

Esto puede afectar:

- `treatmentStart`,
- el cálculo de `weekNumber`,
- el rango temporal aparente del tratamiento.

### 4. Código heredado no totalmente alineado

Hay clases o componentes presentes que no parecen estar en uso principal, por ejemplo:

- servicios Java antiguos,
- componentes React no montados en `App.jsx`,
- subpáginas HTML heredadas.

### 5. Mezcla de estilos y tecnologías

El repo mezcla:

- HTML/CSS/JS clásico,
- Bootstrap,
- Chart.js,
- React,
- Recharts,
- estilos inline.

Eso complica un poco el mantenimiento y hace que el sistema esté en un estado híbrido.

### 6. Problemas de codificación de caracteres

En varios archivos hay texto mojibake (`Ã`, `â†`, etc.), señal de inconsistencias de encoding entre UTF-8 y otras codificaciones.

## Qué parte conviene considerar “fuente de verdad”

Si alguien va a trabajar sobre este repo, esta es la lectura recomendada:

- La fuente de verdad de datos y permisos es `physiotrack/`.
- La puerta de entrada funcional para el usuario es `frontend base/`.
- La fuente de verdad del dashboard moderno es `gráfica/proyecto prácticas/`.
- `frontend base/charts/` debe tratarse como artefacto generado, no como origen manual de desarrollo.

## Recomendaciones para futuras IA o colaboradores

Si vas a continuar el proyecto, el orden más útil para entenderlo es:

1. leer este README,
2. revisar `physiotrack/src/main/resources/application.properties`,
3. leer `SecurityConfig`, `AuthController`, `PatientController` y `StatsController`,
4. revisar `frontend base/js/api.js` y `frontend base/js/inicio.js`,
5. revisar `gráfica/proyecto prácticas/src/App.jsx`,
6. confirmar el contrato real de la API frente a lo que consume el frontend React,
7. revisar el dataset `datos_prueba.json` antes de depurar métricas.

## Resumen ejecutivo

PhysioTrack es hoy un sistema híbrido de seguimiento fisioterapéutico infantil con:

- backend robusto en Spring Boot,
- autenticación JWT,
- pacientes asociados a un terapeuta,
- métricas por semanas,
- dashboards clásicos y modernos coexistiendo,
- integración real entre frontend legado y React,
- seed automático con datos demo,
- y una deuda técnica localizada sobre todo en navegación, coherencia de contratos y limpieza del estado híbrido.

Si el objetivo es evolucionarlo, la mejor base ya existe: el backend y el flujo de autenticación están bastante claros. El principal trabajo pendiente está en unificar frontend, limpiar contratos de datos y documentar mejor la arquitectura operativa, que es precisamente lo que este README intenta dejar resuelto.

## Diagnóstico de visualización de gráficas y datos diarios

Esta sección resume un diagnóstico estático del código para explicar por qué actualmente los datos diarios y algunas gráficas no se visualizan correctamente.

### Diagnóstico claro

La causa raíz no es un único error, sino la combinación de varios problemas de integración y alcance funcional:

- El dashboard React construye parte de sus datos semanales desde `/api/stats/progress/{patientId}` usando campos que el backend no devuelve con esos nombres.
- Las vistas llamadas "por día" en el frontend clásico no consumen datos diarios reales; en realidad usan el endpoint semanal.
- El backend no implementa un endpoint diario para sesiones o estadísticas por fecha.
- El dataset de prueba contiene al menos una fecha anómala para `Alonso`, lo que distorsiona el cálculo de semanas y puede desplazar datos fuera de los rangos visibles.

### Causa técnica detallada

#### 1. Desalineación entre el dashboard React y `/api/stats/progress`

En el frontend React, `App.jsx` obtiene el progreso del paciente con:

- `apiGetProgress(patient.id)`

Después transforma la respuesta en `weekData` con esta expectativa:

- `w.totalSessions`
- `w.avgDrivingScore`
- `w.avgMovementTime`

Sin embargo, el backend en `StatsController` devuelve para cada semana:

- `week`
- `sessionCount`
- `avgDrivingScore`
- `avgStabilityScore`
- `level`

Eso implica:

- `avgDrivingScore` sí existe y la gráfica de score puede renderizar.
- `totalSessions` no existe en esa respuesta, porque el backend usa `sessionCount`.
- `avgMovementTime` no existe en absoluto en ese endpoint.

Consecuencia directa:

- la tarjeta de sesiones del dashboard React puede quedar en `0`,
- la tarjeta de tiempo puede quedar en `0`,
- el `UsageChart` puede mostrar barras o líneas incorrectas,
- la exportación CSV puede incluir datos incompletos,
- y parte del historial semanal queda calculado con información que no está realmente disponible en esa respuesta.

Archivos clave:

- `gráfica/proyecto prácticas/src/App.jsx`
- `gráfica/proyecto prácticas/src/api.js`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/StatsController.java`

#### 2. Las vistas "por día" no son realmente diarias

Las páginas del frontend clásico:

- `frontend base/alberto/estadisticasPorDia.html`
- `frontend base/alberto/estadisticasDiaDia.html`
- `frontend base/alonso/estadisticasPorDia.html`
- `frontend base/alonso/estadisticasDiaDia.html`

usan el script:

- `frontend base/js/subpages.js`

Ese script no llama a ningún endpoint diario. En su lugar hace:

- `apiGetWeeklyStats(patientId, week)`

es decir:

- `/api/stats/weekly/{patientId}/{week}`

Por tanto, aunque la UI diga "Estadísticas por día" o "día a día", lo que realmente muestra es un resumen semanal agregado.

Consecuencia:

- no existe visualización diaria real en el frontend clásico,
- no hay desglose por fecha dentro de la semana,
- y el nombre de estas pantallas induce a pensar que hay una funcionalidad que en realidad no está implementada.

Archivos clave:

- `frontend base/js/subpages.js`
- `frontend base/js/api.js`
- `frontend base/alberto/estadisticasPorDia.html`
- `frontend base/alonso/estadisticasPorDia.html`

#### 3. No existe endpoint diario en el backend

En el backend actual sí existen:

- `GET /api/stats/weekly/{patientId}/{week}`
- `GET /api/stats/progress/{patientId}`
- `GET /api/patients/{id}/sessions/week/{week}`

Pero no existe ningún endpoint tipo:

- `/api/patients/{id}/sessions/day/{date}`
- `/api/stats/daily/...`

Ni `StatsController` ni `PatientController` exponen una ruta diaria.

Consecuencia:

- aunque el frontend quisiera renderizar datos diarios reales, no tiene una API específica para pedirlos.

Archivos clave:

- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/StatsController.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/PatientController.java`

#### 4. Anomalía en el dataset que afecta la lógica temporal

El `DataSeeder` calcula `treatmentStart` usando la fecha más antigua encontrada en `datos_prueba.json`.

Para `Alonso`, el dataset contiene la fecha:

- `2001-11-02`

al menos en dos lugares del JSON.

Después `DataSeeder` calcula el número de semana usando la diferencia entre `treatmentStart` y la fecha de cada sesión, y limita el resultado al rango `1..12`.

Consecuencia:

- si una sesión moderna cae muchos años después de la fecha inicial anómala, acaba colapsando en la semana 12,
- parte de la información temporal deja de reflejar el tratamiento real,
- y eso puede hacer que ciertas vistas por semana parezcan vacías o poco coherentes.

Además, en el frontend clásico algunas subpáginas solo ofrecen semanas `1..4`, así que cualquier dato que termine en la semana 12 ni siquiera se puede seleccionar desde esa interfaz.

Archivos clave:

- `physiotrack/src/main/java/com/physiotrack/physiotrack/seeder/DataSeeder.java`
- `physiotrack/src/main/resources/datos_prueba.json`
- `frontend base/alonso/estadisticasPorDia.html`
- `frontend base/alberto/estadisticasPorDia.html`

### Flujo real de datos en el frontend React

El dashboard React sigue este proceso:

1. Lee `patient` desde la query string.
2. Llama a `/api/patients`.
3. Busca el paciente por nombre y obtiene su `id`.
4. Llama a `/api/stats/progress/{id}`.
5. Usa esa respuesta para construir:
   - la gráfica de evolución del score,
   - y también datos de sesiones/tiempo que realmente no están completos en esa API.
6. Obtiene sesiones recientes de la última semana mediante:
   - `/api/patients/{id}/sessions/week/{week}`

Observación importante:

- el frontend React sí tiene declarado `apiGetWeeklyStats`,
- pero `App.jsx` no lo usa para construir sus bloques semanales principales.

Eso explica por qué una parte del dashboard sí parece viva y otra parte parece vacía o incorrecta:

- la evolución del score depende de un campo que sí existe,
- las sesiones y el tiempo semanal dependen de campos inexistentes en ese endpoint.

### Verificación del contrato de la API

| Endpoint | Frontend espera | Backend envía | Estado |
|---|---|---|---|
| `/api/stats/progress/{id}` | `weeks[].totalSessions` | `weeks[].sessionCount` | Desalineado |
| `/api/stats/progress/{id}` | `weeks[].avgMovementTime` | No existe | Desalineado |
| `/api/stats/progress/{id}` | `weeks[].avgDrivingScore` | `weeks[].avgDrivingScore` | Correcto |
| `/api/stats/progress/{id}` | `weeks[].avgStabilityScore` | `weeks[].avgStabilityScore` | Correcto, pero React no lo usa en el dashboard nuevo |
| `/api/stats/weekly/{id}/{week}` | `totalSessions` | `totalSessions` | Correcto |
| `/api/stats/weekly/{id}/{week}` | `averageMovementTime` | `averageMovementTime` | Correcto |
| `/api/stats/weekly/{id}/{week}` | `averageDrivingScore` | `averageDrivingScore` | Correcto |

### Funcionalidades implementadas

Actualmente sí están implementadas estas capacidades:

- login con JWT,
- listado de pacientes por fisioterapeuta autenticado,
- consulta de progreso semanal agregado,
- consulta de métricas agregadas por semana,
- consulta de sesiones por semana,
- gráfica semanal de score en el dashboard React,
- gráfica semanal clásica con Chart.js en el frontend antiguo,
- exportación CSV desde el dashboard React.

### Funcionalidades ausentes, incompletas o engañosamente nombradas

- No existe endpoint diario real en el backend.
- No existe gráfica diaria real en React.
- Las pantallas llamadas "por día" del frontend clásico muestran resúmenes semanales, no diarios.
- No hay agregación por fecha dentro de una semana.
- El componente `DataFilter.jsx` existe en React, pero no está montado en `App.jsx`.
- `StatsService.java` contiene lógica de estadística diaria conceptual, pero no está conectado al flujo principal del backend actual.

### Rutas de archivos relevantes

Frontend React:

- `gráfica/proyecto prácticas/src/App.jsx`
- `gráfica/proyecto prácticas/src/api.js`
- `gráfica/proyecto prácticas/src/components/charts/UsageChart.jsx`
- `gráfica/proyecto prácticas/src/components/charts/ProgressChart.jsx`
- `gráfica/proyecto prácticas/src/components/ui/DataFilter.jsx`

Frontend clásico:

- `frontend base/js/api.js`
- `frontend base/js/subpages.js`
- `frontend base/js/paciente.js`
- `frontend base/alberto/estadisticasPorDia.html`
- `frontend base/alberto/estadisticasDiaDia.html`
- `frontend base/alonso/estadisticasPorDia.html`
- `frontend base/alonso/estadisticasDiaDia.html`

Backend:

- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/StatsController.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/PatientController.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/controller/PatientAccessHelper.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/repository/SessionRepository.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/repository/PatientRepository.java`
- `physiotrack/src/main/java/com/physiotrack/physiotrack/seeder/DataSeeder.java`
- `physiotrack/src/main/resources/datos_prueba.json`

Build:

- `gráfica/proyecto prácticas/vite.config.js`
- `frontend base/charts/`

### Estado del build del dashboard React

La configuración de Vite es coherente con la arquitectura del proyecto:

- `base: './'`
- `outDir: ../../frontend base/charts`

Esto confirma que el dashboard React está diseñado para compilarse dentro del frontend clásico.

No hay evidencia clara en el código de que el problema principal sea un build mal configurado. Aun así, cada vez que se hagan cambios en `gráfica/proyecto prácticas/`, es necesario regenerar el build para que `frontend base/charts/` refleje la versión actual.

### Recomendaciones concretas

#### Opción mínima para corregir el dashboard actual

- Modificar el frontend React para usar `/api/stats/progress/{id}` solo para la evolución del score.
- Usar `/api/stats/weekly/{id}/{week}` para obtener sesiones y tiempos reales por semana.
- Corregir el mapeo de nombres de campos (`sessionCount` frente a `totalSessions`) si se mantiene el uso de `/progress`.

#### Opción correcta si se quiere soporte diario real

- Implementar un endpoint diario en el backend, por ejemplo:
  - `/api/patients/{id}/sessions/day/{date}`
  - o `/api/stats/daily/{patientId}/{week}`
- Añadir en backend una agregación por fecha dentro de la semana.
- Rehacer las páginas "por día" para que consuman ese endpoint en lugar del semanal.
- Si se desea, crear también una vista diaria real en React.

#### Recomendaciones sobre datos

- Revisar y corregir la fecha anómala `2001-11-02` en `datos_prueba.json`.
- Verificar que `treatmentStart` refleje el inicio real del tratamiento.
- Recalcular semanas tras limpiar el dataset.

#### Recomendaciones de mantenimiento

- Unificar la fuente de verdad del frontend para evitar duplicidad entre React y HTML clásico.
- Eliminar o documentar claramente los componentes y servicios no usados.
- Renombrar pantallas o menús que hoy prometen funcionalidad diaria inexistente.

### Conclusión operativa

Actualmente el sistema sí puede mostrar:

- progreso semanal,
- score semanal,
- sesiones semanales,
- y resúmenes agregados por semana.

Pero no puede mostrar correctamente:

- tiempos y sesiones semanales en el dashboard React cuando esos datos se derivan de `/progress`,
- ni estadísticas diarias reales,
- ni gráficas diarias reales.

En resumen:

- el problema de las gráficas no es una caída general de la integración,
- sino una mezcla de desalineación de contrato, funcionalidad diaria no implementada y datos de prueba con anomalías temporales.
