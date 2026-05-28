/* =========================
   OBTENER DATOS
========================= */

const rol =
    localStorage.getItem("rol") || "Invitado";

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

        <a href="${link}">
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
        <a href="${estaEnPages ? '../index.html' : 'index.html'}">
            Inicio
        </a>

        <a href="${
            estaEnPages
                ? './categorias.html'
                : './pages/categorias.html'
        }">
            Categorías
        </a>

        <a href="${
            estaEnPages
                ? './catalogo.html'
                : './pages/catalogo.html'
        }">
            Productos
        </a>

        <a href="${
            estaEnPages
                ? './carrito.html'
                : './pages/carrito.html'
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
        dashboard.style.display = "block";
    }

    if (categorias) {
        categorias.style.display = "none";
        categorias.style.display = "none";
    }

    if (tituloHero) {
        tituloHero.textContent =
            "Bienvenido a YORCH JEWELRY";
            "Bienvenido a YORCH JEWELRY";
    }

    if (textoHero) {
        textoHero.textContent =
            "Explora nuestros productos exclusivos";
            "Explora nuestros productos exclusivos";
    }

    if (btnHero) {


        btnHero.textContent =
            "Comprar ahora";

        btnHero.onclick = () => {

            window.location.href =
                estaEnPages
                    ? "./catalogo.html"
                    : "./pages/catalogo.html";
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
            "./pages/catalogo.html"
        )
    );

    container.appendChild(
        card(
            "📂",
            "Categorías",
            "Consulta productos por categorías.",
            "./pages/categorias.html"
        )
    );

    container.appendChild(
        card(
            "🛒",
            "Carrito",
            "Revisa y administra tus compras.",
            "./pages/carrito.html"
        )
    );

    container.appendChild(
        card(
            "💎",
            "Colecciones",
            "Descubre piezas exclusivas y nuevas.",
            "./pages/catalogo.html"
        )
    );

        btnHero.onclick = () => {

            window.location.href =
                estaEnPages
                    ? "./catalogo.html"
                    : "./pages/catalogo.html";
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
            "./pages/catalogo.html"
        )
    );

    container.appendChild(
        card(
            "📂",
            "Categorías",
            "Consulta productos por categorías.",
            "./pages/categorias.html"
        )
    );

    container.appendChild(
        card(
            "🛒",
            "Carrito",
            "Revisa y administra tus compras.",
            "./pages/carrito.html"
        )
    );

    container.appendChild(
        card(
            "💎",
            "Colecciones",
            "Descubre piezas exclusivas y nuevas.",
            "./pages/catalogo.html"
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

    menu.innerHTML = `
        <a href="index.html">
            Inicio
        </a>

        <a href="./pages/clientes.html"
           id="clientes">
            Clientes
        </a>

        <a href="./pages/productos.html"
           id="productos">
            Productos
        </a>

        <a href="./pages/reporte_ventas.html"
           id="ventas">
            Ventas
        </a>

        <a href="./pages/reporte_caja.html"
        <a href="./pages/reporte_caja.html"
           id="reportes">
            Reportes
        </a>
    `;

    /* =========================
       ADMINISTRADOR
    ========================= */

    if (rol === "Administrador") {


        menu.innerHTML += `
            <a href="./pages/dashboard.html">
                Panel Administrador
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
                    "./pages/dashboard.html";
            };
        }
            <a href="./pages/dashboard.html">
                Panel Administrador
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
                    "./pages/dashboard.html";
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
                "./pages/reporte_ventas.html"
            )
        );

        container.appendChild(
            card(
                "📦",
                "Inventario",
                "Administra productos y stock disponible.",
                "./pages/movimientos.html"
            )
        );

        container.appendChild(
            card(
                "👤",
                "Clientes",
                "Consulta clientes registrados y compras.",
                "./pages/clientes.html"
            )
        );

        container.appendChild(
            card(
                "📊",
                "Reportes",
                "Visualiza estadísticas y reportes del negocio.",
                "./pages/Reporte_caja.html"
            )
        );

        container.appendChild(
            card(
                "⚙️",
                "Usuarios",
                "Gestiona permisos y usuarios del sistema.",
                "./pages/usuarios.html"
            )
        );

        container.appendChild(
            card(
                "🛍️",
                "Productos",
                "Gestiona el catálogo de productos.",
                "./pages/productos.html"
            )
        );
    }

    /* =========================
       VENDEDOR
    ========================= */

    if (rol === "Vendedor") {

        menu.innerHTML += `
            <a href="./pages/dashboard_cajero.html">
                Panel Cajero
            </a>
        `;

        const reportes =
            document.getElementById("reportes");

        if (reportes) {
            reportes.style.display = "none";
        }

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
                    "./pages/reporte_ventas.html";
            };
        }

        if (bienvenida) {
            bienvenida.textContent =
                "Panel de Cajero";
        }

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
                    "./pages/reporte_ventas.html";
            };
        }

        if (bienvenida) {
            bienvenida.textContent =
                "Panel de Cajero";
        }
    }

    /* =========================
       INVENTARIO
    ========================= */

    if (rol === "Inventario") {

        menu.innerHTML += `
            <a href="./pages/dashboard_almacen.html">
                Panel Almacén
            </a>
        `;

        setTimeout(() => {

            const ventas =
                document.getElementById("ventas");

            const clientes =
                document.getElementById("clientes");

            const reportes =
                document.getElementById("reportes");

            if (ventas) {
                ventas.style.display = "none";
            }

            if (clientes) {
                clientes.style.display = "none";
            }

            if (reportes) {
                reportes.style.display = "none";
            }

        }, 0);

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
                    "./pages/dashboard_almacen.html";
            };
        }

        if (bienvenida) {
            bienvenida.textContent =
                "Panel de Inventario";
        }

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
                    "./pages/dashboard_almacen.html";
            };
        }

        if (bienvenida) {
            bienvenida.textContent =
                "Panel de Inventario";
        }
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