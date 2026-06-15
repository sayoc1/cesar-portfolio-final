/**
 * app.js - Funciones auxiliares del frontend
 * Portal de Turnos v2 — Estilo Banca Profesional
 */

// ============================================
// NOTIFICACIONES TOAST
// ============================================

function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const icons = {
    success: "check_circle",
    error: "error",
    info: "info",
    warning: "warning",
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
        <div class="toast-content">
            <span class="material-symbols-outlined" style="font-size:20px">${icons[type] || "info"}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-show"));

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// ============================================
// MODAL DE CONFIRMACIÓN
// ============================================

function showConfirm(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
        <div class="modal-box">
            <div class="modal-icon">
                <span class="material-symbols-outlined" style="font-size:48px; color:var(--warning)">warning</span>
            </div>
            <p class="modal-message">${message}</p>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="modalCancel">Cancelar</button>
                <button class="btn btn-danger" id="modalConfirm">Confirmar</button>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("modal-show"));

  overlay.querySelector("#modalCancel").onclick = () => {
    overlay.classList.remove("modal-show");
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector("#modalConfirm").onclick = () => {
    overlay.classList.remove("modal-show");
    setTimeout(() => overlay.remove(), 300);
    onConfirm();
  };
}

// ============================================
// FORMATEO DE DATOS
// ============================================

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "—";
  if (timeStr.includes(" ")) {
    timeStr = timeStr.split(" ")[1];
  }
  return timeStr.substring(0, 5);
}

function formatDateTime(datetimeStr) {
  if (!datetimeStr) return "—";
  const d = new Date(datetimeStr);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// LOADING STATE
// ============================================

function showLoading(container) {
  if (typeof container === "string") {
    container = document.querySelector(container);
  }
  if (container) {
    container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Cargando...</p>
            </div>
        `;
  }
}

// ============================================
// PROTECCIÓN DE RUTAS
// ============================================

function requireAuth(role = null) {
  if (!Auth.isLoggedIn()) {
    window.location.href = "/portal_turno_v2/";
    return false;
  }

  const user = Auth.getUser();
  if (role && user.rol !== role) {
    window.location.href = "/portal_turno_v2/";
    return false;
  }

  return user;
}

// ============================================
// HEADER Y NAVEGACIÓN — ESTILO BANCA
// ============================================

function initHeader(user) {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const initial = (user.nombre || "U")[0].toUpperCase();
  
  // Crear el navbar primero
  nav.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.75rem; width:100%;">
        <button class="nav-hamburger" onclick="window.toggleSidebar(event)" aria-label="Abrir menú" aria-expanded="false">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="nav-brand" style="display: flex; align-items: center; gap: 10px; flex:1;">
            <!-- El logo se insertará aquí -->
            <span class="nav-title">Banco Agrícola de Venezuela</span>
        </div>
        <div class="nav-user">
            <div class="nav-avatar">${initial}</div>
            <span class="nav-username">${user.nombre} ${user.apellido || ""}</span>
            <span class="nav-role badge badge-${user.rol === "admin" ? "primary" : "success"}">${user.rol}</span>
            <button class="btn btn-sm btn-outline" onclick="Auth.logout()" title="Cerrar sesión">
                <span class="material-symbols-outlined" style="font-size:18px">logout</span>
            </button>
        </div>
    </div>
  `;

  // ============================================
  // LOGO CON MÚLTIPLES RUTAS DE RESPALDO
  // ============================================
  const navBrand = nav.querySelector('.nav-brand');
  
  // Intentar cargar el logo con diferentes rutas
  const logoRutas = [
    '/portal_turno_v2/assets/img/logo-banco.png',
    '../assets/img/logo-banco.png',
    './assets/img/logo-banco.png',
    'assets/img/logo-banco.png'
  ];

  // Crear imagen con manejo de error
  const logoImg = document.createElement('img');
  logoImg.alt = "BAV";
  logoImg.style.height = "35px";
  logoImg.style.width = "auto";
  logoImg.style.borderRadius = "8px";
  logoImg.style.backgroundColor = "white";
  logoImg.style.padding = "3px";
  
  // Insertar el logo al inicio del nav-brand
  navBrand.insertBefore(logoImg, navBrand.firstChild);
  
  // Intentar cada ruta hasta que una funcione
  let rutaActual = 0;
  
  function probarSiguienteRuta() {
    if (rutaActual < logoRutas.length) {
      logoImg.src = logoRutas[rutaActual];
      rutaActual++;
    } else {
      // Si ninguna ruta funciona, mostrar iniciales como respaldo
      logoImg.style.display = 'none';
      
      // Crear un div de respaldo
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.background = 'white';
      fallbackDiv.style.color = '#00723f';
      fallbackDiv.style.fontWeight = 'bold';
      fallbackDiv.style.fontSize = '16px';
      fallbackDiv.style.width = '35px';
      fallbackDiv.style.height = '35px';
      fallbackDiv.style.display = 'flex';
      fallbackDiv.style.alignItems = 'center';
      fallbackDiv.style.justifyContent = 'center';
      fallbackDiv.style.borderRadius = '8px';
      fallbackDiv.style.padding = '0';
      fallbackDiv.textContent = 'BAV';
      
      // Insertar el respaldo
      navBrand.insertBefore(fallbackDiv, navBrand.firstChild);
    }
  }
  
  // Asignar el manejador de error
  logoImg.onerror = probarSiguienteRuta;
  
  // Iniciar la primera prueba
  logoImg.src = logoRutas[0];
  rutaActual = 1;
}

// ============================================
// SIDEBAR MÓVIL - FUNCIÓN GLOBAL ÚNICA
// ============================================
window.toggleSidebar = function(event) {
    if (event) event.preventDefault();
    
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (!sidebar || !overlay) return;
    
    if (sidebar.classList.contains('sidebar-open')) {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('sidebar-open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

// Inicializar eventos globales del sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar al hacer clic en el overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('sidebar-overlay')) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && overlay) {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && sidebar.classList.contains('sidebar-open')) {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Cerrar al redimensionar a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && sidebar.classList.contains('sidebar-open')) {
                sidebar.classList.remove('sidebar-open');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        }
    });
});

// ============================================
// PAGINACIÓN
// ============================================

function renderPagination(pagination, onPageClick) {
  if (pagination.pages <= 1) return "";

  let html = '<div class="pagination">';

  if (pagination.page > 1) {
    html += `<button class="page-btn" data-page="${pagination.page - 1}">
      <span class="material-symbols-outlined" style="font-size:16px">chevron_left</span> Anterior
    </button>`;
  }

  for (let i = 1; i <= pagination.pages; i++) {
    const active = i === pagination.page ? "active" : "";
    html += `<button class="page-btn ${active}" data-page="${i}">${i}</button>`;
  }

  if (pagination.page < pagination.pages) {
    html += `<button class="page-btn" data-page="${pagination.page + 1}">
      Siguiente <span class="material-symbols-outlined" style="font-size:16px">chevron_right</span>
    </button>`;
  }

  html += "</div>";
  return html;
}