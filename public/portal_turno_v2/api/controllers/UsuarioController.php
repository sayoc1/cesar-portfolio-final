<?php
/**
 * UsuarioController - CRUD de Usuarios (solo admin)
 * 
 * Endpoints:
 * - GET    /api/usuarios        → Listar todos
 * - GET    /api/usuarios/{id}   → Ver uno
 * - POST   /api/usuarios        → Crear
 * - PUT    /api/usuarios/{id}   → Actualizar
 * - DELETE /api/usuarios/{id}   → Eliminar
 */
class UsuarioController {
    
    /**
     * GET /api/usuarios
     * Lista todos los usuarios con paginación
     */
    public function index(): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $page = max(1, intval($_GET['page'] ?? 1));
        $perPage = intval($_GET['per_page'] ?? DEFAULT_PER_PAGE);
        $offset = ($page - 1) * $perPage;
        
        // Búsqueda opcional
        $search = $_GET['search'] ?? '';
        $where = '';
        $params = [];
        
        if ($search !== '') {
            $where = 'WHERE nombre LIKE ? OR apellido LIKE ? OR usuario LIKE ?';
            $searchParam = "%$search%";
            $params = [$searchParam, $searchParam, $searchParam];
        }
        
        // Contar total
        $countStmt = $db->prepare("SELECT COUNT(*) FROM usuarios $where");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();
        
        // Obtener registros
        $stmt = $db->prepare("
            SELECT id, nombre, apellido, usuario, email, rol 
            FROM usuarios $where 
            ORDER BY id DESC
            LIMIT $perPage OFFSET $offset
        ");
        $stmt->execute($params);
        $usuarios = $stmt->fetchAll();
        
        Response::success([
            'usuarios'   => $usuarios,
            'pagination' => [
                'total'    => (int)$total,
                'page'     => $page,
                'per_page' => $perPage,
                'pages'    => ceil($total / $perPage)
            ]
        ]);
    }
    
    /**
     * GET /api/usuarios/{id}
     */
    public function show(array $params): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $stmt = $db->prepare('SELECT id, nombre, apellido, usuario, email, rol FROM usuarios WHERE id = ?');
        $stmt->execute([$params['id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            Response::notFound('Usuario no encontrado');
        }
        
        Response::success($user);
    }
    
    /**
     * POST /api/usuarios
     * Crea un nuevo usuario
     */
    public function store(): void {
        Auth::requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // Validar
        $v = new Validator($data);
        $v->required('nombre')
          ->required('apellido')
          ->required('usuario')
          ->required('email')
          ->email('email')
          ->required('password')
          ->minLength('password', 6, 'La contraseña debe tener al menos 6 caracteres')
          ->required('rol')
          ->inList('rol', ROLES, 'El rol debe ser admin o empleado');
        $v->validate();
        
        $db = getDB();
        
        // Verificar que el usuario no exista
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE usuario = ?');
        $stmt->execute([$data['usuario']]);
        if ($stmt->fetch()) {
            Response::error('El nombre de usuario ya está en uso.', 409);
        }
        
        // Insertar
        $stmt = $db->prepare('
            INSERT INTO usuarios (nombre, apellido, usuario, password, email, rol)
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        
        $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['usuario'],
            password_hash($data['password'], PASSWORD_DEFAULT),
            $data['email'],
            $data['rol']
        ]);
        
        $id = $db->lastInsertId();
        
        Response::success(['id' => (int)$id], 'Usuario creado correctamente', 201);
    }
    
    /**
     * PUT /api/usuarios/{id}
     */
    public function update(array $params): void {
        Auth::requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $params['id'];
        
        $db = getDB();
        
        // Verificar que existe
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Response::notFound('Usuario no encontrado');
        }
        
        // Validar
        $v = new Validator($data);
        $v->required('nombre')
          ->required('apellido')
          ->required('usuario')
          ->required('email')
          ->email('email')
          ->required('rol')
          ->inList('rol', ROLES);
        $v->validate();
        
        // Verificar que el nombre de usuario no esté en uso por otro
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE usuario = ? AND id != ?');
        $stmt->execute([$data['usuario'], $id]);
        if ($stmt->fetch()) {
            Response::error('El nombre de usuario ya está en uso por otro usuario.', 409);
        }
        
        // ¿Cambiar contraseña?
        if (!empty($data['password'])) {
            $stmt = $db->prepare('
                UPDATE usuarios SET nombre=?, apellido=?, usuario=?, email=?, rol=?, password=? WHERE id=?
            ');
            $stmt->execute([
                $data['nombre'], $data['apellido'], $data['usuario'],
                $data['email'], $data['rol'],
                password_hash($data['password'], PASSWORD_DEFAULT),
                $id
            ]);
        } else {
            $stmt = $db->prepare('
                UPDATE usuarios SET nombre=?, apellido=?, usuario=?, email=?, rol=? WHERE id=?
            ');
            $stmt->execute([
                $data['nombre'], $data['apellido'], $data['usuario'],
                $data['email'], $data['rol'], $id
            ]);
        }
        
        Response::success(null, 'Usuario actualizado correctamente');
    }
    
    /**
     * DELETE /api/usuarios/{id}
     */
    public function destroy(array $params): void {
        Auth::requireAdmin();
        
        $db = getDB();
        $id = $params['id'];
        
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Response::notFound('Usuario no encontrado');
        }
        
        $stmt = $db->prepare('DELETE FROM usuarios WHERE id = ?');
        $stmt->execute([$id]);
        
        Response::success(null, 'Usuario eliminado correctamente');
    }
}
