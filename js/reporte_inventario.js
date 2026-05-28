let inventarioActual = [];
document.addEventListener(

    "DOMContentLoaded",

    () => {

        cargarCategorias();

        filtrarInventario();

    }

);

/* =========================
   CARGAR CATEGORIAS
========================= */

async function cargarCategorias() {

    try {

        const response =

            await fetch(

                'http://localhost:3000/categorias'

            );

        const categorias =

            await response.json();

        const select =

            document.getElementById(
                "filtroCategoria"
            );

        categorias.forEach(c => {

            select.innerHTML += `

                <option value="${c.nombre_categoria}">

                    ${c.nombre_categoria}

                </option>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================
   FILTRAR
========================= */

async function filtrarInventario() {

    const categoria =

        document.getElementById(
            "filtroCategoria"
        ).value;

    const estado =

        document.getElementById(
            "filtroEstado"
        ).value;

    const busqueda =

        document.getElementById(
            "busqueda"
        ).value;

    try {

        const response =

            await fetch(

                `http://localhost:3000/reporte-inventario?categoria=${categoria}&estado=${estado}&busqueda=${busqueda}`

            );

        const productos =

            await response.json();

        mostrarInventario(productos);

    }

    catch (error) {

        console.log(error);

    }

}

/* =========================
   MOSTRAR INVENTARIO
========================= */

function mostrarInventario(productos) {
    inventarioActual = productos;

    const tabla =

        document.getElementById(
            "tablaInventario"
        );

    tabla.innerHTML = "";

    let total = 0;

    productos.forEach(p => {

        total += Number(p.precio);

        tabla.innerHTML += `

            <tr>

                <td>${p.id_producto}</td>

                <td>

                    <button class="btn-ver"

                        onclick='verDetalle(${JSON.stringify(p)})'>

                        👁

                    </button>

                </td>

                <td>${p.nombre_producto}</td>

                <td>${p.nombre_categoria}</td>

                <td>${p.kilataje}K</td>

                <td>

                    <span class="estado ${p.estado_producto}">

                        ${p.estado_producto}

                    </span>

                </td>

                <td>

                    ${formatearDinero(p.precio)}

                </td>

            </tr>

        `;

    });

    document.getElementById(
        "totalPiezas"
    ).textContent = productos.length;

    document.getElementById(
        "valorInventario"
    ).textContent =

        total.toLocaleString(
            'es-MX',
            {
                minimumFractionDigits: 2
            }
        );

}

/* =========================
   FORMATO DINERO
========================= */

function formatearDinero(valor) {

    return '$' +

        Number(valor).toLocaleString(

            'es-MX',

            {

                minimumFractionDigits: 2

            }

        );

}

/* =========================
   VER DETALLE
========================= */

function verDetalle(p) {

    document.getElementById(

        "modalDetalle"

    ).style.display = "flex";

    document.getElementById(

        "detalleProducto"

    ).innerHTML = `

        <p><b>Producto:</b>
        ${p.nombre_producto}</p>

        <p><b>Descripción:</b>
        ${p.descripcion}</p>

        <p><b>Serie:</b>
        ${p.serie}</p>

        <p><b>Certificado:</b>
        ${p.certificado_autenticidad}</p>

        <p><b>Kilataje:</b>
        ${p.kilataje}K</p>

        <p><b>Estado:</b>
        ${p.estado_producto}</p>

        <p><b>Precio:</b>
        ${formatearDinero(p.precio)}</p>

        <p><b>Fecha registro:</b>
        ${new Date(p.fecha_registro).toLocaleDateString()}</p>

    `;

}

/* =========================
   CERRAR MODAL
========================= */

function cerrarModal() {

    document.getElementById(

        "modalDetalle"

    ).style.display = "none";

}

/* LIMPIAR*/

function limpiarFiltros() {

    document.getElementById(
        "busqueda"
    ).value = "";

    document.getElementById(
        "filtroCategoria"
    ).value = "";

    document.getElementById(
        "filtroEstado"
    ).value = "";

    filtrarInventario();

}
async function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    /* FECHA */

    const fecha = new Date();

    const fechaActual =

        fecha.toLocaleDateString();

    /* TITULO */

    doc.setFontSize(22);

    doc.setTextColor(40);

    doc.text(
        "JOYERIA WEB",
        14,
        20
    );

    /* SUBTITULO */

    doc.setFontSize(14);

    doc.text(
        "Reporte de Inventario",
        14,
        30
    );

    /* FECHA */

    doc.setFontSize(11);

    doc.text(
        `Fecha de exportación: ${fechaActual}`,
        14,
        40
    );

    /* TABLA */

    const filas = [];

    document.querySelectorAll(
        "#tablaInventario tr"
    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        if(columnas.length > 0){

            filas.push([

                columnas[0].textContent.trim(),
                columnas[2].textContent.trim(),
                columnas[3].textContent.trim(),
                columnas[4].textContent.trim(),
                columnas[5].textContent.trim()

            ]);

        }

    });

    /* TABLA PDF */

    doc.autoTable({

        startY: 55,

        head: [[

            "ID",
            "PRODUCTO",
            "CATEGORIA",
            "KILATAJE",
            "ESTADO"

        ]],

        body: filas,

        styles: {

            fontSize: 10

        },

        headStyles: {

            fillColor: [131,135,195]

        }

    });

    /* TOTALES */

    const totalPiezas = filas.length;

    let totalInventario = 0;

    inventarioActual.forEach(p => {

        totalInventario += Number(p.precio);

    });

    doc.text(

        `Total piezas: ${totalPiezas}`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    doc.text(

        `Valor inventario: $${totalInventario.toLocaleString()}`,

        14,

        doc.lastAutoTable.finalY + 25

    );

    /* GUARDAR */

    doc.save(
        "reporte_inventario.pdf"
    );

}
function exportarExcel() {

    const datos = [];

    inventarioActual.forEach(p => {

        datos.push({

            ID: p.id_producto,

            Producto: p.nombre_producto,

            Categoria: p.nombre_categoria,

            Kilataje: p.kilataje + "K",

            Estado: p.estado_producto,

            Precio: `$${Number(p.precio).toLocaleString()}`

        });

    });

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        libro,

        hoja,

        "Inventario"

    );

    XLSX.writeFile(

        libro,

        "reporte_inventario.xlsx"

    );

}