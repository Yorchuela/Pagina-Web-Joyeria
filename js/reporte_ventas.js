let ventasActuales = [];
document.addEventListener(

    "DOMContentLoaded",

    () => {

        colocarFechaActual();

        configurarFiltros();

        filtrar();

    }

);

/* FECHA ACTUAL */

function colocarFechaActual() {

    const hoy = new Date()

        .toISOString()

        .split("T")[0];

    document.getElementById(
        "fechaInicio"
    ).value = hoy;

    document.getElementById(
        "fechaFin"
    ).value = hoy;

}

/* CONFIGURAR FILTROS */

function configurarFiltros() {

    const tipo =

        document.getElementById(
            "tipoReporte"
        );

    const fechaInicio =

        document.getElementById(
            "fechaInicio"
        );

    const fechaFin =

        document.getElementById(
            "fechaFin"
        );

    const mesInput =

        document.getElementById(
            "mesInput"
        );

    const anioInput =

        document.getElementById(
            "anioInput"
        );

    tipo.addEventListener(

        "change",

        () => {

            const valor = tipo.value;

            /* OCULTAR TODO */

            fechaInicio.style.display = "none";

            fechaFin.style.display = "none";

            mesInput.style.display = "none";

            anioInput.style.display = "none";

            /* DIARIO */

            if (valor === 'diario') {

                fechaInicio.style.display = "block";

            }

            /* SEMANAL */

            else if (valor === 'semanal') {

                fechaInicio.style.display = "block";

            }

            /* MENSUAL */

            else if (valor === 'mensual') {

                mesInput.style.display = "block";

            }

            /* ANUAL */

            else if (valor === 'anual') {

                anioInput.style.display = "block";

            }

            /* PERSONALIZADO */

            else if (valor === 'personalizado') {

                fechaInicio.style.display = "block";

                fechaFin.style.display = "block";

            }

        }

    );

    tipo.dispatchEvent(

        new Event("change")

    );

}

/* FILTRAR */

async function filtrar() {

    const tipo =

        document.getElementById(
            "tipoReporte"
        ).value;

    const fechaInicio =

        document.getElementById(
            "fechaInicio"
        ).value;

    const fechaFin =

        document.getElementById(
            "fechaFin"
        ).value;

    const mes =

        document.getElementById(
            "mesInput"
        ).value;

    const anio =

        document.getElementById(
            "anioInput"
        ).value;
    /* VALIDAR AÑO */

    if (
        tipo === "anual"
    ) {

        if (
            anio.length !== 4
        ) {

            alert(
                "El año debe tener 4 dígitos"
            );

            return;

        }

    }

    try {

        const response =

            await fetch(

                `http://localhost:3000/reporte-ventas?tipo=${tipo}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&mes=${mes}&anio=${anio}`

            );

        const ventas =

            await response.json();
        if (!Array.isArray(ventas)) {

            console.log(ventas);

            return;
        }

        mostrarVentas(
            ventas
        );

    }

    catch (error) {

        console.log(error);

    }

}

/* MOSTRAR */

