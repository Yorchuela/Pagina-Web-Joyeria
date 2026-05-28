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

                    <td colspan="6">

                        No hay compras registradas

                    </td>

                </tr>

            `;

            return;
        }

        tabla.innerHTML = "";

        data.historial.forEach(compra => {

            tabla.innerHTML += `

                <tr>

                    <td>

                        ${new Date(
                            compra.fecha_venta
                        ).toLocaleDateString()}

                    </td>

                    <td>
                        ${compra.nombre_producto}
                    </td>

                    <td>
                        ${compra.cantidad}
                    </td>

                    <td>
                        $${compra.precio_unitario}
                    </td>

                    <td>
                        $${compra.total}
                    </td>

                    <td>

                        <span class="estado">

                            ${compra.estado_venta}

                        </span>

                    </td>

                </tr>

            `;
        });

    } catch (error) {

        console.log(error);

        alert("Error servidor");

    }

}

cargarHistorial();