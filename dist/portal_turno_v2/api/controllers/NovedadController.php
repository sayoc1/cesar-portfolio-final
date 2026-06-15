<?php
/**
 * NovedadController - Registro de Novedades
 */
class NovedadController {
    
    /**
     * GET /api/novedades
     */
    public function index(): void {
        try {
            $user = Auth::requireAuth();
            $db = getDB();
            
            if ($user['rol'] === 'admin') {
                // Admin ve todas
                $stmt = $db->query("
                    SELECT n.*, u.nombre, u.apellido
                    FROM novedades n
                    INNER JOIN usuarios u ON n.id_usuario = u.id
                    ORDER BY n.fecha DESC
                    LIMIT 1000
                ");
                $novedades = $stmt->fetchAll();
            } else {
                // Empleado ve solo las suyas
                $stmt = $db->prepare("
                    SELECT n.*, u.nombre, u.apellido
                    FROM novedades n
                    INNER JOIN usuarios u ON n.id_usuario = u.id
                    WHERE n.id_usuario = ? 
                    ORDER BY n.fecha DESC 
                    LIMIT 500
                ");
                $stmt->execute([$user['sub']]);
                $novedades = $stmt->fetchAll();
            }
            
            // Devolver directamente el array
            Response::success($novedades);
            
        } catch (Exception $e) {
            error_log("Error en NovedadController@index: " . $e->getMessage());
            Response::error('Error al cargar novedades: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/novedades
     */
    public function store(): void {
        try {
            $user = Auth::requireEmpleado();
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            $v = new Validator($data);
            $v->required('descripcion', 'La descripción de la novedad es obligatoria.');
            $v->validate();
            
            $db = getDB();
            
            // Buscar turno activo
            $stmt = $db->prepare("
                SELECT id FROM turnos 
                WHERE id_usuario = ? AND DATE(hora_entrada) = CURDATE()
                ORDER BY id DESC LIMIT 1
            ");
            $stmt->execute([$user['sub']]);
            $turno = $stmt->fetch();
            $idTurno = $turno ? $turno['id'] : null;
            
            $stmt = $db->prepare('
                INSERT INTO novedades (id_usuario, id_turno, fecha, descripcion)
                VALUES (?, ?, NOW(), ?)
            ');
            $stmt->execute([$user['sub'], $idTurno, $data['descripcion']]);
            
            Response::success(['id' => (int)$db->lastInsertId()], 'Novedad registrada correctamente', 201);
            
        } catch (Exception $e) {
            error_log("Error en NovedadController@store: " . $e->getMessage());
            Response::error('Error al registrar novedad: ' . $e->getMessage(), 500);
        }
    }
}