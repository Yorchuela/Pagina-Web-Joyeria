document.addEventListener(

    "DOMContentLoaded",

    () => {

        configurarFiltros();

        filtrarCaja();

    }

);

/* FORMATO DINERO */

function dinero(valor) {

    return Number(valor).toLocaleString(

        "es-MX",

        {

            style: "currency",

            currency: "MXN"

        }

    );

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

            /* OCULTAR TODO */

            fechaInicio.style.display =
                "none";

            fechaFin.style.display =
                "none";

            mesInput.style.display =
                "none";

            anioInput.style.display =
                "none";

            /* DIARIO */

            if (
                tipo.value === "diario"
            ) {

                fechaInicio.style.display =
                    "block";

            }

            /* SEMANAL */

            else if (
                tipo.value === "semanal"
            ) {

                fechaInicio.style.display =
                    "block";

            }

            /* MENSUAL */

            else if (
                tipo.value === "mensual"
            ) {

                mesInput.style.display =
                    "block";

            }

            /* ANUAL */

            else if (
                tipo.value === "anual"
            ) {

                anioInput.style.display =
                    "block";

            }

            /* PERSONALIZADO */

            else if (
                tipo.value === "personalizado"
            ) {

                fechaInicio.style.display =
                    "block";

                fechaFin.style.display =
                    "block";

            }

        }

    );

    tipo.dispatchEvent(

        new Event("change")

    );

}
/* VALIDAR AÑO */

document.getElementById(

    "anioInput"

).addEventListener(

    "input",

    function () {

        if (
            this.value.length > 4
        ) {

            this.value =
                this.value.slice(0, 4);

        }

    }

);

/* FILTRAR */

async function filtrarCaja() {

    try {

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

        const response =
            await fetch(

                `http://localhost:3000/reporte-caja?tipo=${tipo}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&mes=${mes}&anio=${anio}`

            );

        const datos =
            await response.json();

        mostrarCaja(datos);

    }

    catch (error) {

        console.log(error);

    }

}
/* FORMATEAR FECHA */

function formatearFecha(fecha){

    return new Date(fecha)

    .toLocaleDateString(

        "es-MX",

        {

            day:"2-digit",
            month:"2-digit",
            year:"numeric"

        }

    );

}
/* MOSTRAR */

function mostrarCaja(datos) {

    const tabla =
        document.getElementById(
            "tablaCaja"
        );

    tabla.innerHTML = "";

    let ingresos = 0;
    let egresos = 0;

    datos.forEach(c => {

        ingresos +=
            Number(c.ingresos);

        const ganancia =
            Number(c.ingresos);

        tabla.innerHTML += `

            <tr>

                <td>

                    ${formatearFecha(c.fecha)}
                </td>

                <td>

                    ${c.ventas}

                </td>

                <td>

                    ${dinero(c.efectivo)}

                </td>

                <td>

                    ${dinero(c.tarjeta)}

                </td>

                <td>

                    ${dinero(0)}

                </td>

                <td>

                    ${dinero(ganancia)}

                </td>

            </tr>

        `;

    });

    document.getElementById(
        "cardIngresos"
    ).textContent =
        dinero(ingresos);

    document.getElementById(
        "cardEgresos"
    ).textContent =
        dinero(egresos);

    document.getElementById(
        "cardGanancia"
    ).textContent =
        dinero(
            ingresos - egresos
        );

}

/* LIMPIAR */

function limpiarFiltros() {

    location.reload();

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