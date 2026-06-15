<?php
/**
 * /**
 * HorarioController - Gestión de Horarios
 * 
 * Endpoints:
 * - GET    /api/horarios        → Listar todos (admin)
 * - POST   /api/horarios        → Crear (admin)
 * - PUT    /api/horarios/{id}   → Editar (admin)
 * - DELETE /api/horarios/{id}   → Eliminar (admin)
 * - GET    /api/mis-horarios    → Mis horarios (empleado)
 */

class HorarioController {
    
    /**
     * GET /api/horarios?page=1&search=
     */
    public function index(): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $page = max(1, intval($_GET['page'] ?? 1));
        $perPage = intval($_GET['per_page'] ?? DEFAULT_PER_PAGE);
        $offset = ($page - 1) * $perPage;
        
        // Búsqueda por nombre de empleado
        $search = $_GET['search'] ?? '';
        $where = '';
        $params = [];
        
        if ($search !== '') {
            $where = 'WHERE u.nombre LIKE ? OR u.apellido LIKE ?';
            $searchParam = "%$search%";
            $params = [$searchParam, $searchParam];
        }
        
        // Total de registros
        $countStmt = $db->prepare("
            SELECT COUNT(*) FROM horarios h
            INNER JOIN usuarios u ON h.id_usuario = u.id
            $where
        ");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();
        
        // Obtener horarios con datos del empleado
        $stmt = $db->prepare("
            SELECT h.*, u.nombre AS empleado_nombre, u.apellido AS empleado_apellido
            FROM horarios h
            INNER JOIN usuarios u ON h.id_usuario = u.id
            $where
            ORDER BY h.fecha DESC
            LIMIT $perPage OFFSET $offset
        ");
        $stmt->execute($params);
        $horarios = $stmt->fetchAll();
        
        Response::success([
            'horarios'  => $horarios,
            'pagination' => [
                'total'    => (int)$total,
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => ceil($total / $perPage)
            ]
        ]);
    }
    
    /**
     * GET /api/horarios/{id}
     */
    public function show(array $params): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $stmt = $db->prepare("
            SELECT h.*, u.nombre, u.apellido
            FROM horarios h
            INNER JOIN usuarios u ON h.id_usuario = u.id
            WHERE h.id = ?
        ");
        $stmt->execute([$params['id']]);
        $horario = $stmt->fetch();
        
        if (!$horario) {
            Response::notFound('Horario no encontrado');
        }
        
        Response::success($horario);
    }
    
   /**
 * POST /api/horarios
 */
public function store(): void {
    Auth::requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    
    $v = new Validator($data);
    $v->required('id_usuario')
      ->integer('id_usuario')
      ->required('fecha')
      ->date('fecha')
      ->required('hora_inicio')
      ->time('hora_inicio')
      ->required('hora_fin')
      ->time('hora_fin');
    $v->validate();
    
    $db = getDB();
    
    // Validar que la fecha sea correcta
    $fecha = $data['fecha'];
    $hora_inicio = $data['hora_inicio'];
    $hora_fin = $data['hora_fin'];
    
    // Si la hora de fin es menor que la hora de inicio, significa que el turno cruza la medianoche
    // La fecha debe ser la del día de inicio
    // No se modifica la fecha, se guarda tal como viene del frontend
    
    $stmt = $db->prepare('
        INSERT INTO horarios (id_usuario, fecha, hora_inicio, hora_fin)
        VALUES (?, ?, ?, ?)
    ');
    
    $stmt->execute([
        $data['id_usuario'],
        $fecha,
        $hora_inicio,
        $hora_fin
    ]);
    
    Response::success(['id' => (int)$db->lastInsertId()], 'Horario asignado correctamente', 201);
}
    
    /**
     * PUT /api/horarios/{id}
     */
    public function update(array $params): void {
        Auth::requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $params['id'];
        
        $v = new Validator($data);
        $v->required('fecha')
          ->date('fecha')
          ->required('hora_inicio')
          ->time('hora_inicio')
          ->required('hora_fin')
          ->time('hora_fin');
        $v->validate();
        
        $db = getDB();
        
        $stmt = $db->prepare('UPDATE horarios SET fecha=?, hora_inicio=?, hora_fin=? WHERE id=?');
        $stmt->execute([$data['fecha'], $data['hora_inicio'], $data['hora_fin'], $id]);
        
        if ($stmt->rowCount() === 0) {
            Response::notFound('Horario no encontrado');
        }
        
        Response::success(null, 'Horario actualizado correctamente');
    }
    
    /**
     * DELETE /api/horarios/{id}
     */
    public function destroy(array $params): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $stmt = $db->prepare('DELETE FROM horarios WHERE id = ?');
        $stmt->execute([$params['id']]);
        
        if ($stmt->rowCount() === 0) {
            Response::notFound('Horario no encontrado');
        }
        
        Response::success(null, 'Horario eliminado correctamente');
    }
    
    /**
     * GET /api/mis-horarios
     */
    public function misHorarios(): void {
        $user = Auth::requireAuth();
        
        $db = getDB();
        $stmt = $db->prepare("
            SELECT fecha, hora_inicio, hora_fin
            FROM horarios
            WHERE id_usuario = ?
            ORDER BY fecha ASC
        ");
        $stmt->execute([$user['sub']]);
        
        Response::success($stmt->fetchAll());
    }
}