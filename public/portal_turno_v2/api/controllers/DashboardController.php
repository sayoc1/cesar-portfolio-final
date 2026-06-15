<?php
/**
 * DashboardController - VERSIÓN DEFINITIVA CORREGIDA
 */
class DashboardController {
    
    /**
     * GET /api/dashboard/empleado
     */
    public function empleado(): void {
        try {
            $user = Auth::requireEmpleado();
            $userId = $user['sub'];
            $db = getDB();
            
            // ============================================
            // 1. TURNO DE HOY (SOLO HOY)
            // ============================================
            $stmt = $db->prepare("
                SELECT 
                    id, 
                    hora_entrada, 
                    hora_salida,
                    DATE(hora_entrada) as fecha
                FROM turnos
                WHERE id_usuario = ? 
                AND DATE(hora_entrada) = CURDATE()
                ORDER BY id DESC 
                LIMIT 1
            ");
            $stmt->execute([$userId]);
            $turnoHoy = $stmt->fetch();
            
            // ============================================
            // 2. TURNOS DEL MES
            // ============================================
            $stmt = $db->prepare("
                SELECT COUNT(*) FROM turnos
                WHERE id_usuario = ? 
                AND MONTH(hora_entrada) = MONTH(CURDATE()) 
                AND YEAR(hora_entrada) = YEAR(CURDATE())
            ");
            $stmt->execute([$userId]);
            $turnosMes = $stmt->fetchColumn();
            
            // ============================================
            // 3. BITÁCORAS DEL MES
            // ============================================
            $bitacorasMes = 0;
            try {
                $stmt = $db->prepare("
                    SELECT COUNT(*) FROM bitacoras
                    WHERE id_usuario = ? 
                    AND MONTH(fecha) = MONTH(CURDATE())
                ");
                $stmt->execute([$userId]);
                $bitacorasMes = $stmt->fetchColumn();
            } catch (Exception $e) {
                $bitacorasMes = 0;
            }
            
            // ============================================
            // 4. NOVEDADES DEL MES
            // ============================================
            $novedadesMes = 0;
            try {
                $stmt = $db->prepare("
                    SELECT COUNT(*) FROM novedades
                    WHERE id_usuario = ? 
                    AND MONTH(fecha) = MONTH(CURDATE())
                ");
                $stmt->execute([$userId]);
                $novedadesMes = $stmt->fetchColumn();
            } catch (Exception $e) {
                $novedadesMes = 0;
            }
            
            // ============================================
            // 5. RECORRIDOS DEL MES
            // ============================================
            $recorridosMes = 0;
            try {
                $stmt = $db->prepare("
                    SELECT COUNT(*) FROM hojas_recorrido
                    WHERE id_usuario = ? 
                    AND MONTH(fecha) = MONTH(CURDATE())
                ");
                $stmt->execute([$userId]);
                $recorridosMes = $stmt->fetchColumn();
            } catch (Exception $e) {
                $recorridosMes = 0;
            }
            
            // ============================================
            // 6. PRÓXIMO HORARIO
            // ============================================
            $proximoHorario = null;
            try {
                $stmt = $db->prepare("
                    SELECT fecha, hora_inicio, hora_fin 
                    FROM horarios
                    WHERE id_usuario = ? 
                    AND fecha >= CURDATE()
                    ORDER BY fecha ASC, hora_inicio ASC 
                    LIMIT 1
                ");
                $stmt->execute([$userId]);
                $proximoHorario = $stmt->fetch();
                
                if (!$proximoHorario) {
                    $stmt = $db->prepare("
                        SELECT fecha, hora_inicio, hora_fin 
                        FROM horarios
                        WHERE id_usuario = ? 
                        ORDER BY fecha DESC 
                        LIMIT 1
                    ");
                    $stmt->execute([$userId]);
                    $proximoHorario = $stmt->fetch();
                }
            } catch (Exception $e) {
                error_log("Error al obtener próximo horario: " . $e->getMessage());
                $proximoHorario = null;
            }
            
            // ============================================
            // 7. RESPUESTA
            // ============================================
            $respuesta = [
                'turno_hoy'       => $turnoHoy ?: null,
                'turnos_mes'      => (int)$turnosMes,
                'bitacoras_mes'   => (int)$bitacorasMes,
                'novedades_mes'   => (int)$novedadesMes,
                'recorridos_mes'  => (int)$recorridosMes,
                'proximo_horario' => $proximoHorario ?: null,
                'tiene_entrada'   => $turnoHoy && !$turnoHoy['hora_salida'] ? true : false,
                'tiene_salida'    => $turnoHoy && $turnoHoy['hora_salida'] ? true : false,
                'fecha_actual'    => date('Y-m-d'),
                'hora_actual'     => date('H:i'),
            ];
            
            Response::success($respuesta);
            
        } catch (Exception $e) {
            error_log("ERROR en dashboard empleado: " . $e->getMessage());
            Response::error('Error al cargar dashboard: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /api/dashboard/admin
     */
    public function admin(): void {
        try {
            Auth::requireAdmin();
            $db = getDB();
            
            $totalEmpleados = $db->query("SELECT COUNT(*) FROM usuarios WHERE rol = 'empleado'")->fetchColumn();
            
            $turnosActivos = $db->query("
                SELECT COUNT(*) FROM turnos 
                WHERE DATE(hora_entrada) = CURDATE() 
                AND hora_salida IS NULL
            ")->fetchColumn();
            
            $turnosCompletados = $db->query("
                SELECT COUNT(*) FROM turnos 
                WHERE DATE(hora_entrada) = CURDATE() 
                AND hora_salida IS NOT NULL
            ")->fetchColumn();
            
            $novedadesHoy = $db->query("
                SELECT COUNT(*) FROM novedades 
                WHERE DATE(fecha) = CURDATE()
            ")->fetchColumn();
            
            $ultimosTurnos = $db->query("
                SELECT 
                    t.id, 
                    t.hora_entrada, 
                    t.hora_salida, 
                    DATE(t.hora_entrada) as fecha, 
                    u.nombre, 
                    u.apellido
                FROM turnos t
                INNER JOIN usuarios u ON t.id_usuario = u.id
                ORDER BY t.hora_entrada DESC
                LIMIT 5
            ")->fetchAll();
            
            Response::success([
                'total_empleados'    => (int)$totalEmpleados,
                'turnos_activos'     => (int)$turnosActivos,
                'turnos_completados' => (int)$turnosCompletados,
                'novedades_hoy'      => (int)$novedadesHoy,
                'ultimos_turnos'     => $ultimosTurnos
            ]);
            
        } catch (Exception $e) {
            error_log("ERROR en admin dashboard: " . $e->getMessage());
            Response::error('Error en admin dashboard', 500);
        }
    }
}