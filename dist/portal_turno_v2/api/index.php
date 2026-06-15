<?php
// ============================================
// TEMPORAL: Mostrar todos los errores
// ============================================
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/**
 * API REST - Punto de entrada principal
 * 
 * Todas las peticiones a /portal_turno_v2/api/ llegan aquí
 * gracias al .htaccess y se enrutan al controlador correspondiente.
 * 
 * Arquitectura:
 * - index.php (este archivo): Configura y ejecuta el router
 * - core/: Clases base (Router, Auth, Response, Validator)
 * - controllers/: Lógica de cada endpoint
 */

// ============================================
// 1. CONFIGURACIÓN INICIAL
// ============================================
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores al usuario en producción

// Headers CORS para permitir peticiones desde JavaScript
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// ============================================
// 2. CARGAR ARCHIVOS
// ============================================
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/core/Response.php';
require_once __DIR__ . '/core/Auth.php';
require_once __DIR__ . '/core/Router.php';
require_once __DIR__ . '/core/Validator.php';

// ============================================
// 3. DEFINIR RUTAS
// ============================================
$router = new Router('/portal_turno_v2/api');

// --- Autenticación ---
$router->post('/auth/login',           'AuthController@login');
$router->get('/auth/me',               'AuthController@me');

// --- Usuarios (admin) ---
$router->get('/usuarios',              'UsuarioController@index');
$router->get('/usuarios/{id}',         'UsuarioController@show');
$router->post('/usuarios',             'UsuarioController@store');
$router->put('/usuarios/{id}',         'UsuarioController@update');
$router->delete('/usuarios/{id}',      'UsuarioController@destroy');

// --- Horarios (admin) ---
$router->get('/horarios',              'HorarioController@index');
$router->post('/horarios',             'HorarioController@store');
$router->put('/horarios/{id}',         'HorarioController@update');
$router->delete('/horarios/{id}',      'HorarioController@destroy');
$router->get('/horarios/{id}',         'HorarioController@show');

// --- Turnos ---
$router->get('/turnos',                'TurnoController@index');
$router->get('/turnos/{id}',           'TurnoController@show');
$router->post('/turnos/entrada',       'TurnoController@registrarEntrada');
$router->post('/turnos/salida',        'TurnoController@registrarSalida');
$router->get('/mis-turnos-completados', 'TurnoController@misTurnosCompletados'); // ← NUEVA RUTA

// --- Bitácoras (empleado) ---
$router->get('/bitacoras',             'BitacoraController@index');
$router->post('/bitacoras',            'BitacoraController@store');

// --- Novedades (empleado) ---
$router->get('/novedades',             'NovedadController@index');
$router->post('/novedades',            'NovedadController@store');

// --- Hoja de recorrido (empleado) ---
$router->get('/recorridos',            'RecorridoController@index');
$router->post('/recorridos',           'RecorridoController@store');

// --- Reportes (admin) ---
$router->get('/reportes/resumen',      'ReporteController@resumen');

// --- Dashboard stats ---
$router->get('/dashboard/admin',       'DashboardController@admin');
$router->get('/dashboard/empleado',    'DashboardController@empleado');

// --- Mis horarios (empleado) ---
$router->get('/mis-horarios',          'HorarioController@misHorarios');

// ============================================
// 4. EJECUTAR ROUTER
// ============================================
$router->run();
