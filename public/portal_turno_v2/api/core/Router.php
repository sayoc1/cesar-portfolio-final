<?php
/**
 * Clase Router - Enrutador simple para la API REST
 * 
 * Permite definir rutas con métodos HTTP y ejecutar controladores.
 * 
 * Uso:
 *   $router = new Router();
 *   $router->get('/usuarios', 'UsuarioController@index');
 *   $router->post('/auth/login', 'AuthController@login');
 *   $router->run();
 */
class Router {
    
    private array $routes = [];
    private string $basePath;
    
    public function __construct(string $basePath = '') {
        $this->basePath = $basePath;
    }
    
    /**
     * Registra una ruta GET
     */
    public function get(string $path, string $handler): void {
        $this->addRoute('GET', $path, $handler);
    }
    
    /**
     * Registra una ruta POST
     */
    public function post(string $path, string $handler): void {
        $this->addRoute('POST', $path, $handler);
    }
    
    /**
     * Registra una ruta PUT
     */
    public function put(string $path, string $handler): void {
        $this->addRoute('PUT', $path, $handler);
    }
    
    /**
     * Registra una ruta DELETE
     */
    public function delete(string $path, string $handler): void {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    /**
     * Agrega una ruta al arreglo interno
     */
    private function addRoute(string $method, string $path, string $handler): void {
        // Convierte parámetros como {id} en regex (?P<id>[0-9]+)
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[0-9]+)', $path);
        $pattern = '#^' . $this->basePath . $pattern . '$#';
        
        $this->routes[] = [
            'method'  => $method,
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }
    
    /**
     * Ejecuta el enrutador, busca la ruta que coincida y llama al controlador
     */
    public function run(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Soporte para CORS (peticiones desde JavaScript)
        if ($method === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
        
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $uri, $matches)) {
                // Extraer solo los parámetros con nombre (no los numéricos)
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                // Parsear el handler: "ControladorController@metodo"
                [$controllerName, $methodName] = explode('@', $route['handler']);
                
                // Cargar el controlador
                $controllerFile = __DIR__ . '/../controllers/' . $controllerName . '.php';
                
                if (!file_exists($controllerFile)) {
                    Response::serverError("Controlador '$controllerName' no encontrado");
                }
                
                require_once $controllerFile;
                
                $controller = new $controllerName();
                
                if (!method_exists($controller, $methodName)) {
                    Response::serverError("Método '$methodName' no encontrado en '$controllerName'");
                }
                
                // Llamar al método del controlador con los parámetros
                $controller->$methodName($params);
                return;
            }
        }
        
        // Ninguna ruta coincidió
        Response::notFound('Endpoint no encontrado: ' . $method . ' ' . $uri);
    }
}
