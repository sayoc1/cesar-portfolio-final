<?php
/**
 * ReporteController - Reportes y estadísticas
 */
class ReporteController {
    
    /**
     * GET /api/reportes/resumen
     * Resumen general para reportes con filtro de fechas
     */
    public function resumen(): void {
        Auth::requireAdmin();
        $db = getDB();
        
        // Obtener filtros de fecha
        $fecha_desde = $_GET['fecha_desde'] ?? date('Y-m-01');
        $fecha_hasta = $_GET['fecha_hasta'] ?? date('Y-m-d');
        
        // Validar fechas
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_desde) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_hasta)) {
            Response::error('Formato de fecha inválido. Use YYYY-MM-DD', 400);
        }
        
        // Obtener todos los empleados
        $empleados = $db->query("
            SELECT id, nombre, apellido 
            FROM usuarios 
            WHERE rol = 'empleado'
            ORDER BY nombre
        ")->fetchAll();
        
        $resultado = [];
        
        foreach ($empleados as $emp) {
            // Turnos en el rango
            $stmt = $db->prepare("
                SELECT COUNT(*) as total_turnos,
                       SUM(TIME_TO_SEC(TIMEDIFF(hora_salida, hora_entrada)))/3600 as total_horas
                FROM turnos 
                WHERE id_usuario = ? 
                AND DATE(hora_entrada) BETWEEN ? AND ?
                AND hora_salida IS NOT NULL
            ");
            $stmt->execute([$emp['id'], $fecha_desde, $fecha_hasta]);
            $turnos = $stmt->fetch();
            
            // Novedades en el rango
            $stmt = $db->prepare("
                SELECT COUNT(*) as total_novedades
                FROM novedades 
                WHERE id_usuario = ? 
                AND DATE(fecha) BETWEEN ? AND ?
            ");
            $stmt->execute([$emp['id'], $fecha_desde, $fecha_hasta]);
            $novedades = $stmt->fetch();
            
            // Bitácoras en el rango
            $stmt = $db->prepare("
                SELECT COUNT(*) as total_bitacoras
                FROM bitacoras 
                WHERE id_usuario = ? 
                AND DATE(fecha) BETWEEN ? AND ?
            ");
            $stmt->execute([$emp['id'], $fecha_desde, $fecha_hasta]);
            $bitacoras = $stmt->fetch();
            
            // RECORRIDOS - CORREGIDO: usar hojas_recorrido (plural)
            $stmt = $db->prepare("
                SELECT COUNT(*) as total_recorridos
                FROM hojas_recorrido 
                WHERE id_usuario = ? 
                AND DATE(fecha) BETWEEN ? AND ?
            ");
            $stmt->execute([$emp['id'], $fecha_desde, $fecha_hasta]);
            $recorridos = $stmt->fetch();
            
            $resultado[] = [
                'nombre' => $emp['nombre'],
                'apellido' => $emp['apellido'],
                'total_turnos' => (int)($turnos['total_turnos'] ?? 0),
                'total_horas' => round($turnos['total_horas'] ?? 0, 1),
                'total_novedades' => (int)($novedades['total_novedades'] ?? 0),
                'total_bitacoras' => (int)($bitacoras['total_bitacoras'] ?? 0),
                'total_recorridos' => (int)($recorridos['total_recorridos'] ?? 0)
            ];
        }
        
        Response::success($resultado);
    }
}