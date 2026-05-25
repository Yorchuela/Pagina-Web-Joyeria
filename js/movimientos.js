document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarProductos();
        mostrarMovimientos();


    }
);

/* CARGAR PRODUCTOS */

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

            <option disabled selected>

                Seleccione producto

            </option>

        `;

        productos.forEach(p => {

            select.innerHTML += `

                <option value="${p.id_producto}">

                    ${p.nombre_producto}

                </option>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

async function registrarMovimiento(e) {

    e.preventDefault();

    const id_producto =

        document.getElementById(
            "producto"
        ).value;

    const tipo_movimiento =

        document.getElementById(
            "tipo"
        ).value;

    const cantidad =

        document.getElementById(
            "cantidad"
        ).value;

    const motivo =

        document.getElementById(
            "motivo"
        ).value;

    const id_usuario =

        localStorage.getItem(
            "id_usuario"
        );

    try {

        const response =

            await fetch(

                'http://localhost:3000/movimientos',

                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        id_producto,
                        tipo_movimiento,
                        motivo,
                        cantidad,
                        id_usuario

                    })

                }

            );

        const data =
            await response.json();

        if (data.success) {

            alert(
                'Movimiento registrado'
            );
            mostrarMovimientos();

            document.querySelector(
                "form"
            ).reset();

        }

    } catch (error) {

        console.log(error);

    }

}
/* MOSTRAR HISTORIAL */

async function mostrarMovimientos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/movimientos'
            );

        const movimientos =
            await response.json();

        const tabla =

            document.getElementById(
                "tablaMovimientos"
            );

        tabla.innerHTML = "";

        movimientos.forEach(m => {

            tabla.innerHTML += `

                <tr>

                    <td>

                        ${m.nombre_producto}

                    </td>

                    <td>

                        ${m.tipo_movimiento}

                    </td>

                    <td>

                        ${m.cantidad}

                    </td>

                    <td>

                        ${m.motivo}

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}