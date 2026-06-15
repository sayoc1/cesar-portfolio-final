<?php
/**
 * RecorridoController - Hojas de Recorrido
 */
class RecorridoController {
    
    /**
     * GET /api/recorridos
     */
    public function index(): void {
        try {
            $user = Auth::requireAuth();
            $db = getDB();
            
            if ($user['rol'] === 'admin') {
                // Admin ve todas - CORREGIDO: usar hojas_recorrido (plural)
                $stmt = $db->query("
                    SELECT r.*, u.nombre, u.apellido
                    FROM hojas_recorrido r
                    INNER JOIN usuarios u ON r.id_usuario = u.id
                    ORDER BY r.fecha DESC
                    LIMIT 1000
                ");
                $recorridos = $stmt->fetchAll();
            } else {
                // Empleado ve solo las suyas
                $stmt = $db->prepare("
                    SELECT r.*, u.nombre, u.apellido
                    FROM hojas_recorrido r
                    INNER JOIN usuarios u ON r.id_usuario = u.id
                    WHERE r.id_usuario = ? 
                    ORDER BY r.fecha DESC 
                    LIMIT 500
                ");
                $stmt->execute([$user['sub']]);
                $recorridos = $stmt->fetchAll();
            }
            
            // Devolver directamente el array
            Response::success($recorridos);
            
        } catch (Exception $e) {
            error_log("Error en RecorridoController@index: " . $e->getMessage());
            Response::error('Error al cargar recorridos: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /api/recorridos
     */
    public function store(): void {
        try {
            $user = Auth::requireEmpleado();
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
            
            $v = new Validator($data);
            $v->required('punto', 'El punto de recorrido es obligatorio.')
              ->required('observacion', 'La observación es obligatoria.');
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
            
            // CORREGIDO: usar hojas_recorrido (plural)
            $stmt = $db->prepare('
                INSERT INTO hojas_recorrido (id_usuario, id_turno, fecha, punto, observacion)
                VALUES (?, ?, NOW(), ?, ?)
            ');
            $stmt->execute([$user['sub'], $idTurno, $data['punto'], $data['observacion']]);
            
            Response::success(['id' => (int)$db->lastInsertId()], 'Recorrido registrado correctamente', 201);
            
        } catch (Exception $e) {
            error_log("Error en RecorridoController@store: " . $e->getMessage());
            Response::error('Error al registrar recorrido: ' . $e->getMessage(), 500);
        }
    }
}