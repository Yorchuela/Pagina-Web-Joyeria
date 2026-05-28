/* =========================
   OBTENER DATOS
========================= */

const rol =
    localStorage.getItem("rol") || "Invitado";

const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

const nombreUsuario =
    usuario
        ? usuario.nombre
        : "Invitado";

console.log("ROL ACTUAL:", rol);

/* =========================
   DETECTAR UBICACION
========================= */

const estaEnPages =
    window.location.pathname.includes("/pages/");

/* =========================
   FUNCION RUTAS
========================= */

function obtenerRuta(ruta){

    return estaEnPages
        ? `./${ruta}`
        : `./pages/${ruta}`;
}

/* =========================
   ELEMENTOS DOM
========================= */

const dashboard =
    document.getElementById("dashboard");

const categorias =
    document.getElementById("categorias");

const container =

    document.getElementById(
        "cardsContainer"
    )

    ||

    document.getElementById(
        "contenedorCategorias"
    );

const menu =
    document.getElementById("menu");

const tituloHero =
    document.getElementById("tituloHero");

const textoHero =
    document.getElementById("textoHero");

const btnHero =
    document.getElementById("btnHero");

const bienvenida =
    document.getElementById("bienvenida");

const btnLogin =
    document.getElementById("btnLogin");

const btnLogout =
    document.getElementById("btnLogout");

const rolUsuario =
    document.getElementById("rolUsuario");

/* =========================
   MOSTRAR USUARIO
========================= */

if (rolUsuario) {

    rolUsuario.textContent =
        rol === "Invitado"
            ? "Invitado"
            : `${nombreUsuario} | ${rol}`;
}

/* =========================
   FUNCION CREAR CARD
========================= */

function card(icono, titulo, descripcion, link){

    const div = document.createElement("div");

    div.className = "card-admin";

    div.innerHTML = `
        <div class="icono">
            ${icono}
        </div>

        <h3>
            ${titulo}
        </h3>

        <p>
            ${descripcion}
        </p>

        <a href="${obtenerRuta(link)}">
            Entrar
        </a>
    `;

    return div;
}

/* =========================
   CLIENTE / INVITADO
========================= */

if (rol === "Invitado" || rol === "Cliente") {

    menu.innerHTML = `
        <a href="${
            estaEnPages
                ? "../index.html"
                : "index.html"
        }">
            Inicio
        </a>

        <a href="${
            obtenerRuta("categorias.html")
        }">
            Categorías
        </a>

        <a href="${
            obtenerRuta("catalogo.html")
        }">
            Productos
        </a>

        <a href="${
            obtenerRuta("carrito.html")
        }">
            Carrito 🛒
        </a>
    `;

    btnLogin.style.display =
        rol === "Invitado"
            ? "inline-block"
            : "none";

    btnLogout.style.display =
        rol === "Cliente"
            ? "inline-block"
            : "none";

    if (dashboard) {
        dashboard.style.display = "block";
    }

    if (categorias) {
        categorias.style.display = "none";
    }

    if (tituloHero) {

        tituloHero.textContent =
            "Bienvenido a YORCH JEWELRY";
    }

    if (textoHero) {

        textoHero.textContent =
            "Explora nuestros productos exclusivos";
    }

    if (btnHero) {

        btnHero.textContent =
            "Comprar ahora";

        btnHero.onclick = () => {

            window.location.href =
                obtenerRuta("catalogo.html");
        };
    }

    if (bienvenida) {

        bienvenida.textContent =
            rol === "Cliente"
                ? "Panel de Cliente"
                : "Catálogo Principal";
    }

    container.appendChild(
        card(
            "🛍️",
            "Productos",
            "Explora el catálogo completo de joyería.",
            "catalogo.html"
        )
    );

    container.appendChild(
        card(
            "📿",
            "Collares",
            "Explora nuestra colección de collares.",
            "catalogo.html?id_categoria=1"
        )
    );

    container.appendChild(
        card(
            "💫",
            "Pulseras",
            "Descubre pulseras exclusivas y elegantes.",
            "catalogo.html?id_categoria=2"
        )
    );

    container.appendChild(
        card(
            "💍",
            "Anillos",
            "Encuentra anillos únicos para cualquier ocasión.",
            "catalogo.html?id_categoria=3"
        )
    );

    container.appendChild(
        card(
            "🛒",
            "Carrito",
            "Revisa y administra tus compras.",
            "carrito.html"
        )
    );
}

