<?php
/**
 * Clase Validator - Validación de datos de entrada
 * 
 * Valida los datos que llegan desde el frontend antes de
 * procesarlos en el controlador.
 * 
 * Uso:
 *   $v = new Validator($datos);
 *   $v->required('nombre', 'El nombre es obligatorio');
 *   $v->email('email', 'Email inválido');
 *   
 *   if ($v->hasErrors()) {
 *       Response::error('Errores de validación', 422, $v->getErrors());
 *   }
 */
class Validator {
    
    private array $data;
    private array $errors = [];
    
    public function __construct(array $data) {
        $this->data = $data;
    }
    
    /**
     * Campo requerido (no vacío)
     */
    public function required(string $field, string $message = ''): self {
        if (!isset($this->data[$field]) || trim($this->data[$field]) === '') {
            $this->errors[$field] = $message ?: "El campo '$field' es obligatorio.";
        }
        return $this;
    }
    
    /**
     * Validar formato de email
     */
    public function email(string $field, string $message = ''): self {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = $message ?: "El campo '$field' debe ser un email válido.";
        }
        return $this;
    }
    
    /**
     * Longitud mínima
     */
    public function minLength(string $field, int $min, string $message = ''): self {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $min) {
            $this->errors[$field] = $message ?: "El campo '$field' debe tener al menos $min caracteres.";
        }
        return $this;
    }
    
    /**
     * Validar que el valor sea una fecha válida
     */
    public function date(string $field, string $message = ''): self {
        if (isset($this->data[$field])) {
            $d = DateTime::createFromFormat('Y-m-d', $this->data[$field]);
            if (!$d || $d->format('Y-m-d') !== $this->data[$field]) {
                $this->errors[$field] = $message ?: "El campo '$field' debe ser una fecha válida (YYYY-MM-DD).";
            }
        }
        return $this;
    }
    
    /**
     * Validar que el valor sea una hora válida
     */
    public function time(string $field, string $message = ''): self {
        if (isset($this->data[$field]) && !preg_match('/^([01]\d|2[0-3]):([0-5]\d)$/', $this->data[$field])) {
            $this->errors[$field] = $message ?: "El campo '$field' debe ser una hora válida (HH:MM).";
        }
        return $this;
    }
    
    /**
     * Validar que el valor esté en una lista permitida
     */
    public function inList(string $field, array $allowed, string $message = ''): self {
        if (isset($this->data[$field]) && !in_array($this->data[$field], $allowed)) {
            $this->errors[$field] = $message ?: "El valor del campo '$field' no es válido.";
        }
        return $this;
    }
    
    /**
     * Validar que sea un número entero positivo
     */
    public function integer(string $field, string $message = ''): self {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_INT)) {
            $this->errors[$field] = $message ?: "El campo '$field' debe ser un número entero.";
        }
        return $this;
    }
    
    /**
     * ¿Hay errores?
     */
    public function hasErrors(): bool {
        return !empty($this->errors);
    }
    
    /**
     * Obtener los errores
     */
    public function getErrors(): array {
        return $this->errors;
    }
    
    /**
     * Lanza error si hay errores de validación
     */
    public function validate(): void {
        if ($this->hasErrors()) {
            Response::error('Errores de validación', 422, $this->getErrors());
        }
    }
}
