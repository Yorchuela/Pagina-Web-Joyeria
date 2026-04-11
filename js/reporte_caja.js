// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {
    mostrarCaja();
});

// 🔥 MOSTRAR REPORTE
function mostrarCaja(ventasFiltradas = null){

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

        if(!cajaPorFecha[fecha]){
            cajaPorFecha[fecha] = { ingresos: 0, egresos: 0 };
        }

        cajaPorFecha[fecha].ingresos += v.total;
        totalIngresos += v.total;
    });

    devoluciones.forEach(d => {

        let fecha = d.fecha || "Sin fecha";

        if(!cajaPorFecha[fecha]){
            cajaPorFecha[fecha] = { ingresos: 0, egresos: 0 };
        }

        // 🔥 calcular dinero devuelto (aprox)
        let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
        let venta = ventas.find(v => v.id == d.idVenta);

        if(venta){
            let producto = venta.productos.find(p => p.nombre == d.producto);
            if(producto){
                let monto = producto.precio * d.cantidad;
                cajaPorFecha[fecha].egresos += monto;
                totalEgresos += monto;
            }
        }
    });

    // 🔥 MOSTRAR TABLA
    for(let fecha in cajaPorFecha){

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

    document.getElementById("ingresos").textContent = totalIngresos;
    document.getElementById("egresos").textContent = totalEgresos;
    document.getElementById("ganancia").textContent = totalIngresos - totalEgresos;
}

// 🔍 FILTRO
function filtrarCaja(){

    let fecha = document.getElementById("filtroFecha").value;
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    if(!fecha){
        mostrarCaja();
        return;
    }

    let filtradas = ventas.filter(v => v.fecha === fecha);

    mostrarCaja(filtradas);
}