function mostrarVentas(ventas) {
    ventasActuales = ventas;

    let tabla =

        document.getElementById(
            "tablaVentas"
        );

    let totalGeneral = 0;

    tabla.innerHTML = "";

    if (ventas.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="7">

                    No hay ventas

                </td>

            </tr>

        `;

        document.getElementById(
            "totalGeneral"
        ).textContent = "$0";

        return;

    }

    ventas.forEach(v => {

        totalGeneral += Number(v.total);

        tabla.innerHTML += `

            <tr>

                <td>

                    ${v.id_producto}

                </td>

                <td>
                 <button

            class="btn-ver"

            onclick='abrirModal(${JSON.stringify(v)})'

        >

            👁

        </button>

    </td>

    <td>

        <span>

            ${v.nombre_producto}

        </span>

    

                <td>

                    ${v.nombre_categoria}

                </td>

                <td>

                    ${v.tipo_venta}

                </td>

                <td>

                    ${new Date(
            v.fecha_venta
        ).toLocaleDateString()}

                </td>

                <td>

                    $${Number(
            v.total
        ).toLocaleString(
            'es-MX',
            {
                minimumFractionDigits: 2
            }
        )}

                </td>

            </tr>

        `;

    });

    document.getElementById(
        "totalGeneral"
    ).textContent =

        Number(totalGeneral)

            .toLocaleString(

                'es-MX',

                {
                    minimumFractionDigits: 2
                }

            );

}

/* LIMPIAR */

function limpiarFiltros() {

    colocarFechaActual();

    document.getElementById(
        "tipoReporte"
    ).value = "diario";

    filtrar();

}
/* ABRIR MODAL */

function abrirDetalle(v) {

    document.getElementById(
        "modalDetalle"
    ).style.display = "flex";

    document.getElementById(
        "detalleVenta"
    ).innerHTML = `

        <p>
            <b>Producto:</b>
            ${v.nombre_producto}
        </p>

        <p>
            <b>Serie:</b>
            ${v.serie}
        </p>

        <p>
            <b>Certificado:</b>
            ${v.certificado_autenticidad}
        </p>

        <p>
            <b>Kilataje:</b>
            ${v.kilataje}
        </p>

        <p>
            <b>Descripción:</b>
            ${v.descripcion}
        </p>

        <p>
            <b>Estado:</b>
            ${v.estado_producto}
        </p>

        <p>
            <b>Usuario:</b>
            ${v.usuario}
        </p>

        <p>
            <b>Método pago:</b>
            ${v.metodo_pago}
        </p>

        <p>
            <b>Fecha venta:</b>

            ${new Date(
        v.fecha_venta
    ).toLocaleDateString()}

        </p>

        <p>

            <b>Total:</b>

            $${Number(
        v.total
    ).toLocaleString(
        'es-MX',
        {
            minimumFractionDigits: 2
        }
    )}

        </p>

    `;

}

/* CERRAR MODAL */

function cerrarModal() {

    document.getElementById(
        "modalDetalle"
    ).style.display = "none";

}
/* =========================
EXPORTAR PDF
========================= */

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

        "Reporte de Ventas",

        14,

        30

    );

    /* FECHA EXPORTACION */

    doc.setFontSize(11);

    doc.text(

        `Fecha de exportación: ${fechaActual}`,

        14,

        40

    );

    /* TABLA */

    const filas = [];

    document.querySelectorAll(

        "#tablaVentas tr"

    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        if (columnas.length > 0) {

            filas.push([

                columnas[0].textContent.trim(),

                columnas[2].textContent.trim(),

                columnas[3].textContent.trim(),

                columnas[4].textContent.trim(),

                columnas[5].textContent.trim(),

                columnas[6].textContent.trim()

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

            "TIPO VENTA",

            "FECHA",

            "TOTAL"

        ]],

        body: filas,

        styles: {

            fontSize: 10

        },

        headStyles: {

            fillColor: [131, 135, 195]

        }

    });

    /* TOTAL */

    let totalGeneral = 0;

    ventasActuales.forEach(v => {

        totalGeneral += Number(v.total);

    });

    doc.text(

        `Total ventas: $${totalGeneral.toLocaleString()}`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    /* GUARDAR */

    doc.save(

        "reporte_ventas.pdf"

    );

}
/* =========================
   EXPORTAR EXCEL
========================= */

function exportarExcel() {

    const datos = [];

    /* RECORRER TABLA */

    document.querySelectorAll(

        "#tablaVentas tr"

    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        if (columnas.length > 0) {

            datos.push({

                "ID":

                    columnas[0].textContent.trim(),

                "Producto":

                    columnas[2].textContent.trim(),

                "Categoría":

                    columnas[3].textContent.trim(),

                "Tipo Venta":

                    columnas[4].textContent.trim(),

                "Fecha Venta":

                    columnas[5].textContent.trim(),

                "Total":

                    columnas[6].textContent.trim()

            });

        }

    });

    /* CREAR HOJA */

    const hoja = XLSX.utils.json_to_sheet(

        datos

    );

    /* ANCHO COLUMNAS */

    hoja["!cols"] = [

        { wch: 10 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 18 },
        { wch: 18 }

    ];

    /* CREAR LIBRO */

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        libro,

        hoja,

        "Reporte Ventas"

    );

    /* DESCARGAR */

    XLSX.writeFile(

        libro,

        "reporte_ventas.xlsx"

    );

}
/* EXPORTAR EXCEL */

function exportarExcel(){

    const datos = [];

    document.querySelectorAll(

        "#tablaCaja tr"

    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        if(columnas.length > 0){

            datos.push({

                Fecha:
                    columnas[0].textContent,

                Ventas:
                    columnas[1].textContent,

                Efectivo:
                    columnas[2].textContent,

                Tarjeta:
                    columnas[3].textContent,

                Egresos:
                    columnas[4].textContent,

                Ganancia:
                    columnas[5].textContent

            });

        }

    });

    const wb =
        XLSX.utils.book_new();

    const ws =
        XLSX.utils.json_to_sheet(
            datos
        );

    XLSX.utils.book_append_sheet(

        wb,
        ws,
        "Reporte Caja"

    );

    XLSX.writeFile(

        wb,

        "reporte_caja.xlsx"

    );

}
/* EXPORTAR PDF */

async function exportarPDF(){

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    /* FECHA */

    const fecha =
        new Date();

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

        "Reporte de Caja",

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

        "#tablaCaja tr"

    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        if(columnas.length > 0){

            filas.push([

                columnas[0].textContent,
                columnas[1].textContent,
                columnas[2].textContent,
                columnas[3].textContent,
                columnas[4].textContent,
                columnas[5].textContent

            ]);

        }

    });

    /* TABLA PDF */

    doc.autoTable({

        startY: 60,

        head:[[
            "FECHA",
            "VENTAS",
            "EFECTIVO",
            "TARJETA",
            "EGRESOS",
            "GANANCIA"
        ]],

        body: filas,

        styles: {

            fontSize:10

        },

        headStyles: {

            fillColor:[131,135,195]

        }

    });

    /* TOTALES */

    doc.text(

        `Ingresos: ${document.getElementById("cardIngresos").textContent}`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    doc.text(

        `Egresos: ${document.getElementById("cardEgresos").textContent}`,

        14,

        doc.lastAutoTable.finalY + 25

    );

    doc.text(

        `Ganancia: ${document.getElementById("cardGanancia").textContent}`,

        14,

        doc.lastAutoTable.finalY + 35

    );

    /* GUARDAR */

    doc.save(

        "reporte_caja.pdf"

    );

}