/* =========================
   ADMINISTRACION
========================= */

else {

    if (dashboard) {
        dashboard.style.display = "block";
    }

    if (categorias) {
        categorias.style.display = "none";
    }

    btnLogin.style.display = "none";

    btnLogout.style.display = "inline-block";

    /* =========================
       ADMINISTRADOR
    ========================= */

    if (rol === "Administrador") {

        menu.innerHTML = `
            <a href="${
                estaEnPages
                    ? "../index.html"
                    : "index.html"
            }">
                Inicio
            </a>

            <a href="${
                obtenerRuta("dashboard.html")
            }">
                Dashboard
            </a>

            <a href="${
                obtenerRuta("clientes.html")
            }">
                Clientes
            </a>

            <a href="${
                obtenerRuta("productos.html")
            }">
                Productos
            </a>

            <a href="${
                obtenerRuta("reporte_ventas.html")
            }">
                Ventas
            </a>

            <a href="${
                obtenerRuta("reportes.html")
            }">
                Reportes
            </a>

            <a href="${
                obtenerRuta("usuarios.html")
            }">
                Usuarios
            </a>

            <a href="${
                obtenerRuta("devoluciones.html")
            }">
                Devoluciones
            </a>

            <a href="${
                obtenerRuta("movimientos.html")
            }">
                Inventario
            </a>
        `;

        if (tituloHero) {

            tituloHero.textContent =
                "Administración Total";
        }

        if (textoHero) {

            textoHero.textContent =
                "Control completo del sistema y operaciones";
        }

        if (btnHero) {

            btnHero.textContent =
                "Ir al panel";

            btnHero.onclick = () => {

                window.location.href =
                    obtenerRuta("dashboard.html");
            };
        }

        if (bienvenida) {

            bienvenida.textContent =
                "Panel de Administrador";
        }

        container.appendChild(
            card(
                "💰",
                "Ventas",
                "Controla ventas y movimientos del sistema.",
                "reporte_ventas.html"
            )
        );

        container.appendChild(
            card(
                "📦",
                "Inventario",
                "Administra productos y stock disponible.",
                "movimientos.html"
            )
        );

        container.appendChild(
            card(
                "👤",
                "Clientes",
                "Consulta clientes registrados y compras.",
                "clientes.html"
            )
        );

        container.appendChild(
            card(
                "📊",
                "Reportes",
                "Visualiza estadísticas y reportes del negocio.",
                "Reportes.html"
            )
        );

        container.appendChild(
            card(
                "⚙️",
                "Usuarios",
                "Gestiona permisos y usuarios del sistema.",
                "usuarios.html"
            )
        );

        container.appendChild(
            card(
                "🛍️",
                "Productos",
                "Gestiona el catálogo de productos.",
                "productos.html"
            )
        );

        container.appendChild(
            card(
                "🔄",
                "Devoluciones",
                "Gestiona devoluciones y reembolsos.",
                "devoluciones.html"
            )
        );
    }

    /* =========================
       VENDEDOR
    ========================= */

    if (rol === "Vendedor") {

        menu.innerHTML = `
            <a href="${
                estaEnPages
                    ? "../index.html"
                    : "index.html"
            }">
                Inicio
            </a>

            <a href="${
                obtenerRuta("dashboard_cajero.html")
            }">
                Panel Cajero
            </a>

            <a href="${
                obtenerRuta("reporte_ventas.html")
            }">
                Ventas
            </a>

            <a href="${
                obtenerRuta("tickets.html")
            }">
                Tickets
            </a>

            <a href="${
                obtenerRuta("clientes.html")
            }">
                Clientes
            </a>

            <a href="${
                obtenerRuta("devoluciones.html")
            }">
                Devoluciones
            </a>
        `;

        if (tituloHero) {

            tituloHero.textContent =
                "Panel de Ventas";
        }

        if (textoHero) {

            textoHero.textContent =
                "Gestiona ventas y atención a clientes";
        }

        if (btnHero) {

            btnHero.textContent =
                "Nueva venta";

            btnHero.onclick = () => {

                window.location.href =
                    obtenerRuta("reporte_ventas.html");
            };
        }

        if (bienvenida) {

            bienvenida.textContent =
                "Panel de Cajero";
        }

        container.appendChild(
            card(
                "💰",
                "Ventas",
                "Realiza ventas y genera tickets.",
                "reporte_ventas.html"
            )
        );

        container.appendChild(
            card(
                "🧾",
                "Tickets",
                "Consulta y genera tickets de compra.",
                "tickets.html"
            )
        );

        container.appendChild(
            card(
                "👥",
                "Clientes",
                "Consulta información de clientes.",
                "clientes.html"
            )
        );

        container.appendChild(
            card(
                "🔄",
                "Devoluciones",
                "Gestiona devoluciones de clientes.",
                "devoluciones.html"
            )
        );
    }

    /* =========================
       INVENTARIO
    ========================= */

    if (rol === "Inventario") {

        menu.innerHTML = `
            <a href="${
                estaEnPages
                    ? "../index.html"
                    : "index.html"
            }">
                Inicio
            </a>

            <a href="${
                obtenerRuta("dashboard_almacen.html")
            }">
                Panel Almacén
            </a>

            <a href="${
                obtenerRuta("productos.html")
            }">
                Productos
            </a>

            <a href="${
                obtenerRuta("agregar_producto.html")
            }">
                Agregar Producto
            </a>

            <a href="${
                obtenerRuta("movimientos.html")
            }">
                Movimientos
            </a>

            <a href="${
                obtenerRuta("devoluciones.html")
            }">
                Devoluciones
            </a>
        `;

        if (tituloHero) {

            tituloHero.textContent =
                "Gestión de Inventario";
        }

        if (textoHero) {

            textoHero.textContent =
                "Administra productos y controla existencias";
        }

        if (btnHero) {

            btnHero.textContent =
                "Ver inventario";

            btnHero.onclick = () => {

                window.location.href =
                    obtenerRuta("dashboard_almacen.html");
            };
        }

        if (bienvenida) {

            bienvenida.textContent =
                "Panel de Inventario";
        }

        container.appendChild(
            card(
                "📦",
                "Inventario",
                "Administra productos y controla existencias.",
                "dashboard_almacen.html"
            )
        );

        container.appendChild(
            card(
                "➕",
                "Agregar Productos",
                "Registra nuevos productos al sistema.",
                "agregar_producto.html"
            )
        );

        container.appendChild(
            card(
                "🔄",
                "Devoluciones",
                "Gestiona devoluciones y productos regresados.",
                "devoluciones.html"
            )
        );

        container.appendChild(
            card(
                "📋",
                "Movimientos",
                "Consulta entradas y salidas de inventario.",
                "movimientos.html"
            )
        );
    }
}

/* =========================
   LOGIN
========================= */

function irLogin(){

    if (estaEnPages) {

        window.location.href =
            "./login.html";

    } else {

        window.location.href =
            "./pages/login.html";
    }
}

/* =========================
   LOGOUT
========================= */

function logout(){

    localStorage.removeItem("rol");

    localStorage.removeItem("usuario");

    alert("Sesión cerrada");

    window.location.href =
        estaEnPages
            ? "../index.html"
            : "index.html";
}