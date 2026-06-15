<?php
/**
 * Clase Auth - Autenticación basada en JWT (JSON Web Tokens)
 * 
 * Implementación simplificada de JWT sin dependencias externas.
 * En producción, usar la librería firebase/php-jwt.
 * 
 * Flujo:
 * 1. Usuario envía credenciales → login()
 * 2. Se genera un token JWT → generateToken()
 * 3. En cada petición, el token se envía en el header Authorization
 * 4. El middleware verifica el token → validateToken()
 */
class Auth {
    
    /**
     * Genera un token JWT
     * 
     * @param array $userData Datos del usuario (id, nombre, rol, etc.)
     * @return string Token JWT
     */
    public static function generateToken(array $userData): string {
        $header = self::base64UrlEncode(json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT'
        ]));
        
        $payload = self::base64UrlEncode(json_encode([
            'sub'     => $userData['id'],
            'nombre'  => $userData['nombre'],
            'apellido'=> $userData['apellido'],
            'rol'     => $userData['rol'],
            'iat'     => time(),
            'exp'     => time() + JWT_EXPIRY
        ]));
        
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
        );
        
        return "$header.$payload.$signature";
    }
    
    /**
     * Valida un token JWT y retorna los datos del usuario
     * 
     * @param string $token Token JWT
     * @return array|null Datos del usuario o null si es inválido
     */
    public static function validateToken(string $token): ?array {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Verificar firma
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
        );
        
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }
        
        // Decodificar payload
        $data = json_decode(self::base64UrlDecode($payload), true);
        
        if (!$data) {
            return null;
        }
        
        // Verificar expiración
        if (isset($data['exp']) && $data['exp'] < time()) {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Obtiene el usuario actual desde el token en el header Authorization
     * 
     * @return array|null
     */
    public static function getUser(): ?array {
        $token = self::getBearerToken();
        
        if (!$token) {
            return null;
        }
        
        return self::validateToken($token);
    }
    
    /**
     * Middleware: Requiere autenticación
     * Si no hay token válido, retorna 401
     */
    public static function requireAuth(): array {
        $user = self::getUser();
        
        if (!$user) {
            Response::unauthorized('Token inválido o expirado. Inicia sesión nuevamente.');
        }
        
        return $user;
    }
    
    /**
     * Middleware: Requiere rol de admin
     */
    public static function requireAdmin(): array {
        $user = self::requireAuth();
        
        if ($user['rol'] !== 'admin') {
            Response::forbidden('Se requiere rol de administrador.');
        }
        
        return $user;
    }
    
    /**
     * Middleware: Requiere rol de empleado
     */
    public static function requireEmpleado(): array {
        $user = self::requireAuth();
        
        if ($user['rol'] !== 'empleado') {
            Response::forbidden('Se requiere rol de empleado.');
        }
        
        return $user;
    }
    
    /**
     * Extrae el Bearer token del header Authorization
     */
    private static function getBearerToken(): ?string {
        $headers = '';
        
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            if (isset($requestHeaders['Authorization'])) {
                $headers = $requestHeaders['Authorization'];
            }
        }
        
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    /**
     * Codifica en base64url (RFC 4648)
     */
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Decodifica base64url
     */
    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
