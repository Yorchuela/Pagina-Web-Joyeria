// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {
    mostrarCaja();
});

// 🔥 MOSTRAR REPORTE
function mostrarCaja(ventasFiltradas = null) {

    let ventas = ventasFiltradas || JSON.parse(localStorage.getItem("ventas")) || [];
    let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

    let tabla = document.getElementById("tablaCaja");

    let totalIngresos = 0;
    let totalEgresos = 0;

    tabla.innerHTML = "";

    // 🔥 AGRUPAR POR FECHA
    let cajaPorFecha = {};

    ventas.forEach(v => {

        let fecha = v.fecha || "Sin fecha";

        if (!cajaPorFecha[fecha]) {
            cajaPorFecha[fecha] = { ingresos: 0, egresos: 0 };
        }

        cajaPorFecha[fecha].ingresos += v.total;
        totalIngresos += v.total;
    });

    devoluciones.forEach(d => {

        let fecha = d.fecha || "Sin fecha";

        if (!cajaPorFecha[fecha]) {
            cajaPorFecha[fecha] = { ingresos: 0, egresos: 0 };
        }

        // 🔥 calcular dinero devuelto (aprox)
        let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
        let venta = ventas.find(v => v.id == d.idVenta);

        if (venta) {
            let producto = venta.productos.find(p => p.nombre == d.producto);
            if (producto) {
                let monto = producto.precio * d.cantidad;
                cajaPorFecha[fecha].egresos += monto;
                totalEgresos += monto;
            }
        }
    });

    // 🔥 MOSTRAR TABLA
    for (let fecha in cajaPorFecha) {

        let ingreso = cajaPorFecha[fecha].ingresos;
        let egreso = cajaPorFecha[fecha].egresos;
        let ganancia = ingreso - egreso;

        let fila = `
            <tr>
                <td>${fecha}</td>
                <td>$${ingreso}</td>
                <td>$${egreso}</td>
                <td>$${ganancia}</td>
            </tr>
        `;

        tabla.innerHTML += fila;
    }

    document.getElementById(

        "cardIngresos"

    ).textContent =

        `$${Number(totalIngresos)
            .toLocaleString('es-MX')}`;

    document.getElementById(

        "cardEgresos"

    ).textContent =

        `$${Number(totalEgresos)
            .toLocaleString('es-MX')}`;

    document.getElementById(

        "cardGanancia"

    ).textContent =

        `$${Number(totalIngresos - totalEgresos)
            .toLocaleString('es-MX')}`;
}

// 🔍 FILTRO
function filtrarCaja(){

    const tipoReporte =

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

    const mesInput =

        document.getElementById(
            "mesInput"
        ).value;

    const anioInput =

        document.getElementById(
            "anioInput"
        ).value;

    let ventas =

        JSON.parse(
            localStorage.getItem("ventas")
        ) || [];

    let filtradas = ventas.filter(v => {

        if(!v.fecha){

            return false;

        }

        const fechaVenta =

            new Date(v.fecha);

        const fechaTexto =

            fechaVenta
            .toISOString()
            .split('T')[0];

        /* 📅 DIARIO */

        if(tipoReporte === "diario"){

            return fechaTexto === fechaInicio;

        }

        /* 🗓 SEMANAL */

        if(tipoReporte === "semanal"){

            return (

                fechaTexto >= fechaInicio

                &&

                fechaTexto <= fechaFin

            );

        }

        /* 📆 MENSUAL */

        if(tipoReporte === "mensual"){

            const mesVenta =

                fechaVenta
                .toISOString()
                .slice(0,7);

            return mesVenta === mesInput;

        }

        /* 🧾 ANUAL */

        if(tipoReporte === "anual"){

            return fechaVenta
                .getFullYear()
                .toString() === anioInput;

        }

        /* ⚙ PERSONALIZADO */

        if(tipoReporte === "personalizado"){

            return (

                (!fechaInicio || fechaTexto >= fechaInicio)

                &&

                (!fechaFin || fechaTexto <= fechaFin)

            );

        }

        return true;

    });

    console.log(filtradas);

    mostrarCaja(filtradas);

}