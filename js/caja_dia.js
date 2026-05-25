document.addEventListener(
    "DOMContentLoaded",
    cargarCaja
);

async function cargarCaja(){

    try{

        const id_usuario =

            localStorage.getItem(
                "id_usuario"
            );

        const response =

            await fetch(

                `http://localhost:3000/caja-dia/${id_usuario}`

            );

        const data =
            await response.json();

        document.getElementById(
            "efectivo"
        ).textContent =

            `$${Number(data.efectivo)
                .toLocaleString('es-MX')}`;

        document.getElementById(
            "tarjeta"
        ).textContent =

            `$${Number(data.tarjeta)
                .toLocaleString('es-MX')}`;

        document.getElementById(
            "total"
        ).textContent =

            `$${Number(data.total)
                .toLocaleString('es-MX')}`;

        document.getElementById(
            "ventas"
        ).textContent =

            data.cantidadVentas;

        document.getElementById(
            "devoluciones"
        ).textContent =

            data.devoluciones;

        const tabla =

            document.getElementById(
                "tablaCaja"
            );

        tabla.innerHTML = "";

        data.historial.forEach(v => {

            tabla.innerHTML += `

                <tr>

                    <td>

                        #${v.id_venta}

                    </td>

                    <td>

                        ${v.nombre_metodo}

                    </td>

                    <td>

                        $${Number(v.total)
                            .toLocaleString('es-MX')}

                    </td>

                    <td>

                        ${v.fecha_venta}

                    </td>

                </tr>

            `;

        });

    } catch(error){

        console.log(error);

    }

}