document.addEventListener("DOMContentLoaded", mostrarClientes);

/* GUARDAR CLIENTE */

async function guardarCliente(e){

    e.preventDefault();

    const apellido_paterno = document.getElementById("ap").value;

    const apellido_materno = document.getElementById("am").value;

    const nombre = document.getElementById("nombre").value;

    const correo = document.getElementById("correo").value;

    const telefono = document.getElementById("telefono").value;

    try{

        const response = await fetch('http://localhost:3000/clientes', {

            method:'POST',

            headers:{
                'Content-Type':'application/json'
            },

            body: JSON.stringify({

                apellido_paterno,
                apellido_materno,
                nombre,
                correo,
                telefono

            })

        });

        const data = await response.json();

        if(data.success){

            alert('Cliente agregado');

            mostrarClientes();

            document.querySelector("form").reset();

        }

    } catch(error){

        console.log(error);

    }

}

/* MOSTRAR CLIENTES */

async function mostrarClientes(){

    try{

        const response = await fetch('http://localhost:3000/clientes');

        const clientes = await response.json();

        const tabla = document.getElementById("tablaClientes");

        tabla.innerHTML = "";

        clientes.forEach(c => {

            tabla.innerHTML += `
            
                <tr>
                    <td>${c.nombre}</td>
                    <td>${c.correo}</td>
                    <td>${c.telefono}</td>
                </tr>
            
            `;

        });

    } catch(error){

        console.log(error);

    }

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