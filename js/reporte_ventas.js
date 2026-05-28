document.addEventListener(

    "DOMContentLoaded",

    () => {

        obtenerVentas();

    }

);

let ventasGlobal = [];

/* OBTENER VENTAS */

async function obtenerVentas(){

    try{

        const response =

            await fetch(
                'http://localhost:3000/ventas'
            );

        ventasGlobal =
            await response.json();

        mostrarVentas(ventasGlobal);

    }catch(error){

        console.log(error);

    }

}

/* MOSTRAR VENTAS */

function mostrarVentas(ventas){

    let tabla =

        document.getElementById(
            "tablaVentas"
        );

    tabla.innerHTML = "";

    let totalGeneral = 0;

    if(ventas.length === 0){

        tabla.innerHTML = `

            <tr>

                <td colspan="4">

                    No hay ventas

                </td>

            </tr>

        `;

        return;

    }

    ventas.forEach(v => {

        totalGeneral += Number(v.total);

        tabla.innerHTML += `

            <tr>

                <td>

                    ${v.id_venta}

                </td>

                <td>

                    ${v.nombre}

                </td>

                <td>

                    ${new Date(v.fecha_venta)
                        .toLocaleDateString('es-MX')}

                </td>

                <td>

                    $${Number(v.total)
                        .toLocaleString('es-MX')}

                </td>

            </tr>

        `;

    });

    document.getElementById(
        "totalGeneral"
    ).textContent =

        `$${totalGeneral.toLocaleString('es-MX')}`;

}

/* FILTRAR */

function filtrar(){

    const fecha =

        document.getElementById(
            "filtroFecha"
        ).value;

    if(!fecha){

        mostrarVentas(
            ventasGlobal
        );

        return;

    }

    const filtradas =

        ventasGlobal.filter(v => {

            const fechaVenta =

                new Date(v.fecha_venta)
                .toISOString()
                .split('T')[0];

            return fechaVenta === fecha;

        });

    mostrarVentas(filtradas);

}