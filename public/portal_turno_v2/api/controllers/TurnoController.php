<?php
/**
 * TurnoController - Control de Asistencia
 * 
 * Endpoints:
 * - GET  /api/turnos             → Historial (admin)
 * - GET  /api/turnos/{id}        → Detalle de un turno (admin)
 * - POST /api/turnos/entrada     → Registrar entrada (empleado)
 * - POST /api/turnos/salida      → Registrar salida (empleado)
 * - GET  /api/mis-turnos-completados → Turnos completados del empleado
 */
class TurnoController {
    
    /**
     * GET /api/turnos
     * Historial completo de turnos (admin) - CORREGIDO
     */
    public function index(): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $page = max(1, intval($_GET['page'] ?? 1));
        $perPage = intval($_GET['per_page'] ?? DEFAULT_PER_PAGE);
        $offset = ($page - 1) * $perPage;
        
        // Filtros opcionales
        $where = '1=1';
        $params = [];
        
        // CORREGIDO: Usar 'empleado' como parámetro
        if (!empty($_GET['empleado'])) {
            $where .= ' AND t.id_usuario = ?';
            $params[] = $_GET['empleado'];
        }
        
        if (!empty($_GET['fecha_desde'])) {
            $where .= ' AND DATE(t.hora_entrada) >= ?';
            $params[] = $_GET['fecha_desde'];
        }
        
        if (!empty($_GET['fecha_hasta'])) {
            $where .= ' AND DATE(t.hora_entrada) <= ?';
            $params[] = $_GET['fecha_hasta'];
        }
        
        // Contar total de registros con filtros
        $countStmt = $db->prepare("
            SELECT COUNT(*) FROM turnos t
            INNER JOIN usuarios u ON t.id_usuario = u.id
            WHERE $where
        ");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();
        
        // Seleccionar turnos con los filtros aplicados
        $stmt = $db->prepare("
            SELECT 
                t.*, 
                u.nombre, 
                u.apellido, 
                DATE(t.hora_entrada) as fecha
            FROM turnos t
            INNER JOIN usuarios u ON t.id_usuario = u.id
            WHERE $where
            ORDER BY t.hora_entrada DESC
            LIMIT $perPage OFFSET $offset
        ");
        $stmt->execute($params);
        
        $turnos = $stmt->fetchAll();
        
        Response::success([
            'turnos' => $turnos,
            'pagination' => [
                'total'    => (int)$total,
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => ceil($total / $perPage)
            ]
        ]);
    }
    
    /**
     * GET /api/turnos/{id}
     * Detalle de un turno con novedades, bitácoras y recorridos
     */
    public function show(array $params): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $id = $params['id'];
        
        // Datos del turno
        $stmt = $db->prepare("
            SELECT t.*, u.nombre, u.apellido, DATE(t.hora_entrada) as fecha
            FROM turnos t
            INNER JOIN usuarios u ON t.id_usuario = u.id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);
        $turno = $stmt->fetch();
        
        if (!$turno) {
            Response::notFound('Turno no encontrado');
        }
        
        // Novedades del turno
        $stmt = $db->prepare('SELECT * FROM novedades WHERE id_turno = ? ORDER BY fecha DESC');
        $stmt->execute([$id]);
        $novedades = $stmt->fetchAll();
        
        // Bitácoras del turno
        $stmt = $db->prepare('SELECT * FROM bitacoras WHERE id_turno = ? ORDER BY fecha DESC');
        $stmt->execute([$id]);
        $bitacoras = $stmt->fetchAll();
        
        // Recorridos del turno
        $stmt = $db->prepare('SELECT * FROM hojas_recorrido WHERE id_turno = ? ORDER BY fecha DESC');
        $stmt->execute([$id]);
        $recorridos = $stmt->fetchAll();
        
        Response::success([
            'turno'      => $turno,
            'novedades'  => $novedades,
            'bitacoras'  => $bitacoras,
            'recorridos' => $recorridos
        ]);
    }
    
    /**
     * POST /api/turnos/entrada
     * Registra la entrada del empleado
     */
    public function registrarEntrada(): void {
        $user = Auth::requireEmpleado();
        $userId = $user['sub'];
        
        $db = getDB();
        
        // Verificar si ya tiene un turno activo (sin salida)
        $stmt = $db->prepare("
            SELECT id FROM turnos 
            WHERE id_usuario = ? AND hora_salida IS NULL
        ");
        $stmt->execute([$userId]);
        
        if ($stmt->fetch()) {
            Response::error('Ya tienes un turno activo. Finalízalo antes de registrar una nueva entrada.', 409);
        }
        
        // Registrar entrada con la fecha y hora actual
        $stmt = $db->prepare('INSERT INTO turnos (id_usuario, hora_entrada) VALUES (?, NOW())');
        $stmt->execute([$userId]);
        
        Response::success([
            'id' => (int)$db->lastInsertId()
        ], 'Entrada registrada correctamente', 201);
    }
    
    /**
     * POST /api/turnos/salida
     * Registra la salida del empleado
     */
    public function registrarSalida(): void {
        $user = Auth::requireEmpleado();
        $userId = $user['sub'];
        
        $db = getDB();
        
        // Buscar turno activo (sin hora de salida)
        $stmt = $db->prepare("
            SELECT id, hora_entrada, hora_salida 
            FROM turnos
            WHERE id_usuario = ? AND hora_salida IS NULL
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$userId]);
        $turno = $stmt->fetch();
        
        if (!$turno) {
            Response::error('No tienes un turno activo.', 409);
        }
        
        // Registrar salida con la fecha y hora actual
        $stmt = $db->prepare('UPDATE turnos SET hora_salida = NOW() WHERE id = ?');
        $stmt->execute([$turno['id']]);
        
        Response::success(null, 'Salida registrada correctamente');
    }
    
    /**
     * GET /api/mis-turnos-completados
     * Devuelve los turnos completados del empleado autenticado
     */
    public function misTurnosCompletados(): void {
        $user = Auth::requireEmpleado();
        $userId = $user['sub'];
        $db = getDB();
        
        $stmt = $db->prepare("
            SELECT 
                id, 
                DATE(hora_entrada) as fecha,
                TIME(hora_entrada) as hora_entrada,
                TIME(hora_salida) as hora_salida
            FROM turnos
            WHERE id_usuario = ? 
            AND hora_salida IS NOT NULL
            ORDER BY hora_entrada DESC
        ");
        $stmt->execute([$userId]);
        $turnos = $stmt->fetchAll();
        
        Response::success($turnos);
    }
}