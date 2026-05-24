const params =

    new URLSearchParams(
        window.location.search
    );

const id_categoria =

    params.get(
        'id_categoria'
    );
console.log(
    'ID CATEGORIA:',
    id_categoria
);
let listaProductos = [];
document.addEventListener(

    "DOMContentLoaded",

    mostrarProductos

);

async function mostrarProductos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();
            console.log(productos);
        let productosFiltrados =
            productos;

        if (id_categoria) {

            productosFiltrados =

                productos.filter(

                    p =>

                        Number(p.id_categoria)

                        ===

                        Number(id_categoria)

                );

        }
        listaProductos = productosFiltrados;

        const contenedor =

            document.getElementById(
                'contenedorProductos'
            );

        contenedor.innerHTML = "";

        productosFiltrados.forEach(p => {
            contenedor.innerHTML += `

            <div class="card">

                <img
                    src="${p.ruta_imagen

                    ?

                    'http://localhost:3000' +
                    p.ruta_imagen

                    :

                    'https://via.placeholder.com/300'}"
                >

                <div class="card-contenido">

                    <h3>

                        ${p.nombre_producto}

                    </h3>

                    <p>

                        ${p.descripcion || ''}

                    </p>
                     <p>

                    <strong>
                        Kilataje:
                    </strong>

                    ${parseInt(p.kilataje) || 'N/A'}K

                </p>

                    <p class="precio">

                        $${Number(p.precio).toLocaleString()}

                    </p>

                </div>

                <button
                    onclick="agregarCarrito(${p.id_producto})"
                >

                    Agregar al carrito

                </button>

            </div>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* AGREGAR CARRITO */
/* ========================= */

function agregarCarrito(idProducto){

    let carrito = JSON.parse(

        localStorage.getItem(
            'carrito'
        )

    ) || [];

    const producto = listaProductos.find(

        p =>

        p.id_producto == idProducto

    );

    if(!producto){

        alert(
            'Producto no encontrado'
        );

        return;

    }

    const existe = carrito.find(

        p =>

        p.id_producto ===
        producto.id_producto

    );

    /* PRODUCTO YA EXISTE */

    if(existe){

        alert(
            'Este producto ya está en el carrito'
        );

        return;

    }

    /* AGREGAR PRODUCTO */

    carrito.push({

        id_producto:
        producto.id_producto,

        nombre_producto:
        producto.nombre_producto,

        descripcion:
        producto.descripcion,

        kilataje:
        producto.kilataje,

        serie:
        producto.serie,

        certificado_autenticidad:
        producto.certificado_autenticidad,

        ruta_imagen:
        producto.ruta_imagen,

        precio:
        producto.precio,

        cantidad:1

    });

    localStorage.setItem(

        'carrito',

        JSON.stringify(carrito)

    );

    alert(
        'Producto agregado al carrito'
    );

}

    /* VALIDAR SESION */

    document.addEventListener(
        "DOMContentLoaded",
        validarSesion
    );

    function validarSesion() {

        const rol =
            localStorage.getItem('rol');

        const btnLogin =
            document.getElementById('btnLogin');

        if (rol && rol !== 'Invitado') {

            btnLogin.textContent =
                'Cerrar sesión';

            btnLogin.href =
                '#';

            btnLogin.onclick =
                cerrarSesion;

        }


    /* ========================= */
    /* CERRAR SESION */
    /* ========================= */

    function cerrarSesion() {

        localStorage.removeItem('rol');

        localStorage.removeItem('id_cliente');

        alert(
            'Sesión cerrada'
        );

        window.location.href =
            '/pages/login.html';

    }
}
/* ========================= */
/* MOSTRAR USUARIO */
/* ========================= */

const rol =

localStorage.getItem(
    'rol'
) || 'Invitado';

const usuarioHTML =

document.getElementById(
    'rolUsuario'
);

const btnLogin =

document.getElementById(
    'btnLogin'
);

usuarioHTML.textContent =
rol;

if(rol !== 'Invitado'){

    btnLogin.textContent =
    'Cerrar sesión';

    btnLogin.href = '#';

    btnLogin.onclick = () => {

        localStorage.clear();

        alert(
            'Sesión cerrada'
        );

        window.location.reload();

    };

}