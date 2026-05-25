document.addEventListener("DOMContentLoaded", mostrarClientes);
let listaClientes = [];
let clienteSeleccionado = null;
/* GUARDAR CLIENTE */

async function guardarCliente(e) {

    e.preventDefault();

    const apellido_paterno = document.getElementById("ap").value;

    const apellido_materno = document.getElementById("am").value;

    const nombre = document.getElementById("nombre").value;

    const correo = document.getElementById("correo").value;

    const telefono = document.getElementById("telefono").value;

    try {

        const response = await fetch('http://localhost:3000/clientes', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                apellido_paterno,
                apellido_materno,
                nombre,
                correo,
                telefono,
                id_rol: 4

            })

        });

        const data = await response.json();

        if (data.success) {

            alert('Cliente agregado');

            mostrarClientes();

            document.querySelector("form").reset();

        }

    } catch (error) {

        console.log(error);

    }

}

/* MOSTRAR CLIENTES */

async function mostrarClientes() {

    try {

        const response =
            await fetch('http://localhost:3000/clientes');

        const clientes =
            await response.json();
            listaClientes = clientes;

        cargarTabla(clientes);

    } catch (error) {

        console.log(error);

    }

}

// ✏️ EDITAR
function editarCliente(id){

    const cliente =
        listaClientes.find(
            c => c.id_usuario == id
        );

    if(!cliente){

        return;

    }

    clienteSeleccionado = cliente;

    document.getElementById("modalEditar")
        .style.display = "block";

    document.getElementById("editId")
        .value = cliente.id_usuario;

    document.getElementById("editNombre")
        .value = cliente.nombre;

    document.getElementById("editApellidoP")
        .value = cliente.apellido_paterno || "";

    document.getElementById("editApellidoM")
        .value = cliente.apellido_materno || "";

    document.getElementById("editCorreo")
        .value = cliente.correo;

    document.getElementById("editTelefono")
        .value = cliente.telefono || "";

}

async function eliminarCliente(id){

    const confirmar =
        confirm("¿Eliminar cliente?");

    if(!confirmar){

        return;

    }

    try{

        const response =
            await fetch(
                `http://localhost:3000/clientes/${id}`,
                {
                    method:'DELETE'
                }
            );

        const data =
            await response.json();

        if(data.success){

            alert("Cliente eliminado");

            mostrarClientes();

        }

    } catch(error){

        console.log(error);

    }

}

// 🔍 BUSCAR
async function buscarClientes() {

    const texto =
        document.getElementById("buscador").value;

    const tipo =
        document.getElementById("tipoBusqueda").value;

    try {

        const response =
            await fetch(
                `http://localhost:3000/clientes/buscar?tipo=${tipo}&texto=${texto}`
            );

        const clientes = await response.json();

        cargarTabla(clientes);

    } catch (error) {

        console.log(error);

    }

}
function cargarTabla(clientes) {

    const tabla =
        document.getElementById("tablaClientes");

    tabla.innerHTML = "";

    clientes.forEach(c => {

        tabla.innerHTML += `
        
            <tr>

    <td>${c.nombre}</td>

    <td>${c.apellido_paterno || ''}</td>

    <td>${c.apellido_materno || ''}</td>

    <td>${c.correo}</td>

    <td>${c.telefono || ''}</td>

    <td>
        ${c.fecha_registro
                ?
                new Date(c.fecha_registro)
                    .toLocaleDateString()
                :
                ''
            }
    </td>

    <td>

        <div class="acciones">

            <button class="btn-editar" onclick="editarCliente(${c.id_usuario})">
                Editar
            </button>

        <button
            class="btn-eliminar"
            onclick="eliminarCliente(${c.id_usuario})"
        >
            Eliminar
        </button>

        </div>

    </td>

</tr>
        
        `;

    });

}
function cerrarModal(){

    document.getElementById("modalEditar")
        .style.display = "none";

}
async function guardarEdicion(){

    const id =
        document.getElementById("editId").value;

    const nombre =
        document.getElementById("editNombre").value;

    const apellido_paterno =
        document.getElementById("editApellidoP").value;

    const apellido_materno =
        document.getElementById("editApellidoM").value;

    const correo =
        document.getElementById("editCorreo").value;

    const telefono =
        document.getElementById("editTelefono").value;

    try{

        const response =
            await fetch(
                `http://localhost:3000/clientes/${id}`,
                {

                    method:'PUT',

                    headers:{
                        'Content-Type':'application/json'
                    },

                    body: JSON.stringify({

                        nombre,
                        apellido_paterno,
                        apellido_materno,
                        correo,
                        telefono

                    })

                }
            );

        const data =
            await response.json();

        if(data.success){

            alert("Cliente actualizado");

            cerrarModal();

            mostrarClientes();

        }

    } catch(error){

        console.log(error);

    }

}
