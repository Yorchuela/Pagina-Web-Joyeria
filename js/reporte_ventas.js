<<<<<<< HEAD
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
=======
// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {

    mostrarVentas();

});

// 🔥 MOSTRAR TODAS LAS VENTAS
async function mostrarVentas(ventasFiltradas = null) {

    try {
>>>>>>> frontend2

        let ventas = ventasFiltradas;

<<<<<<< HEAD
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
=======
        // 🔥 SI NO HAY FILTROS TRAER DEL BACKEND
        if (!ventas) {
>>>>>>> frontend2

            const response = await fetch(
                "http://localhost:3000/ventas"
            );

<<<<<<< HEAD
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
=======
            ventas = await response.json();

        }

        const tabla =
            document.getElementById("tablaVentas");

        tabla.innerHTML = "";

        let totalGeneral = 0;

        // 🔥 SI NO HAY VENTAS
        if (ventas.length === 0) {

            tabla.innerHTML = `
            
                <tr>
                    <td colspan="6">
                        No hay ventas registradas
                    </td>
                </tr>

            `;

            document.getElementById(
                "totalGeneral"
            ).textContent = "$0.00";

            return;

        }

        // 🔥 RECORRER VENTAS
        ventas.forEach(v => {

            totalGeneral += Number(v.total);

            let fila = `
            
                <tr>

                    <td>
                        ${v.id_venta}
                    </td>

                    <td>
                        ${v.nombre}
                    </td>

                    <td>
                        $${Number(v.total).toFixed(2)}
                    </td>

                    <td>
                        ${new Date(v.fecha_venta)
                            .toLocaleDateString()}
                    </td>

                    <td>
                        ${new Date(v.fecha_venta)
                            .toLocaleTimeString()}
                    </td>

                    <td>
                        <button
                            class="btn-ver"
                            onclick="verProductos(${v.id_venta})"
                        >
                            👁
                        </button>
                    </td>

                </tr>

            `;

            tabla.innerHTML += fila;

        });
>>>>>>> frontend2

        // 🔥 TOTAL GENERAL
        document.getElementById(
            "totalGeneral"
        ).textContent =
            `$${totalGeneral.toFixed(2)}`;

    } catch (error) {

        console.error(
            "Error cargando ventas:",
            error
        );

    }

<<<<<<< HEAD
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

=======
}

// 🔍 FILTRAR POR FECHA
async function filtrar() {

    try {

        const fecha =
            document.getElementById(
                "filtroFecha"
            ).value;

        const response = await fetch(
            "http://localhost:3000/ventas"
        );

        let ventas =
            await response.json();

        // 🔥 SI NO HAY FECHA
        if (!fecha) {

            mostrarVentas();

            return;

        }

        let filtradas = ventas.filter(v => {

            let fechaVenta =
                new Date(v.fecha_venta)
                .toISOString()
                .split("T")[0];

            return fechaVenta === fecha;

        });

        mostrarVentas(filtradas);

    } catch (error) {

        console.error(
            "Error filtrando ventas:",
            error
        );

    }

}

// 👁 VER PRODUCTOS DE LA VENTA
async function verProductos(idVenta) {

    try {

        const response = await fetch(
            `http://localhost:3000/ventas/${idVenta}/productos`
        );

        const productos =
            await response.json();

        let contenido = "";

        productos.forEach(p => {

            contenido += `
            
                <div class="producto-detalle">

                    <p>
                        <strong>Producto:</strong>
                        ${p.nombre_producto}
                    </p>

                    <p>
                        <strong>Precio:</strong>
                        $${Number(
                            p.precio_unitario
                        ).toFixed(2)}
                    </p>

                    <hr>

                </div>

            `;

        });

        document.getElementById(
            "detalleProductos"
        ).innerHTML = contenido;

        document.getElementById(
            "modalProductos"
        ).style.display = "flex";

    } catch (error) {

        console.error(
            "Error obteniendo productos:",
            error
        );

    }

}

// ❌ CERRAR MODAL
function cerrarModal() {

    document.getElementById(
        "modalProductos"
    ).style.display = "none";

}

// 📗 EXPORTAR EXCEL
document.querySelector(".btn-excel")
.addEventListener("click", exportarExcel);

function exportarExcel() {

    const tabla =
        document.querySelector("table");

    const wb =
        XLSX.utils.table_to_book(tabla);

    XLSX.writeFile(
        wb,
        "Reporte_Ventas.xlsx"
    );

}

// 📕 EXPORTAR PDF
document.querySelector(".btn-pdf")
.addEventListener("click", exportarPDF);

function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text(
        "Reporte de Ventas",
        14,
        15
    );

    doc.autoTable({

        html: "table",

        startY: 25

    });

    doc.save(
        "Reporte_Ventas.pdf"
    );

>>>>>>> frontend2
}