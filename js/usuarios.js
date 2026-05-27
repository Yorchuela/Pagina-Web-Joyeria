/* ========================= */
/* PROTEGER PAGINA */
/* ========================= */

protegerPagina(["Administrador"]);

/* ========================= */
/* VARIABLES */
/* ========================= */

let listaUsuarios = [];

/* ========================= */
/* INICIAR */
/* ========================= */

document.addEventListener(

    "DOMContentLoaded",

    obtenerUsuarios

);

/* ========================= */
/* OBTENER USUARIOS */
/* ========================= */

async function obtenerUsuarios() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/usuarios'
            );

        const usuarios =
            await response.json();

        listaUsuarios = usuarios;

        renderUsuarios(usuarios);

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* RENDER TABLA */
/* ========================= */

function renderUsuarios(usuarios) {

    const tabla =

        document.getElementById(
            'tablaUsuarios'
        );

    tabla.innerHTML = "";

    usuarios.forEach(u => {

        tabla.innerHTML += `

        <tr>

            <td>

                ${u.id_usuario}

            </td>

            <td>

                ${u.nombre}

            </td>

            <td>

                ${u.apellido_paterno || ''}

            </td>

            <td>

                ${u.apellido_materno || ''}

            </td>

            <td>

                ${u.correo}

            </td>

            <td>

                ${u.telefono || 'N/A'}

            </td>

            <td>

                ${u.nombre_rol}

            </td>

            <td>

                ${u.activo == 1

                ?

                `<span class="estado-activo">

                        Activo

                    </span>`

                :

                `<span class="estado-inactivo">

                        Inactivo

                    </span>`
            }

            </td>

            <td>

                ${new Date(
                u.fecha_registro
            ).toLocaleDateString()
            }

            </td>

            <td>

                <div class="acciones">

                    <button
                        class="btn-editar"
                        onclick="editarUsuario(${u.id_usuario})"
                    >

                        ✏ Editar

                    </button>

                    ${u.activo == 1

                ?

                `<button
                            class="btn-desactivar"
                            onclick="desactivarUsuario(${u.id_usuario})"
                        >

                            🔒 Desactivar

                        </button>`

                :

                `<button
                            class="btn-activar"
                            onclick="activarUsuario(${u.id_usuario})"
                        >

                            🔓 Activar

                        </button>`
            }

                </div>

            </td>

        </tr>

        `;

    });

}

/* ========================= */
/* BUSCAR */
/* ========================= */

function buscarUsuarios() {

    const texto =

        document.getElementById(
            'buscador'
        ).value.toLowerCase();

    const filtrados =

        listaUsuarios.filter(u =>

            u.nombre.toLowerCase().includes(texto)

            ||

            u.correo.toLowerCase().includes(texto)

        );

    renderUsuarios(filtrados);

}

/* ========================= */
/* ABRIR MODAL CREAR */
/* ========================= */

function abrirModalCrear() {

    document.getElementById(
        'tituloModal'
    ).textContent =

        'Nuevo Usuario';

    document.getElementById(
        'formUsuario'
    ).reset();

    document.getElementById(
        'id_usuario'
    ).value = "";

    document.getElementById(
        'modalUsuario'
    ).style.display =

        'flex';

}

/* ========================= */
/* CERRAR MODAL */
/* ========================= */

function cerrarModal() {

    document.getElementById(
        'modalUsuario'
    ).style.display =

        'none';

}

/* ========================= */
/* GUARDAR */
/* ========================= */

document.getElementById(

    'formUsuario'

).addEventListener(

    'submit',

    guardarUsuario

);

