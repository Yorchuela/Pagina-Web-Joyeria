document.addEventListener("DOMContentLoaded", mostrarProductos);

// ➕ GUARDAR / EDITAR
function guardarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const editIndex = document.getElementById("editIndex").value;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (editIndex !== "") {
        productos[editIndex] = { nombre, categoria, precio, stock };
    } else {
        productos.push({ nombre, categoria, precio, stock });
    }

    localStorage.setItem("productos", JSON.stringify(productos));

    alert("Producto guardado");

    e.target.reset();
    document.getElementById("editIndex").value = "";

    mostrarProductos();
}

// 📋 MOSTRAR
function mostrarProductos(lista = null) {
    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    let productos = lista || JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach((p, index) => {
        const fila = `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${p.precio}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${index})">Editar</button>
                    <button onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

// ✏️ EDITAR
function editarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const p = productos[index];

    document.getElementById("nombre").value = p.nombre;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("editIndex").value = index;
}

// 🗑 ELIMINAR
function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.splice(index, 1);

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos();
}

// 🔍 BUSCAR
function buscarProductos() {
    const texto = document.getElementById("buscador").value.toLowerCase();

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto) ||
        p.precio.toString().includes(texto) ||
        p.stock.toString().includes(texto)
    );

    mostrarProductos(filtrados);
}