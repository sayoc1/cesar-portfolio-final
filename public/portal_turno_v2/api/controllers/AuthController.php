<?php
/**
 * AuthController - Controlador de Autenticación
 * 
 * Endpoints:
 * - POST /api/auth/login  → Iniciar sesión
 * - GET  /api/auth/me     → Obtener usuario actual
 */
class AuthController {
    
    /**
     * POST /api/auth/login
     * 
     * Recibe: { "usuario": "admin", "password": "123456" }
     * Retorna: { "success": true, "data": { "token": "...", "user": {...} } }
     */
    public function login(): void {
        // Leer datos JSON del body
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        
        // Validar
        $v = new Validator($data);
        $v->required('usuario', 'El usuario es obligatorio')
          ->required('password', 'La contraseña es obligatoria');
        $v->validate();
        
        $db = getDB();
        
        // Buscar usuario
        $stmt = $db->prepare('SELECT * FROM usuarios WHERE usuario = ?');
        $stmt->execute([$data['usuario']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            Response::error('El usuario no existe en el sistema.', 401);
        }
        
        // Verificar contraseña
        if (!password_verify($data['password'], $user['password'])) {
            Response::error('La contraseña ingresada es incorrecta.', 401);
        }
        
        // Generar token JWT
        $token = Auth::generateToken($user);
        
        // Retornar token y datos del usuario (sin la contraseña)
        unset($user['password']);
        
        Response::success([
            'token' => $token,
            'user'  => $user
        ], 'Inicio de sesión exitoso');
    }
    
    /**
     * GET /api/auth/me
     * 
     * Retorna los datos del usuario autenticado
     */
    public function me(): void {
        $tokenUser = Auth::requireAuth();
        
        $db = getDB();
        $stmt = $db->prepare('SELECT id, nombre, apellido, usuario, email, rol FROM usuarios WHERE id = ?');
        $stmt->execute([$tokenUser['sub']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            Response::notFound('Usuario no encontrado');
        }
        
        Response::success($user);
    }
}
