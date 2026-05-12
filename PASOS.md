# Cómo arrancar el proyecto

## Requisitos previos

- Java 21
- MySQL corriendo en localhost:3306
- Node.js y npm
- Archivo `.env` en la raíz del proyecto con:
  ```
  DB_PASSWORD=tu_contraseña_mysql
  ```

## Paso 1 — Backend

```powershell
cd physiotrack
.\mvnw.cmd spring-boot:run
```

El servidor arranca en `http://localhost:9090`.  
Al iniciar por primera vez crea la base de datos y carga los datos de prueba automáticamente.

**Credenciales de prueba:**
- Email: `fisio@physiotrack.es`
- Contraseña: `password123`

> Si ya hay algo en el puerto 9090 de un arranque anterior, mátalo primero:
> ```powershell
> $pid9090 = (Get-NetTCPConnection -LocalPort 9090).OwningProcess
> Stop-Process -Id $pid9090 -Force
> ```

## Paso 2 — Frontend estático (login + pacientes)

```powershell
cd "frontend base"
npx serve . --listen 3000
```

Abre `http://localhost:3000` en el navegador.

## Paso 3 — App React (gráficas)

```powershell
cd "gráfica\proyecto prácticas"
npm install       # solo la primera vez
npm run dev
```

La app React arranca en `http://localhost:5173`.  
Se abre automáticamente desde el frontend estático al seleccionar un paciente.

---

## Resumen de puertos

| Servicio | Puerto |
|---|---|
| Backend API | 9090 |
| Frontend estático | 3000 |
| App React (dev) | 5173 |
