// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {
    mostrarVentas();
});

// 🔥 MOSTRAR TODAS LAS VENTAS
function mostrarVentas(ventasFiltradas = null){

    let ventas = ventasFiltradas || JSON.parse(localStorage.getItem("ventas")) || [];
    let tabla = document.getElementById("tablaVentas");
    let totalGeneral = 0;

    tabla.innerHTML = "";

    if(ventas.length === 0){
        tabla.innerHTML = "<tr><td colspan='3'>No hay ventas registradas</td></tr>";
        document.getElementById("totalGeneral").textContent = 0;
        return;
    }

    ventas.forEach(v => {

        if(!v.productos) return;

        v.productos.forEach(p => {

            let total = p.precio * p.cantidad;
            totalGeneral += total;

            let fila = `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>$${total}</td>
                </tr>
            `;

            tabla.innerHTML += fila;
        });

    });

    document.getElementById("totalGeneral").textContent = totalGeneral;
}

// 🔍 FILTRAR POR FECHA
function filtrar(){

    let fecha = document.getElementById("filtroFecha").value;
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    if(!fecha){
        mostrarVentas();
        return;
    }

    let filtradas = ventas.filter(v => v.fecha === fecha);

    mostrarVentas(filtradas);
}