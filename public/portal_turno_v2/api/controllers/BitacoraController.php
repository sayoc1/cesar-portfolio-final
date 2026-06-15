<?php
/**
 * BitacoraController - Registro de Bitácoras
 */
class BitacoraController {
    
    /**
     * GET /api/bitacoras
     */
    public function index(): void {
        try {
            $user = Auth::requireAuth();
            $db = getDB();
            
            if ($user['rol'] === 'admin') {
                // Admin ve todas
                $stmt = $db->query("
                    SELECT b.*, u.nombre, u.apellido
                    FROM bitacoras b
                    INNER JOIN usuarios u ON b.id_usuario = u.id
                    ORDER BY b.fecha DESC
                    LIMIT 1000
                ");
                $bitacoras = $stmt->fetchAll();
            } else {
                // Empleado ve solo las suyas
                $stmt = $db->prepare("
                    SELECT b.*, u.nombre, u.apellido
                    FROM bitacoras b
                    INNER JOIN usuarios u ON b.id_usuario = u.id
                    WHERE b.id_usuario = ? 
                    ORDER BY b.fecha DESC 
                    LIMIT 500
                ");
                $stmt->execute([$user['sub']]);
                $bitacoras = $stmt->fetchAll();
            }
            
            // Devolver directamente el array
            Response::success($bitacoras);
            
        } catch (Exception $e) {
            error_log("Error en BitacoraController@index: " . $e->getMessage());
            Response::error('Error al cargar bitácoras: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/bitacoras
     */
    public function store(): void {
        try {
            $user = Auth::requireEmpleado();
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            $v = new Validator($data);
            $v->required('descripcion', 'La descripción de la bitácora es obligatoria.');
            $v->validate();
            
            $db = getDB();
            
            // Buscar turno activo del día
            $stmt = $db->prepare("
                SELECT id FROM turnos 
                WHERE id_usuario = ? AND DATE(hora_entrada) = CURDATE()
                ORDER BY id DESC LIMIT 1
            ");
            $stmt->execute([$user['sub']]);
            $turno = $stmt->fetch();
            $idTurno = $turno ? $turno['id'] : null;
            
            $stmt = $db->prepare('
                INSERT INTO bitacoras (id_usuario, id_turno, fecha, actividad)
                VALUES (?, ?, NOW(), ?)
            ');
            $stmt->execute([$user['sub'], $idTurno, $data['descripcion']]);
            
            Response::success(['id' => (int)$db->lastInsertId()], 'Bitácora registrada correctamente', 201);
            
        } catch (Exception $e) {
            error_log("Error en BitacoraController@store: " . $e->getMessage());
            Response::error('Error al registrar bitácora: ' . $e->getMessage(), 500);
        }
    }
}