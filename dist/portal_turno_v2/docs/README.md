# 🏢 Portal de Turnos v2 — Documentación

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Arquitectura](#arquitectura)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [API REST — Referencia Completa](#api-rest--referencia-completa)
7. [Base de Datos](#base-de-datos)
8. [Frontend (SPA)](#frontend-spa)
9. [Autenticación JWT](#autenticación-jwt)
10. [Guía para Continuar el Desarrollo](#guía-para-continuar-el-desarrollo)
11. [Mejoras Sugeridas](#mejoras-sugeridas)

---

## Descripción del Proyecto

**Portal de Turnos v2** es una aplicación web para la gestión de turnos de vigilancia/seguridad. Permite a los administradores gestionar empleados, asignar horarios, y visualizar reportes. Los empleados pueden registrar su entrada/salida, llevar bitácora, reportar novedades y registrar puntos de recorrido.

### Características principales

| Módulo                   | Funcionalidad                                  |
| ------------------------ | ---------------------------------------------- |
| **Autenticación**        | Login con JWT, sesiones seguras sin cookies    |
| **Admin — Usuarios**     | CRUD completo con búsqueda y paginación        |
| **Admin — Horarios**     | Asignación de turnos por empleado y fecha      |
| **Admin — Turnos**       | Historial filtrable con vista de detalle       |
| **Admin — Reportes**     | Resumen por empleado con exportación CSV       |
| **Empleado — Dashboard** | Estado del turno, entrada/salida, estadísticas |
| **Empleado — Bitácora**  | Registro de actividades durante el turno       |
| **Empleado — Novedades** | Reporte de incidentes                          |
| **Empleado — Recorrido** | Puntos de control durante la ronda             |
| **Empleado — Horarios**  | Consulta de horarios asignados                 |

---

## Arquitectura

```
┌──────────────────────────────────────────────────┐
│                    FRONTEND                       │
│          HTML + CSS + JavaScript (SPA)            │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│    │  Login   │  │  Admin   │  │ Empleado │     │
│    │  Page    │  │  Module  │  │  Module  │     │
│    └──────────┘  └──────────┘  └──────────┘     │
│              │         │              │           │
│              └─────────┼──────────────┘           │
│                        │                          │
│                   api.js (HTTP Client)            │
│                   app.js (Utilidades)             │
└────────────────────────┼─────────────────────────┘
                         │ HTTP JSON (JWT)
┌────────────────────────┼─────────────────────────┐
│                    API REST                       │
│              api/index.php (Router)               │
│    ┌──────────────────────────────────────┐      │
│    │           core/Router.php             │      │
│    │           core/Auth.php (JWT)         │      │
│    │           core/Response.php           │      │
│    │           core/Validator.php          │      │
│    └──────────────────────────────────────┘      │
│    ┌──────────────────────────────────────┐      │
│    │         controllers/                  │      │
│    │  AuthController      UsuarioCtrl     │      │
│    │  HorarioController   TurnoCtrl       │      │
│    │  BitacoraController  NovedadCtrl     │      │
│    │  RecorridoController DashboardCtrl   │      │
│    │  ReporteController                   │      │
│    └──────────────────────────────────────┘      │
└────────────────────────┼─────────────────────────┘
                         │ PDO (MySQL)
┌────────────────────────┼─────────────────────────┐
│              BASE DE DATOS MySQL                  │
│         portal_turno (mismas tablas v1)           │
└──────────────────────────────────────────────────┘
```

### Patrón de diseño

- **Backend**: Arquitectura MVC simplificada (Router → Controller → Modelo implícito con PDO)
- **Frontend**: Single Page Application (SPA) con vanilla JavaScript
- **Comunicación**: API REST con respuestas JSON estandarizadas
- **Autenticación**: Token JWT (JSON Web Token) almacenado en localStorage

---

## Estructura de Archivos

```
portal_turno_v2/
│
├── index.html                    # Página de login
│
├── config/
│   ├── database.php              # Conexión PDO (Singleton)
│   └── app.php                   # Constantes de configuración
│
├── api/
│   ├── .htaccess                 # Rewrite rules para el Router
│   ├── index.php                 # Entry point: carga, rutas, despacho
│   │
│   ├── core/
│   │   ├── Auth.php              # Generación/validación JWT
│   │   ├── Response.php          # Respuestas JSON estandarizadas
│   │   ├── Router.php            # Enrutador con soporte regex y CORS
│   │   └── Validator.php         # Validador de datos de entrada
│   │
│   └── controllers/
│       ├── AuthController.php    # Login y perfil
│       ├── UsuarioController.php # CRUD usuarios
│       ├── HorarioController.php # CRUD horarios
│       ├── TurnoController.php   # Gestión de turnos
│       ├── BitacoraController.php
│       ├── NovedadController.php
│       ├── RecorridoController.php
│       ├── DashboardController.php
│       └── ReporteController.php
│
├── admin/
│   ├── dashboard.html            # Panel administrativo
│   ├── usuarios.html             # Gestión de usuarios
│   ├── horarios.html             # Gestión de horarios
│   ├── turnos.html               # Historial de turnos
│   └── reportes.html             # Reportes y estadísticas
│
├── empleado/
│   ├── dashboard.html            # Panel del empleado
│   ├── bitacora.html             # Registro de bitácora
│   ├── novedad.html              # Reporte de novedades
│   ├── recorrido.html            # Hoja de recorrido
│   └── horarios.html             # Mis horarios
│
├── assets/
│   ├── css/
│   │   └── styles.css            # Sistema de diseño completo (~1250 líneas)
│   └── js/
│       ├── api.js                # Cliente HTTP + wrappers de API
│       └── app.js                # Utilidades de UI (toast, confirm, etc.)
│
└── docs/
    └── README.md                 # Esta documentación
```

---

## Requisitos Previos

| Requisito | Versión mínima                    |
| --------- | --------------------------------- |
| PHP       | 7.4+                              |
| MySQL     | 5.7+                              |
| Apache    | 2.4+ con `mod_rewrite` habilitado |
| Navegador | Chrome/Firefox/Edge modernos      |

### Configuración de Apache

El archivo `api/.htaccess` necesita que `mod_rewrite` esté habilitado:

```bash
# Habilitar mod_rewrite en Ubuntu/Debian
sudo a2enmod rewrite
sudo systemctl restart apache2
```

En el `VirtualHost` o `httpd.conf`, asegúrate de tener:

```apache
<Directory "/ruta/portal_turno_v2">
    AllowOverride All
</Directory>
```

---

## Instalación y Configuración

### 1. Colocar archivos

Copia la carpeta `portal_turno_v2/` en el directorio de tu servidor web (ej: `/var/www/html/` o el `src/` de tu stack Docker).

### 2. Configurar base de datos

Edita `config/database.php` si necesitas cambiar credenciales:

```php
$host = getenv('DB_HOST') ?: 'db';        // Host MySQL
$dbname = getenv('DB_NAME') ?: 'portal_turno';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '14194118';
```

> 💡 **Tip**: En Docker, el host es el nombre del servicio (`db`). Fuera de Docker, usa `localhost`.

### 3. Configurar clave JWT

Edita `config/app.php` para cambiar la clave secreta JWT:

```php
define('JWT_SECRET', 'tu_clave_secreta_segura_aqui');
```

### 4. Verificar permisos

```bash
chmod -R 755 portal_turno_v2/
```

### 5. Acceder

Abre en tu navegador: `http://localhost/portal_turno_v2/`

---

## API REST — Referencia Completa

### Formato de respuesta estándar

Todas las respuestas siguen este formato:

```json
// Éxito
{
    "success": true,
    "data": { ... },
    "message": "Operación exitosa"
}

// Error
{
    "success": false,
    "message": "Descripción del error"
}
```

### Headers requeridos

```
Content-Type: application/json
Authorization: Bearer <token_jwt>
```

### Endpoints

#### 🔐 Autenticación

| Método | Ruta              | Descripción           | Auth |
| ------ | ----------------- | --------------------- | ---- |
| `POST` | `/api/auth/login` | Iniciar sesión        | No   |
| `GET`  | `/api/auth/me`    | Obtener perfil actual | Sí   |

**POST /api/auth/login**

```json
// Request
{ "usuario": "admin", "password": "123456" }

// Response
{
    "success": true,
    "data": {
        "token": "eyJ0eXAi...",
        "user": { "id": 1, "nombre": "Admin", "rol": "admin" }
    }
}
```

#### 👥 Usuarios (solo admin)

| Método   | Ruta                                | Descripción           |
| -------- | ----------------------------------- | --------------------- |
| `GET`    | `/api/usuarios?page=1&search=texto` | Listar con paginación |
| `GET`    | `/api/usuarios/{id}`                | Obtener uno           |
| `POST`   | `/api/usuarios`                     | Crear                 |
| `PUT`    | `/api/usuarios/{id}`                | Actualizar            |
| `DELETE` | `/api/usuarios/{id}`                | Eliminar              |

**POST /api/usuarios**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "usuario": "jperez",
  "email": "juan@empresa.com",
  "password": "123456",
  "rol": "empleado"
}
```

#### 📅 Horarios (admin)

| Método   | Ruta                 | Descripción             |
| -------- | -------------------- | ----------------------- |
| `GET`    | `/api/horarios`      | Listar todos            |
| `GET`    | `/api/horarios/{id}` | Obtener uno             |
| `POST`   | `/api/horarios`      | Crear                   |
| `PUT`    | `/api/horarios/{id}` | Actualizar              |
| `DELETE` | `/api/horarios/{id}` | Eliminar                |
| `GET`    | `/api/mis-horarios`  | Mis horarios (empleado) |

**POST /api/horarios**

```json
{
  "usuario_id": 3,
  "fecha": "2024-01-15",
  "hora_entrada": "08:00",
  "hora_salida": "16:00"
}
```

#### 🕐 Turnos

| Método | Ruta                                                              | Descripción                                        |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------- |
| `GET`  | `/api/turnos?page=1&usuario_id=3&fecha_desde=...&fecha_hasta=...` | Listar con filtros                                 |
| `GET`  | `/api/turnos/{id}`                                                | Detalle (incluye novedades, bitácoras, recorridos) |
| `POST` | `/api/turnos/entrada`                                             | Registrar entrada                                  |
| `POST` | `/api/turnos/salida`                                              | Registrar salida                                   |

#### 📝 Bitácoras, ⚠️ Novedades, 🗺️ Recorridos

| Método | Ruta              | Descripción                                      |
| ------ | ----------------- | ------------------------------------------------ |
| `GET`  | `/api/bitacoras`  | Listar (admin=todas, empleado=propias)           |
| `POST` | `/api/bitacoras`  | Crear `{ "descripcion": "..." }`                 |
| `GET`  | `/api/novedades`  | Listar                                           |
| `POST` | `/api/novedades`  | Crear `{ "descripcion": "..." }`                 |
| `GET`  | `/api/recorridos` | Listar                                           |
| `POST` | `/api/recorridos` | Crear `{ "punto": "...", "observacion": "..." }` |

#### 📊 Dashboard y Reportes

| Método | Ruta                                                    | Descripción           |
| ------ | ------------------------------------------------------- | --------------------- |
| `GET`  | `/api/dashboard/admin`                                  | Estadísticas admin    |
| `GET`  | `/api/dashboard/empleado`                               | Estadísticas empleado |
| `GET`  | `/api/reportes/resumen?fecha_desde=...&fecha_hasta=...` | Reporte por empleado  |

---

## Base de Datos

La aplicación usa la **misma base de datos** que la v1 (`portal_turno`). No se requieren migraciones.

### Tablas principales

| Tabla            | Descripción                              |
| ---------------- | ---------------------------------------- |
| `usuarios`       | Usuarios del sistema (admin y empleados) |
| `horarios`       | Horarios asignados a empleados           |
| `turnos`         | Registro de entrada/salida               |
| `bitacoras`      | Actividades registradas por turno        |
| `novedades`      | Incidentes reportados                    |
| `hoja_recorrido` | Puntos de control de ronda               |
| `reportes`       | Tabla auxiliar de reportes               |

### Diagrama de relaciones

```
usuarios (1) ──── (N) horarios
usuarios (1) ──── (N) turnos
turnos   (1) ──── (N) bitacoras
turnos   (1) ──── (N) novedades
turnos   (1) ──── (N) hoja_recorrido
```

---

## Frontend (SPA)

### Diseño visual — Estilo Banca Profesional

El frontend utiliza un diseño institucional inspirado en la banca centroamericana (Banco Agrícola), con una paleta de verdes profesionales y tipografía **Inter** de Google Fonts. Los íconos son **Material Symbols Outlined** de Google.

#### Paleta de colores

| Variable          | Valor     | Uso                                 |
| ----------------- | --------- | ----------------------------------- |
| `--primary`       | `#00723f` | Color principal verde institucional |
| `--primary-dark`  | `#004d2b` | Navbar, acentos oscuros             |
| `--primary-light` | `#4caf50` | Detalles, degradados                |
| `--primary-bg`    | `#e8f5e9` | Fondos suaves verdes                |
| `--success`       | `#059669` | Éxito                               |
| `--danger`        | `#dc2626` | Errores, eliminación                |
| `--warning`       | `#d97706` | Advertencias                        |
| `--info`          | `#0284c7` | Información                         |

#### Tipografía e íconos

```html
<!-- Google Fonts — incluir en cada página -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  rel="stylesheet"
/>
```

Ejemplo de uso de ícono:

```html
<span class="material-symbols-outlined">dashboard</span>
<span class="material-symbols-outlined">schedule</span>
```

#### Responsive Design

El diseño es completamente responsive con tres breakpoints principales:

| Breakpoint | Comportamiento                                        |
| ---------- | ----------------------------------------------------- |
| `> 1024px` | Desktop: sidebar fija lateral, navbar completa        |
| `≤ 1024px` | Tablet: sidebar oculta con botón hamburguesa, overlay |
| `≤ 768px`  | Móvil: elementos apilados, nombre de usuario oculto   |
| `≤ 480px`  | Móvil pequeño: estadísticas en una columna            |

La sidebar en móvil se controla con el botón hamburguesa (☰):

- Se abre/cierra con animación deslizante (`left: -280px` → `left: 0`)
- Un overlay oscuro cubre el contenido al abrir
- Se puede cerrar con: click en overlay, click en link, tecla `Escape`, o redimensionar a desktop

### Sistema de diseño (CSS Custom Properties)

| Clase                                                    | Descripción                                           |
| -------------------------------------------------------- | ----------------------------------------------------- |
| `.navbar`, `.nav-brand`, `.nav-user`, `.nav-hamburger`   | Navbar verde institucional con hamburguesa responsive |
| `.sidebar`, `.sidebar-link`, `.sidebar-overlay`          | Sidebar con navegación y overlay móvil                |
| `.btn`, `.btn-primary`, `.btn-danger`, `.btn-outline`    | Botones con gradientes                                |
| `.card`, `.card-header`, `.card-title`                   | Tarjetas con borde y sombra                           |
| `.stat-card`, `.stat-icon-primary`, `.stat-icon-success` | Tarjetas de estadísticas con colores por tipo         |
| `.badge`, `.badge-primary`, `.badge-success`             | Etiquetas de estado (píldora)                         |
| `.form-group`, `.form-input`, `.form-select`             | Formularios con focus verde                           |
| `.table-wrapper`, `table`                                | Tablas con scroll horizontal en móvil                 |
| `.modal-backdrop`, `.modal`                              | Modales de detalle                                    |
| `.modal-overlay`, `.modal-box`                           | Modal de confirmación                                 |
| `.toolbar`, `.search-box`                                | Barra de herramientas con búsqueda                    |
| `.detail-grid`, `.detail-list`, `.detail-list-item`      | Secciones de detalle                                  |
| `.empty-state`                                           | Estado vacío con ícono                                |
| `.toast`, `.toast-success`, `.toast-error`               | Notificaciones emergentes                             |
| `.loading`, `.spinner`                                   | Indicador de carga                                    |
| `.pagination`, `.page-btn`                               | Paginación                                            |

### JavaScript — api.js

Objetos disponibles para consumir la API:

```javascript
// Autenticación
Auth.login(usuario, password);
Auth.me();
Auth.logout();

// Usuarios
Usuarios.list(page, search, limit);
Usuarios.get(id);
Usuarios.create(data);
Usuarios.update(id, data);
Usuarios.delete(id);

// Horarios
Horarios.list(page, search);
Horarios.get(id);
Horarios.create(data);
Horarios.update(id, data);
Horarios.delete(id);
Horarios.misHorarios();

// Turnos
Turnos.list(page, filtros);
Turnos.get(id);
Turnos.registrarEntrada();
Turnos.registrarSalida();

// Bitácoras, Novedades, Recorridos
Bitacoras.list();
Bitacoras.create({ descripcion });
Novedades.list();
Novedades.create({ descripcion });
Recorridos.list();
Recorridos.create({ punto, observacion });

// Dashboard y Reportes
Dashboard.admin();
Dashboard.empleado();
Reportes.resumen({ fecha_desde, fecha_hasta });
```

### JavaScript — app.js

Utilidades disponibles:

```javascript
showToast(message, type); // Notificación: 'success', 'error', 'warning', 'info'
showConfirm(message, onOk); // Confirmación con callback
formatDate(dateStr); // "2024-01-15" → "15/01/2024"
formatTime(timeStr); // "08:30:00" → "08:30"
formatDateTime(dtStr); // Combinado fecha + hora
showLoading(selector); // Spinner de carga en un contenedor
requireAuth(role); // Verifica sesión y rol, redirige si no válida
initHeader(user); // Inicializa navbar con datos del usuario + hamburguesa
initMobileSidebar(); // Configura toggle de sidebar con overlay (llamado por initHeader)
renderPagination(pagination); // Genera HTML de paginación con Material Symbols
```

#### Manejo seguro de respuestas API

El cliente HTTP (`api.js`) realiza las siguientes validaciones:

1. **Verifica autenticación** (status 401) **antes** de parsear el body JSON
2. **Parsea body de forma segura**: usa `response.text()` + `JSON.parse()` para evitar errores con respuestas vacías
3. **Captura errores de sintaxis JSON**: si el servidor devuelve contenido no-JSON, genera un mensaje amigable
4. **Maneja errores de red**: desconexiones o servidor no disponible

---

## Autenticación JWT

### Flujo

1. **Login**: El frontend envía `usuario` y `password` al endpoint `/api/auth/login`
2. **Token**: El servidor valida credenciales y genera un token JWT (válido 8 horas)
3. **Almacenamiento**: El token se guarda en `localStorage`
4. **Peticiones**: Cada petición HTTP incluye el header `Authorization: Bearer <token>`
5. **Validación**: El servidor verifica el token en cada petición protegida
6. **Expiración**: Si el token expira, se redirige al login automáticamente

### Estructura del Token

```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "user_id": 1, "usuario": "admin", "rol": "admin", "iat": ..., "exp": ... }
```

### Middleware de autorización

```php
// Requiere autenticación (cualquier usuario)
Auth::requireAuth();

// Solo administradores
Auth::requireAdmin();

// Solo empleados
Auth::requireEmpleado();
```

---

## Guía para Continuar el Desarrollo

### Cómo agregar un nuevo endpoint

**1. Crear el controlador** (si no existe):

```php
// api/controllers/MiController.php
<?php

class MiController {
    public static function miMetodo() {
        $db = Database::getConnection();
        // Tu lógica aquí...
        Response::success($data);
    }
}
```

**2. Registrar la ruta** en `api/index.php`:

```php
$router->get('/mi-ruta', 'MiController@miMetodo');
$router->post('/mi-ruta', 'MiController@crearAlgo');
```

**3. Agregar al cliente JS** en `assets/js/api.js`:

```javascript
const MiModulo = {
  list: () => api.get("/mi-ruta"),
  create: (data) => api.post("/mi-ruta", data),
};
```

### Cómo agregar una nueva página

1. Crea el archivo HTML en `admin/` o `empleado/`
2. Usa la misma estructura (navbar, sidebar, main-content)
3. Incluye `api.js` y `app.js`
4. Llama a `requireAuth('admin')` o `requireAuth('empleado')` al inicio

### Convenciones de código

- **PHP**: PascalCase para clases, camelCase para métodos
- **JavaScript**: camelCase para funciones y variables
- **CSS**: BEM-like con guiones (`.card-header`, `.stat-icon`)
- **API**: kebab-case para rutas (`/mis-horarios`)
- **Respuestas**: Siempre incluir `success`, `data`, y `message`

---

## Mejoras Sugeridas

### Seguridad

- [ ] Implementar rate limiting para prevenir ataques de fuerza bruta
- [ ] Agregar CSRF tokens para formularios críticos
- [ ] Hashear contraseñas con `password_hash()` (bcrypt) — _ya implementado en el controller_
- [ ] Validar y sanitizar todas las entradas del usuario
- [ ] Agregar HTTPS obligatorio en producción
- [ ] Implementar refresh tokens para renovar JWT sin re-login

### Funcionalidad

- [ ] Notificaciones en tiempo real (WebSockets o Server-Sent Events)
- [ ] Exportación a PDF de reportes
- [ ] Geolocalización en registro de recorridos
- [ ] Sistema de notificaciones por email
- [ ] Gráficas interactivas en el dashboard (Chart.js o ApexCharts)
- [ ] Modo offline con Service Workers
- [ ] Registro de auditoría (quién hizo qué cambio)
- [ ] Filtros avanzados con selección de rango de fechas

### UX/UI

- [x] Diseño estilo banca profesional con paleta verde institucional
- [x] Sidebar responsive con hamburguesa y overlay
- [x] Material Symbols Outlined en toda la aplicación
- [x] Accesibilidad: tecla Escape cierra sidebar, aria-expanded
- [ ] Tema oscuro (usar las CSS variables — solo cambiar `:root`)
- [ ] Transiciones y animaciones más elaboradas (skeleton loading)
- [ ] Vista de calendario para horarios (drag-and-drop)
- [ ] Dashboard con gráficos estadísticos
- [ ] PWA (Progressive Web App) para uso mobile
- [ ] Breadcrumbs de navegación en páginas internas
- [ ] Foto de perfil en avatar del navbar

### DevOps

- [ ] Tests unitarios con PHPUnit
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker Compose dedicado para v2
- [ ] Documentación de API con Swagger/OpenAPI
- [ ] Logs centralizados
- [ ] Variables de entorno con archivo `.env`

---

## Diferencias con la v1

| Aspecto               | v1 (Original)                         | v2 (Profesional)                                   |
| --------------------- | ------------------------------------- | -------------------------------------------------- |
| **Arquitectura**      | PHP monolítico (HTML + PHP mezclado)  | API REST + SPA separados                           |
| **Base de datos**     | `mysqli` con concatenación de strings | `PDO` con prepared statements                      |
| **Autenticación**     | Sesiones PHP (`$_SESSION`)            | JSON Web Tokens (JWT)                              |
| **Frontend**          | Páginas PHP renderizadas en servidor  | SPA con JavaScript vanilla                         |
| **Diseño**            | Bootstrap básico                      | CSS profesional estilo banca (verde institucional) |
| **Íconos**            | Emojis o FontAwesome                  | Material Symbols Outlined (Google)                 |
| **Tipografía**        | Bootstrap default                     | Inter (Google Fonts)                               |
| **Responsive**        | Básico con Bootstrap grid             | Completo con sidebar hamburguesa, 4 breakpoints    |
| **Seguridad**         | Vulnerable a SQL injection            | Prepared statements, validación                    |
| **Código**            | Procedural, sin separación            | Controladores, Router, Validator                   |
| **API**               | No existe                             | REST completa con 20+ endpoints                    |
| **Manejo de errores** | `alert()` básico                      | Toast notifications, JSON seguro                   |

---

## Historial de cambios

### v2.1 — Correcciones y mejoras

- **Fix**: Error "Unexpected end of JSON input" — se corrigió `apiRequest()` en `api.js` para parsear JSON de forma segura
- **Fix**: El chequeo de autenticación (401) ahora se ejecuta **antes** de parsear el body
- **Fix**: Ícono de hamburguesa ahora se muestra correctamente en blanco sobre navbar verde
- **Fix**: Clases de colores para tarjetas de estadísticas (`stat-icon-primary`, etc.)
- **Mejora**: Sidebar móvil se cierra con tecla `Escape` y al redimensionar a desktop
- **Mejora**: Atributo `aria-expanded` en botón hamburguesa para accesibilidad
- **Mejora**: Todos los Material Symbols en navbar heredan color blanco correctamente
- **Mejora**: Overlay de sidebar con `backdrop-filter` y `-webkit-backdrop-filter`

### v2.0 — Rediseño completo

- Migración a estilo visual Banca Profesional (paleta verde institucional)
- Login tipo Banco Agrícola con split-screen
- Todas las páginas internas con Material Symbols Outlined
- Sidebar con secciones etiquetadas y links activos con indicador lateral
- Sistema responsive completo con 4 breakpoints
- Navbar con degradado verde y datos de usuario

---

## Créditos

Desarrollado como proyecto académico.  
Tecnologías: PHP 7.4+, MySQL, HTML5, CSS3, JavaScript ES6+.

---

_Documentación generada para Portal de Turnos v2.1_
