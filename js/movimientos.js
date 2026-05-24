document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    mostrarMovimientos();
});

// 🔽 Cargar productos en select
function cargarProductos() {
    const select = document.getElementById("producto");
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    select.innerHTML = '<option disabled selected>Seleccione producto</option>';

    productos.forEach((p, index) => {
        select.innerHTML += `<option value="${index}">
            ${p.nombre} (Stock: ${p.stock})
        </option>`;
    });
}

// ➕ Registrar movimiento
function registrarMovimiento(e) {
    e.preventDefault();

    const index = document.getElementById("producto").value;
    const tipo = document.getElementById("tipo").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const motivo = document.getElementById("motivo").value;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    let producto = productos[index];

    // VALIDAR STOCK
    if (tipo === "salida" && producto.stock < cantidad) {
        alert("Stock insuficiente");
        return;
    }

    // ACTUALIZAR STOCK
    if (tipo === "entrada") {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    productos[index] = producto;
    localStorage.setItem("productos", JSON.stringify(productos));

    // GUARDAR MOVIMIENTO
    movimientos.push({
        producto: producto.nombre,
        tipo,
        cantidad,
        motivo
    });

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    alert("Movimiento guardado");

    e.target.reset();
    cargarProductos();
    mostrarMovimientos();
}

// 📋 Mostrar historial
function mostrarMovimientos() {
    const tabla = document.getElementById("tablaMovimientos");
    tabla.innerHTML = "";

    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    movimientos.forEach(m => {
        tabla.innerHTML += `
            <tr>
                <td>${m.producto}</td>
                <td>${m.tipo}</td>
                <td>${m.cantidad}</td>
                <td>${m.motivo}</td>
            </tr>
        `;
    });
}