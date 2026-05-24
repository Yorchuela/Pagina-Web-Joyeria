let carrito = [];

let total = 0;

/* ========================= */
/* CARGAR PRODUCTOS */
/* ========================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        cargarProductos();

    }

);

async function cargarProductos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

        const select =

            document.getElementById(
                "producto"
            );

        select.innerHTML = `

            <option value="">

                Seleccionar producto

            </option>

        `;

        productos.forEach(p => {

            /* SOLO DISPONIBLES */

            if (

                p.estado_producto ===
                'Disponible'

            ) {

                select.innerHTML += `

                    <option
                        value="${p.id_producto}"
                    >

                        ${p.nombre_producto}

                        -

                        $

                        ${Number(p.precio)
                        .toLocaleString('es-MX')}

                    </option>

                `;

            }

        });

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* AGREGAR AL CARRITO */
/* ========================= */

async function agregarAlCarrito() {

    const id_producto =

        document.getElementById(
            "producto"
        ).value;

    if (id_producto === "") {

        alert(
            'Selecciona un producto'
        );

        return;

    }

    /* EVITAR DUPLICADOS */

    const existe = carrito.find(

        p => p.id_producto ==
            id_producto

    );

    if (existe) {

        alert(
            'Producto ya agregado'
        );

        return;

    }

    try {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

        const producto = productos.find(

            p => p.id_producto ==
                id_producto

        );

        carrito.push({

            id_producto:
                producto.id_producto,

            nombre_producto:
                producto.nombre_producto,

            precio:
                producto.precio

        });

        mostrarCarrito();

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* MOSTRAR CARRITO */
/* ========================= */

function mostrarCarrito() {

    const tabla =

        document.getElementById(
            "carritoTabla"
        );

    tabla.innerHTML = "";

    total = 0;

    carrito.forEach((item, index) => {

        total += Number(item.precio);

        tabla.innerHTML += `

            <tr>

                <td>

                    ${item.nombre_producto}

                </td>

                <td>

                    $

                    ${Number(item.precio)
                .toLocaleString('es-MX')}

                </td>

                <td>

                    $

                    ${Number(item.precio)
                .toLocaleString('es-MX')}

                </td>

                <td>

                    <button
                        onclick="eliminarItem(${index})"
                    >

                        🗑

                    </button>

                </td>

            </tr>

        `;

    });

    document.getElementById(
        "total"
    ).textContent =

        Number(total)
            .toLocaleString('es-MX');

}

/* ========================= */
/* ELIMINAR */
/* ========================= */

function eliminarItem(index) {

    const confirmar = confirm(

        '¿Eliminar producto?'

    );

    if (!confirmar) {

        return;

    }

    carrito.splice(index, 1);

    mostrarCarrito();

}

/* ========================= */
/* FINALIZAR VENTA */
/* ========================= */

async function finalizarVenta() {

    if (carrito.length === 0) {

        alert(
            'Carrito vacío'
        );

        return;

    }

    const metodo_pago =

        document.getElementById(
            "pago"
        ).value;

    try {

        const response =

            await fetch(

                'http://localhost:3000/ventas',

                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        id_cliente: 1,

                        carrito,
                        metodo_pago

                    })

                }

            );

        const data =
            await response.json();

        if (data.success) {

            alert(
                'Venta registrada correctamente'
            );

            carrito = [];

            mostrarCarrito();

            cargarProductos();

        }

    } catch (error) {

        console.log(error);

    }

}