async function guardarUsuario(e) {

    e.preventDefault();
    /* PASSWORDS */

    const password =

        document.getElementById(
            'password'
        ).value;

    const confirmar_password =

        document.getElementById(
            'confirmar_password'
        ).value;

    /* VALIDAR PASSWORD */

    if (password !== confirmar_password) {

        alert(
            'Las contraseñas no coinciden'
        );

        return;

    }

    /* VALIDAR NOMBRE */

    const nombre =

        document.getElementById(
            'nombre'
        ).value;

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!regexNombre.test(nombre)) {

        alert(
            'El nombre solo debe contener letras'
        );

        return;

    }

    /* VALIDAR TELEFONO */

    const telefono =

        document.getElementById(
            'telefono'
        ).value;

    const regexTelefono = /^[0-9]+$/;

    if (
        telefono &&
        !regexTelefono.test(telefono)
    ) {

        alert(
            'El teléfono solo debe contener números'
        );

        return;

    }

    /* VALIDAR PASSWORD MINIMA */

    if (
        password &&
        password.length < 6
    ) {

        alert(
            'La contraseña debe tener mínimo 6 caracteres'
        );

        return;

    }

    const id_usuario =

        document.getElementById(
            'id_usuario'
        ).value;

    const datos = {

        nombre:
            document.getElementById(
                'nombre'
            ).value,

        apellido_paterno:
            document.getElementById(
                'apellido_paterno'
            ).value,

        apellido_materno:
            document.getElementById(
                'apellido_materno'
            ).value,

        correo:
            document.getElementById(
                'correo'
            ).value,

        telefono:
            document.getElementById(
                'telefono'
            ).value,

        password: password,

        id_rol:
            document.getElementById(
                'id_rol'
            ).value

    };

    try {

        let response;

        /* CREAR */

        if (!id_usuario) {

            response = await fetch(

                'http://localhost:3000/usuarios',

                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body: JSON.stringify(datos)

                }

            );

        }

        /* EDITAR */

        else {

            response = await fetch(

                `http://localhost:3000/usuarios/${id_usuario}`,

                {

                    method: 'PUT',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body: JSON.stringify(datos)

                }

            );

        }

        const resultado =
            await response.json();

        if (resultado.success) {

            alert(

                id_usuario

                    ?

                    'Usuario actualizado'

                    :

                    'Usuario creado'

            );

            cerrarModal();

            obtenerUsuarios();

        }

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* EDITAR */
/* ========================= */

function editarUsuario(id) {

    const usuario =

        listaUsuarios.find(

            u => u.id_usuario == id

        );

    if (!usuario) return;

    document.getElementById(
        'tituloModal'
    ).textContent =

        'Editar Usuario';

    document.getElementById(
        'id_usuario'
    ).value =

        usuario.id_usuario;

    document.getElementById(
        'nombre'
    ).value =

        usuario.nombre;

    document.getElementById(
        'apellido_paterno'
    ).value =

        usuario.apellido_paterno || '';

    document.getElementById(
        'apellido_materno'
    ).value =

        usuario.apellido_materno || '';

    document.getElementById(
        'correo'
    ).value =

        usuario.correo;

    document.getElementById(
        'telefono'
    ).value =

        usuario.telefono || '';

    document.getElementById(
        'id_rol'
    ).value =

        usuario.id_rol;

    document.getElementById(
        'password'
    ).value = "";
    document.getElementById(
        'confirmar_password'
    ).value = "";

    document.getElementById(
        'modalUsuario'
    ).style.display =

        'flex';

}

/* ========================= */
/* DESACTIVAR */
/* ========================= */

async function desactivarUsuario(id) {

    const confirmar = confirm(

        '¿Desactivar usuario?'

    );

    if (!confirmar) return;

    try {

        const response = await fetch(

            `http://localhost:3000/usuarios/desactivar/${id}`,

            {

                method: 'PUT'

            }

        );

        const resultado =
            await response.json();

        if (resultado.success) {

            alert(
                'Usuario desactivado'
            );

            obtenerUsuarios();

        }

    } catch (error) {

        console.log(error);

    }

}

/* ========================= */
/* ACTIVAR */
/* ========================= */

async function activarUsuario(id) {

    try {

        const response = await fetch(

            `http://localhost:3000/usuarios/activar/${id}`,

            {

                method: 'PUT'

            }

        );

        const resultado =
            await response.json();

        if (resultado.success) {

            alert(
                'Usuario activado'
            );

            obtenerUsuarios();

        }

    } catch (error) {

        console.log(error);

    }

}
/* ========================= */
/* MOSTRAR PASSWORD */
/* ========================= */

function togglePassword(id, icono) {

    const input =

        document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";

        icono.textContent = "🙈";

    }

    else {

        input.type = "password";

        icono.textContent = "👁";

    }

}