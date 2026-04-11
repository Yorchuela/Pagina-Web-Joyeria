let carrito = [];
let total = 0;

// 🔄 Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// 🔽 CARGAR PRODUCTOS EN SELECT
function cargarProductos() {
    const select = document.getElementById("producto");
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    select.innerHTML = '<option value="">Selecciona producto</option>';

    productos.forEach((p, index) => {
        select.innerHTML += `
            <option value="${index}">
                ${p.nombre} - $${p.precio} (Stock: ${p.stock})
            </option>
        `;
    });
}

// ➕ AGREGAR AL CARRITO
function agregarAlCarrito() {
    const index = document.getElementById("producto").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (index === "" || !cantidad || cantidad <= 0) {
        alert("Selecciona producto y cantidad válida");
        return;
    }

    let producto = productos[index];

    // 🔴 Validar stock
    if (producto.stock < cantidad) {
        alert("Stock insuficiente");
        return;
    }

    const subtotal = producto.precio * cantidad;

    carrito.push({
        index,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        subtotal
    });

    mostrarCarrito();
    document.getElementById("cantidad").value = "";
}

// 📋 MOSTRAR CARRITO
function mostrarCarrito() {
    const tabla = document.getElementById("carritoTabla");
    tabla.innerHTML = "";

    total = 0;

    carrito.forEach((item, i) => {
        total += item.subtotal;

        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio}</td>
                <td>${item.cantidad}</td>
                <td>$${item.subtotal}</td>
                <td><button onclick="eliminarItem(${i})">X</button></td>
            </tr>
        `;
    });

    actualizarTotal();
}

// ❌ ELIMINAR PRODUCTO DEL CARRITO
function eliminarItem(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

// 💸 APLICAR DESCUENTO
function actualizarTotal() {
    let descuento = parseFloat(document.getElementById("descuento").value) || 0;

    let totalFinal = total;

    if (descuento > 0) {
        totalFinal = total - (total * (descuento / 100));
    }

    document.getElementById("total").textContent = totalFinal.toFixed(2);
}

// 🔄 Detectar cambio en descuento
document.addEventListener("input", (e) => {
    if (e.target.id === "descuento") {
        actualizarTotal();
    }
});

// 💰 FINALIZAR VENTA
function finalizarVenta() {
    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    let descuento = parseFloat(document.getElementById("descuento").value) || 0;
    let metodoPago = document.getElementById("pago").value;

    let totalFinal = parseFloat(document.getElementById("total").textContent);

    // 🔻 Actualizar stock
    carrito.forEach(item => {
        productos[item.index].stock -= item.cantidad;
    });

    localStorage.setItem("productos", JSON.stringify(productos));

    // 💾 Guardar venta
    const nuevaVenta = {
        fecha: new Date().toLocaleString(),
        items: carrito,
        total: totalFinal,
        descuento,
        metodoPago
    };

    ventas.push(nuevaVenta);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    alert("Venta registrada correctamente");

    // 🧹 Reset
    carrito = [];
    total = 0;

    document.getElementById("carritoTabla").innerHTML = "";
    document.getElementById("total").textContent = "0";
    document.getElementById("descuento").value = "";

    cargarProductos();
}

