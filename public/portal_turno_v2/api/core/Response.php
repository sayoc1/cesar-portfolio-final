<?php
/**
 * Clase Response - Estandariza todas las respuestas JSON de la API
 * 
 * Todas las respuestas siguen el formato:
 * {
 *   "success": true/false,
 *   "message": "Descripción",
 *   "data": { ... } (opcional)
 *   "errors": [ ... ] (opcional, solo en errores de validación)
 * }
 */
class Response {
    
    /**
     * Respuesta exitosa
     */
    public static function success($data = null, string $message = 'OK', int $code = 200): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Respuesta de error
     */
    public static function error(string $message, int $code = 400, array $errors = []): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if (!empty($errors)) {
            $response['errors'] = $errors;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * No autorizado
     */
    public static function unauthorized(string $message = 'No autorizado'): void {
        self::error($message, 401);
    }
    
    /**
     * Prohibido
     */
    public static function forbidden(string $message = 'Acceso denegado'): void {
        self::error($message, 403);
    }
    
    /**
     * No encontrado
     */
    public static function notFound(string $message = 'Recurso no encontrado'): void {
        self::error($message, 404);
    }
    
    /**
     * Error del servidor
     */
    public static function serverError(string $message = 'Error interno del servidor'): void {
        self::error($message, 500);
    }
}
