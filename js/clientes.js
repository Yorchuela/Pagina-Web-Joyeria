document.addEventListener("DOMContentLoaded", mostrarClientes);

function guardarCliente(e) {
    e.preventDefault();

    const ap = document.getElementById("ap").value;
    const am = document.getElementById("am").value;
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    c.telefono.toString().includes(texto)

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    // ✏️ EDITAR
    if (editIndex !== "") {
        clientes[editIndex] = { nombre, correo, telefono };
    } else {
        // ➕ NUEVO
        clientes.push({ nombre, correo, telefono });
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));

    alert("Cliente guardado");

    e.target.reset();
    document.getElementById("editIndex").value = "";

    mostrarClientes();
}

// 📋 MOSTRAR
function mostrarClientes(lista = null) {
    const tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = "";

    let clientes = lista || JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach((c, index) => {
        const fila = `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.correo}</td>
                <td>${c.telefono}</td>
                <td>
                    <button onclick="editarCliente(${index})">Editar</button>
                    <button onclick="eliminarCliente(${index})">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

// ✏️ EDITAR
function editarCliente(index) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const c = clientes[index];

    document.getElementById("nombre").value = c.nombre;
    document.getElementById("correo").value = c.correo;
    document.getElementById("telefono").value = c.telefono;
    document.getElementById("editIndex").value = index;
}

// 🗑 ELIMINAR
function eliminarCliente(index) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.splice(index, 1);

    localStorage.setItem("clientes", JSON.stringify(clientes));

    mostrarClientes();
}

// 🔍 BUSCAR
function buscarClientes() {
    const texto = document.getElementById("buscador").value.toLowerCase();

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.correo.toLowerCase().includes(texto)
    );

    mostrarClientes(filtrados);
}