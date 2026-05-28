const usuario =
    JSON.parse(localStorage.getItem("usuario"));

const tabla =
    document.getElementById("tablaHistorial");

async function cargarHistorial() {

    try {

        const response =

            await fetch(

                `http://localhost:3000/historial-cliente/${usuario.id_usuario}`

            );

        const data =
            await response.json();

        if (!data.success) {

            alert("Error cargando historial");

            return;

        }

        if (data.historial.length === 0) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="4">

                        No tienes compras registradas

                    </td>

                </tr>

            `;

            return;
        }

        tabla.innerHTML = "";
        let totalGastado = 0;

        let totalProductos = 0;

        data.historial.forEach(compra => {
            totalGastado += Number(compra.total);

            totalProductos += Number(compra.cantidad);

            tabla.innerHTML += `

                <tr>

                    <td>

                        ${new Date(
                compra.fecha_venta
            ).toLocaleDateString('es-MX')}

                    </td>

                    <td>
                        ${compra.nombre_producto}
                    </td>

                    <td>
                        ${compra.cantidad}
                    </td>

                    <td>

                        $${Number(
                compra.total
            ).toLocaleString('es-MX')}

                    </td>

                </tr>

            `;
        });
        document.getElementById(
            "totalCompras"
        ).textContent = data.historial.length;

        document.getElementById(
            "totalGastado"
        ).textContent =

            '$' +

            totalGastado.toLocaleString('es-MX');

        document.getElementById(
            "productosComprados"
        ).textContent = totalProductos;

    }

    catch (error) {

        console.log(error);

        alert("Error servidor");

    }

}
function activarBuscador() {

    const buscador =

        document.getElementById(
            "buscador"
        );

    buscador.addEventListener(

        "input",

        () => {

            const texto =

                buscador.value.toLowerCase();

            const filas =

                document.querySelectorAll(
                    "#tablaHistorial tr"
                );

            filas.forEach(fila => {

                const contenido =

                    fila.textContent.toLowerCase();

                fila.style.display =

                    contenido.includes(texto)

                    ?

                    ""

                    :

                    "none";

            });

        }

    );

}

cargarHistorial();
activarBuscador();
