/**
 * api.js - Cliente HTTP para comunicarse con la API REST
 */

const API_BASE = "/portal_turno_v2/api";

/**
 * Función base para hacer peticiones HTTP
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("token");

  console.log(`🌐 Llamando a: ${url}`, { token: token ? '✓' : '✗' });

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // Verificar autenticación
    if (response.status === 401) {
      console.error('❌ Error 401: No autorizado');
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/portal_turno_v2/";
      return;
    }

    // Parsear respuesta
    let data = {};
    try {
      const text = await response.text();
      console.log(`📥 Respuesta (${response.status}):`, text.substring(0, 200) + '...');
      
      if (text && text.trim().length > 0) {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      if (!response.ok) {
        throw {
          success: false,
          message: `Error del servidor (${response.status})`,
          status: response.status,
        };
      }
      return { success: true, message: "OK" };
    }

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  } catch (error) {
    console.error('❌ Error en apiRequest:', error);
    if (error.message === "Failed to fetch") {
      throw { success: false, message: "Error de conexión con el servidor" };
    }
    throw error;
  }
}

// ============================================
// Métodos HTTP
// ============================================

const api = {
  get: (endpoint) => apiRequest(endpoint, { method: "GET" }),
  post: (endpoint, body) => apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

// ============================================
// Funciones específicas de la API
// ============================================

const Auth = {
  login: (usuario, password) => api.post("/auth/login", { usuario, password }),
  me: () => api.get("/auth/me"),
  saveSession(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isLoggedIn() {
    return !!localStorage.getItem("token");
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/portal_turno_v2/";
  },
};

const Usuarios = {
  list: (page = 1, search = "", limit = 15) => {
    let url = `/usuarios?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    console.log('📋 Solicitando usuarios:', url);
    return api.get(url);
  },
  get: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

const Horarios = {
  list: (page, search) => api.get(`/horarios?page=${page}&search=${encodeURIComponent(search)}`),
  get: (id) => api.get(`/horarios/${id}`),
  create: (data) => api.post('/horarios', data),
  update: (id, data) => api.put(`/horarios/${id}`, data),
  delete: (id) => api.delete(`/horarios/${id}`),
  misHorarios: () => api.get('/mis-horarios'),
};

const Turnos = {
  list: (page = 1, filtros = {}) => {
    let params = `?page=${page}`;
    if (filtros.empleado) params += `&empleado=${filtros.empleado}`;
    if (filtros.fecha_desde) params += `&fecha_desde=${filtros.fecha_desde}`;
    if (filtros.fecha_hasta) params += `&fecha_hasta=${filtros.fecha_hasta}`;
    return api.get(`/turnos${params}`);
  },
  get: (id) => api.get(`/turnos/${id}`),
  registrarEntrada: () => api.post('/turnos/entrada', {}),
  registrarSalida: () => api.post('/turnos/salida', {}),
  misCompletados: () => api.get('/mis-turnos-completados')
};

const Bitacoras = {
  list: () => api.get("/bitacoras"),
  create: (data) => api.post("/bitacoras", data),
};

const Novedades = {
  list: () => api.get("/novedades"),
  create: (data) => api.post("/novedades", data),
};

const Recorridos = {
  list: () => api.get("/recorridos"),
  create: (data) => api.post("/recorridos", data),
};

const Dashboard = {
  admin: () => api.get("/dashboard/admin"),
  empleado: () => api.get("/dashboard/empleado"),
};

const Reportes = {
  resumen: (filtros = {}) => {
    let params = "";
    if (filtros.fecha_desde || filtros.fecha_hasta) {
      params = "?";
      if (filtros.fecha_desde) params += `fecha_desde=${filtros.fecha_desde}&`;
      if (filtros.fecha_hasta) params += `fecha_hasta=${filtros.fecha_hasta}`;
    }
    return api.get(`/reportes/resumen${params}`);
  },
};