const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

console.log(
    path.join(__dirname, 'uploads')
);

/* MULTER */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/');

    },

    filename: (req, file, cb) => {

        cb(

            null,

            Date.now() +
            path.extname(file.originalname)

        );

    }

});

const upload = multer({

    storage: storage

});
/* NODEMAILER */

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

/* REGISTRAR MOVIMIENTO INVENTARIO */

app.post('/movimientos', (req, res) => {

    const {

        id_producto,
        tipo_movimiento,
        motivo,
        cantidad,
        id_usuario

    } = req.body;

    const sql = `

        INSERT INTO movimientos_inventario (

            id_producto,
            id_usuario,
            tipo_movimiento,
            motivo,
            cantidad

        )

        VALUES (?,?,?,?,?)

    `;

    db.query(

        sql,

        [

            id_producto,
            id_usuario,
            tipo_movimiento,
            motivo,
            cantidad

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }
            res.json({
                success: true
            });

        }

    );

});
/* OBTENER MOVIMIENTOS */

app.get('/movimientos', (req, res) => {

    const {

        fechaInicio,
        fechaFin

    } = req.query;

    let sql = `

    SELECT

        M.id_movimiento,
        P.id_producto,
        M.tipo_movimiento,
        M.cantidad,
        M.motivo,
        M.fecha_movimiento,

        P.nombre_producto,

        U.nombre

    FROM movimientos_inventario M

    INNER JOIN productos P
    ON M.id_producto = P.id_producto

    INNER JOIN usuarios U
    ON M.id_usuario = U.id_usuario

`;

    let valores = [];

    if (fechaInicio && fechaFin) {

        sql += `

        WHERE DATE(M.fecha_movimiento)

        BETWEEN ? AND ?

    `;

        valores.push(
            fechaInicio,
            fechaFin
        );

    }

    sql += `

    ORDER BY M.id_movimiento DESC

`;

    db.query(sql, valores, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json(result);

    });

});
/* REPORTE INVENTARIO */

app.get('/reporte-inventario', (req, res) => {

    const {

        categoria,
        estado,
        busqueda

    } = req.query;

    let sql = `

        SELECT

            P.id_producto,
            P.nombre_producto,
            P.descripcion,
            P.serie,
            P.certificado_autenticidad,
            P.kilataje,
            P.precio,
            P.estado_producto,
            P.fecha_registro,

            C.nombre_categoria

        FROM productos P

        INNER JOIN categorias C
        ON P.id_categoria = C.id_categoria

        WHERE 1=1

    `;

    let valores = [];

    if (categoria) {

        sql += `

            AND C.nombre_categoria = ?

        `;

        valores.push(categoria);

    }

    if (estado) {

        sql += `

            AND P.estado_producto = ?

        `;

        valores.push(estado);

    }

    if (busqueda) {

        sql += `

            AND (

            P.nombre_producto LIKE ?

            OR

            P.id_producto LIKE ?
            )
        `;

        valores.push(
            `%${busqueda}%`,
            `%${busqueda}%`
        );

    }

    sql += `

        ORDER BY P.id_producto DESC

    `;

    db.query(sql, valores, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                success: false

            });

        }

        res.json(result);

    });

});
/* SERVIDOR */

app.listen(3000, () => {

    console.log('Servidor corriendo en puerto 3000');

});

/* LOGIN */

app.post('/login', (req, res) => {

    const { correo, password } = req.body;

    const sql = `
    
        SELECT 
            U.id_usuario,
            U.nombre,
            U.correo,
            U.password,
            R.nombre_rol
        FROM Usuarios U
        JOIN Roles R
        ON R.id_rol = U.id_rol
        WHERE U.correo = ?
        AND U.activo = 1
    
    `;

    db.query(sql, [correo], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                success: false,
                message: 'Error servidor'
            });

        } else {

            if (result.length > 0) {

                const usuario = result[0];
                console.log(usuario.password);

                /* COMPARAR PASSWORD */

                const passwordCorrecto = bcrypt.compareSync(password, usuario.password);
                console.log(passwordCorrecto);

                if (passwordCorrecto) {

                    res.json({

                        success: true,
                        usuario: usuario

                    });

                } else {

                    res.json({

                        success: false,
                        message: 'Contraseña incorrecta'

                    });

                }

            } else {

                res.json({

                    success: false,
                    message: 'Usuario no encontrado'

                });

            }
        }
    });

});
/* RECUPERAR CONTRASEÑA */

app.post('/recover-password', (req, res) => {

    const { correo } = req.body;

    const sql = `
    
        SELECT *
        FROM Usuarios
        WHERE correo = ?
    
    `;

    db.query(sql, [correo], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        if (result.length === 0) {

            return res.json({

                success: false,
                message: 'El correo no existe'

            });

        }

        /* GENERAR CÓDIGO */

        const codigo =
            Math.floor(100000 + Math.random() * 900000);

        /* GUARDAR CÓDIGO TEMPORAL */

        global.codigoRecuperacion = codigo.toString().trim();

        global.correoRecuperacion = correo;

        /* ENVIAR CORREO */

        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: correo,

            subject: 'Recuperación de contraseña',

            text:
                `Tu código de recuperación es:

${codigo}`

        };

        try {

            await transporter.sendMail(mailOptions);

            res.json({

                success: true,
                message: 'Código enviado al correo'

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,
                message: 'Error enviando correo'

            });

        }

    });

});
/* VALIDAR CÓDIGO */

app.post('/validar-codigo', (req, res) => {

    const { codigo } = req.body;

    if (
        codigo.toString().trim()
        ===
        global.codigoRecuperacion.toString().trim()
    ) {

        res.json({

            success: true

        });

    } else {

        res.json({

            success: false,
            message: 'Código incorrecto'

        });

    }

});
/* RESET PASSWORD */

app.post('/reset-password', (req, res) => {

    const {
        correo,
        nuevaPassword
    } = req.body;

    /* CIFRAR NUEVA PASSWORD */

    const passwordHash =
        bcrypt.hashSync(nuevaPassword, 10);

    const sql = `
    
        UPDATE Usuarios
        SET password = ?
        WHERE correo = ?
    
    `;

    db.query(
        sql,
        [passwordHash, correo],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,
                    message: 'Error servidor'

                });

            }

            res.json({

                success: true,
                message: 'Contraseña actualizada'

            });

        }
    );

});

/* REGISTRO */

app.post('/register', (req, res) => {

    const {

        correo,
        nombre,
        apellido_paterno,
        apellido_materno,
        telefono,
        password

    } = req.body;

    /* VALIDAR SI YA EXISTE */

    const verificar = `
    
        SELECT *
        FROM Usuarios
        WHERE correo = ?
    
    `;

    db.query(verificar, [correo], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                success: false
            });

            return;

        }

        if (result.length > 0) {

            res.json({

                success: false,
                message: 'El correo ya existe'

            });

        } else {
            const passwordHash = bcrypt.hashSync(password, 10);

            /* INSERTAR USUARIO */

            const sql = `
            
                INSERT INTO Usuarios
                (
                    correo,
                    nombre,
                    apellido_paterno,
                    apellido_materno,
                    telefono,
                    password,
                    id_rol
                )
                VALUES(?,?,?,?,?,?,4)
            
            `;

            db.query(sql,
                [
                    correo,
                    nombre,
                    apellido_paterno,
                    apellido_materno,
                    telefono,
                    passwordHash
                ],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        res.status(500).json({
                            success: false
                        });

                    } else {

                        res.json({

                            success: true,
                            message: 'Cuenta creada correctamente'

                        });

                    }

                });

        }

    });

});

/* AGREGAR PRODUCTO */

app.post('/productos', upload.single('imagen'), (req, res) => {

    const {

        nombre_producto,
        descripcion,
        id_categoria,
        serie,
        certificado_autenticidad,
        kilataje,
        precio,
        estado_producto

    } = req.body;
    const ruta_imagen =

        req.file

            ?

            `/uploads/${req.file.filename}`

            :

            null;

    const sql = `
    
        INSERT INTO Productos(

            nombre_producto,
            descripcion,
            id_categoria,
            serie,
            certificado_autenticidad,
            kilataje,
            precio,
            ruta_imagen,
            estado_producto

        )

        VALUES(?,?,?,?,?,?,?,?,?)
    
    `;

    db.query(

        sql,

        [

            nombre_producto,
            descripcion,
            id_categoria,
            serie,
            certificado_autenticidad,
            kilataje,
            precio,
            ruta_imagen,
            estado_producto

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});


app.use(

    '/uploads',

    express.static(

        path.join(__dirname, 'uploads')

    )

);

/* OBTENER USUARIOS */

app.get('/usuarios', (req, res) => {

    const sql = `
    
        SELECT

            U.id_usuario,
            U.nombre,
            U.apellido_paterno,
            U.apellido_materno,
            U.correo,
            U.telefono,
            U.activo,
            U.fecha_registro,

            R.nombre_rol,
            R.id_rol

        FROM Usuarios U

        INNER JOIN Roles R
        ON U.id_rol = R.id_rol

        ORDER BY U.id_usuario DESC
    
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({

                success: false

            });

        } else {

            res.json(result);

        }

    });

});

/* CREAR USUARIO */


app.post('/usuarios', (req, res) => {

    const {

        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        password,
        id_rol

    } = req.body;
    /* VALIDAR CORREO DUPLICADO */

    const sqlCorreo = `

    SELECT *
    FROM Usuarios
    WHERE correo = ?

`;

    db.query(sqlCorreo, [correo], (err, resultCorreo) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                success: false

            });

        }

        if (resultCorreo.length > 0) {

            return res.json({

                success: false,
                message: 'Correo ya registrado'

            });

        }


        /* ENCRIPTAR PASSWORD */

        const passwordHash =

            bcrypt.hashSync(password, 10);

        const sql = `
    
        INSERT INTO Usuarios (

            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            telefono,
            password,
            id_rol,
            activo

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    
    `;

        db.query(

            sql,

            [

                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                telefono,
                passwordHash,
                id_rol

            ],

            (err, result) => {

                if (err) {

                    console.log(err);

                    res.status(500).json({

                        success: false,
                        message: 'Error al crear usuario'

                    });

                } else {

                    res.json({

                        success: true

                    });

                }

            }

        );
    });

});

/* ACTUALIZAR USUARIO */
app.put('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        id_rol,
        password
    } = req.body;

    /* VALIDAR CORREO DUPLICADO */
    const sqlCorreo = `
        SELECT *
        FROM Usuarios
        WHERE correo = ?
        AND id_usuario != ?

    `;
    db.query(
        sqlCorreo,
        [correo, id],
        (err, resultCorreo) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false
                });
            } if (resultCorreo.length > 0) {
                return res.json({
                    success: false,
                    message: 'Correo ya registrado'
                });
            }
            /* SQL BASE */
            let sql = `
                UPDATE Usuarios 
                SET
            nombre = ?,
            apellido_paterno = ?,
            apellido_materno = ?,
            correo = ?,
            telefono = ?,
            id_rol = ?
            `;
            let valores = [
                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                telefono,
                id_rol
            ];
            /* SI QUIERE CAMBIAR PASSWORD */
            if (password && password.trim() !== '') {
                const passwordHash =
                    bcrypt.hashSync(password, 10);
                sql += `, password = ?
                    `;
                valores.push(passwordHash);
            }
            sql += ` 
                    WHERE id_usuario = ?
                `;
            valores.push(id);
            db.query(
                sql,
                valores,
                (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            success: false
                        });
                    }
                    else {
                        res.json({
                            success: true
                        });
                    }
                }
            );
        }
    );
});
/* DESACTIVAR USUARIO */
app.put('/usuarios/desactivar/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
    
        UPDATE Usuarios
        SET activo = 0
        WHERE id_usuario = ?
    
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({

                success: false

            });

        } else {

            res.json({

                success: true

            });

        }

    });

});
/* ACTIVAR USUARIO */

app.put('/usuarios/activar/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
    
        UPDATE Usuarios
        SET activo = 1
        WHERE id_usuario = ?
    
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({

                success: false

            });

        } else {

            res.json({

                success: true

            });

        }

    });

});
/* OBTENER PRODUCTOS */

app.get('/productos', (req, res) => {

    const sql = `
    
        SELECT

            P.id_producto,
            P.nombre_producto,
            P.descripcion,
            p.id_categoria,
            P.serie,
            P.certificado_autenticidad,
            P.kilataje,
            P.precio,
            P.ruta_imagen,
            P.estado_producto,
            P.fecha_registro,

            C.nombre_categoria

        FROM Productos P

        INNER JOIN Categorias C
        ON P.id_categoria = C.id_categoria
    
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                success: false
            });

        } else {

            res.json(result);

        }

    });

});

/* MOSTRAR CLIENTES */

app.get('/clientes', (req, res) => {

    const sql = `
    
        SELECT * FROM usuarios
        WHERE id_rol = 4
    
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log("ERROR SQL CLIENTES:");
            console.log(err);

            return res.status(500).json({
                success: false,
                error: err.sqlMessage
            });

        } else {

            res.json(result);

        }

    });

});
/* BUSCAR CLIENTE */
app.get('/clientes/buscar', (req, res) => {

    const { tipo, texto } = req.query;

    const columnasPermitidas = [
        "nombre",
        "correo",
        "telefono"
    ];

    if (!columnasPermitidas.includes(tipo)) {

        return res.status(400).json({
            success: false
        });

    }

    const sql = `
    
        SELECT *
        FROM usuarios
        WHERE id_rol = 4
        AND ${tipo} LIKE ?
    
    `;

    db.query(
        sql,
        [`%${texto}%`],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).json({
                    success: false
                });

            } else {

                res.json(result);

            }

        }
    );

});
/* AGREGAR CLIENTE */

app.post('/clientes', (req, res) => {
    const passwordTemporal =
        bcrypt.hashSync("123456", 10);

    const {
        apellido_paterno,
        apellido_materno,
        nombre,
        correo,
        telefono
    } = req.body;

    const sql = `
    
        INSERT INTO usuarios
        (
            apellido_paterno,
            apellido_materno,
            nombre,
            correo,
            telefono,
            password, 
            id_rol
        )
        VALUES(?,?,?,?,?,?,?)
    
    `;

    db.query(sql,
        [
            apellido_paterno,
            apellido_materno,
            nombre,
            correo,
            telefono,
            passwordTemporal,
            4
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).json({
                    success: false
                });

            } else {

                res.json({
                    success: true,
                    message: 'Cliente agregado'
                });

            }

        });

});
/* ELIMINAR CLIENTE */
app.delete('/clientes/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
    
        DELETE FROM usuarios
        WHERE id_usuario = ?
    
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true
        });

    });

});
/*  CLIENTE */
app.put('/clientes/:id', (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono
    } = req.body;

    const sql = `
    
        UPDATE usuarios
        SET
            nombre=?,
            apellido_paterno=?,
            apellido_materno=?,
            correo=?,
            telefono=?
        WHERE id_usuario=?
    
    `;

    db.query(
        sql,
        [
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            telefono,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({
                success: true
            });

        }
    );

});
/* EDITAR CLEINTE  */

app.delete('/productos/:id', (req, res) => {

    const id =
        req.params.id;

    const sql = `
    
        DELETE FROM Productos
        WHERE id_producto = ?
    
    `;

    db.query(

        sql,

        [id],

        (err, result) => {

            if (err) {

                console.log(err);

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});
/* OBTENER CATEGORIAS */

app.get('/categorias', (req, res) => {

    const sql = `
    
        SELECT *
        FROM Categorias
    
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                success: false
            });

        } else {

            res.json(result);

        }

    });

});
/* OBTENER 1 PRODUCTO */

app.get('/productos/:id', (req, res) => {

    const id =
        req.params.id;

    const sql = `
    
        SELECT *
        FROM Productos
        WHERE id_producto = ?
    
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

        } else {

            res.json(result[0]);

        }

    });

});

/* ACTUALIZAR PRODUCTO */

app.put(

    '/productos/:id',

    upload.single('imagen'),

    (req, res) => {

        console.log(req.body);

        const id = req.params.id;

        const nombre_producto =
            req.body.nombre_producto;

        const descripcion =
            req.body.descripcion;

        const id_categoria =
            req.body.id_categoria;

        const serie =
            req.body.serie;

        const certificado_autenticidad =
            req.body.certificado_autenticidad;

        const kilataje =
            req.body.kilataje;

        const precio =
            req.body.precio;

        const estado_producto =
            req.body.estado_producto;

        let ruta_imagen = null;

        if (req.file) {

            ruta_imagen =
                `/uploads/${req.file.filename}`;

        }

        let sql = `
        
            UPDATE Productos
            SET

            nombre_producto=?,
            descripcion=?,
            id_categoria=?,
            serie=?,
            certificado_autenticidad=?,
            kilataje=?,
            precio=?,
            estado_producto=?
        
        `;

        let valores = [

            nombre_producto,
            descripcion,
            id_categoria,
            serie,
            certificado_autenticidad,
            kilataje,
            precio,
            estado_producto

        ];

        /* SI HAY IMAGEN */

        if (ruta_imagen) {

            sql += `,
            ruta_imagen=?
            `;

            valores.push(ruta_imagen);

        }

        sql += `
        
            WHERE id_producto=?
        
        `;

        valores.push(id);

        db.query(

            sql,

            valores,

            (err, result) => {

                if (err) {

                    console.log(err);

                    res.status(500).json({

                        success: false

                    });

                } else {

                    res.json({

                        success: true

                    });

                }

            }

        );

    });
/* CREAR VENTA */ /*Trigger y stored procedure*/

app.post('/ventas', (req, res) => {

    const {
        id_cliente,
        id_usuario,
        carrito,
        metodo_pago,
        subtotal,
        descuento,
        total
    } = req.body;

    /* METODO PAGO */

    let id_metodo_pago = 1;

    if (metodo_pago === 'Tarjeta') {

        id_metodo_pago = 2;

    }

    /* REGISTRAR CADA PRODUCTO */

    let ventasProcesadas = 0;

    carrito.forEach(p => {

        const sql = `

        CALL registrarVenta(
            ?, ?, ?, ?, ?, ?
        )

    `;

        db.query(

            sql,

            [

                id_cliente,
                id_usuario,
                id_metodo_pago,
                'Mostrador',
                p.id_producto,
                p.precio

            ],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({

                        success: false,
                        message: err.sqlMessage

                    });

                }

                ventasProcesadas++;

                /* TERMINO */

                if (
                    ventasProcesadas === carrito.length
                ) {

                    res.json({

                        success: true

                    });

                }

            }

        );

    });

});
/* OBTENER VENTAS */

app.get('/ventas', (req, res) => {

    const sql = `

        SELECT
            V.id_venta,
            V.total,
            V.fecha_venta,
            U.nombre

        FROM ventas V

        INNER JOIN usuarios U
        ON V.id_usuario = U.id_usuario

        ORDER BY V.id_venta DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json(result);

    });

});
/* PRODUCTOS POR VENTA */

app.get('/ventas/:id/productos', (req, res) => {

    const id_venta = req.params.id;

    const sql = `

        SELECT

            D.id_producto,
            P.nombre_producto,
            D.precio_unitario

        FROM detalle_ventas D

        INNER JOIN productos P
        ON D.id_producto = P.id_producto

        WHERE D.id_venta = ?

    `;

    db.query(sql, [id_venta], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json(result);

    });

});


/* REPORTE VENTAS */

app.get('/reporte-ventas', (req, res) => {

    const {
        tipo,
        fechaInicio,
        fechaFin,
        mes,
        anio
    } = req.query;

    let sql = `

        SELECT

            P.id_producto,

            P.nombre_producto,

            P.descripcion,

            P.serie,

            P.certificado_autenticidad,

            P.kilataje,

            P.estado_producto,

            C.nombre_categoria,

            V.tipo_venta,

            V.fecha_venta,

            V.total,

            U.nombre AS usuario,

            MP.nombre_metodo AS metodo_pago

        FROM ventas V

        INNER JOIN detalle_ventas D
        ON V.id_venta = D.id_venta

        INNER JOIN productos P
        ON D.id_producto = P.id_producto

        INNER JOIN categorias C
        ON P.id_categoria = C.id_categoria

        INNER JOIN usuarios U
        ON V.id_usuario = U.id_usuario

        INNER JOIN metodo_pago MP
        ON V.id_metodo_pago = MP.id_metodo_pago

    `;

    let valores = [];

    /* DIARIO */

    if (tipo === 'diario') {

        sql += `

            WHERE DATE(V.fecha_venta) = ?

        `;

        valores.push(
            fechaInicio
        );

    }

    /* SEMANAL */

    else if (tipo === 'semanal') {

        sql += `

            WHERE DATE(V.fecha_venta)

            BETWEEN ? AND DATE_ADD(?, INTERVAL 7 DAY)

        `;

        valores.push(
            fechaInicio,
            fechaInicio
        );

    }

    /* MENSUAL */

    else if (tipo === 'mensual') {

        sql += `

            WHERE DATE_FORMAT(
                V.fecha_venta,
                '%Y-%m'
            ) = ?

        `;

        valores.push(
            mes
        );

    }

    /* ANUAL */

    else if (tipo === 'anual') {

        sql += `

            WHERE YEAR(
                V.fecha_venta
            ) = ?

        `;

        valores.push(
            anio
        );

    }

    /* PERSONALIZADO */

    else if (tipo === 'personalizado') {

        sql += `

            WHERE DATE(V.fecha_venta)

            BETWEEN ? AND ?

        `;

        valores.push(
            fechaInicio,
            fechaFin
        );

    }

    sql += `

        ORDER BY V.fecha_venta DESC

    `;

    db.query(sql, valores, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json(result);

    });

});
/* REALIZAR DEVOLUCION */

app.post('/devoluciones', (req, res) => {

    const {

        id_venta,
        id_producto,
        id_usuario,
        motivo

    } = req.body;

    const sql = `

        INSERT INTO devoluciones (

            id_venta,
            id_producto,
            id_usuario,
            motivo

        )

        VALUES (?,?,?,?)

    `;

    db.query(

        sql,

        [
            id_venta,
            id_producto,
            id_usuario,
            motivo
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            /* REGRESAR PRODUCTO */

            const updateSQL = `

                UPDATE productos

                SET estado_producto='Disponible'

                WHERE id_producto=?

            `;

            db.query(updateSQL, [id_producto]);

            res.json({
                success: true
            });

        }

    );

});
/* HISTORIAL DEVOLUCIONES */

app.get('/devoluciones', (req, res) => {

    const sql = `

        SELECT

            D.id_devolucion,
            D.fecha_devolucion,
            D.motivo,

            V.id_venta,

            P.nombre_producto,

            U.nombre

        FROM devoluciones D

        INNER JOIN ventas V
        ON D.id_venta = V.id_venta

        INNER JOIN productos P
        ON D.id_producto = P.id_producto

        INNER JOIN usuarios U
        ON D.id_usuario = U.id_usuario

        ORDER BY D.id_devolucion DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json(result);

    });

});

console.log("RUTA CAJA DIA CARGADA");

/* CAJA DEL DIA */

app.get('/caja-dia/:id_usuario', (req, res) => {

    const id_usuario =
        req.params.id_usuario;

    const sql = `

        SELECT

            V.id_venta,
            V.total,
            V.fecha_venta,
            M.nombre_metodo

        FROM ventas V

        INNER JOIN metodo_pago M
        ON V.id_metodo_pago = M.id_metodo_pago

        WHERE
            V.id_usuario = ?
        

    `;

    db.query(sql, [id_usuario], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        let efectivo = 0;
        let tarjeta = 0;

        result.forEach(v => {

            if (
                v.nombre_metodo.toLowerCase() ===
                "efectivo"
            ) {

                efectivo += Number(v.total);

            } else {

                tarjeta += Number(v.total);

            }

        });

        const total =
            efectivo + tarjeta;

        /* DEVOLUCIONES */

        const devSQL = `

            SELECT COUNT(*) AS total

            FROM devoluciones

            WHERE id_usuario=?

            AND DATE(fecha_devolucion)=CURDATE()

        `;

        db.query(devSQL, [id_usuario], (err2, devResult) => {

            if (err2) {

                console.log(err2);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({

                efectivo,
                tarjeta,
                total,

                cantidadVentas:
                    result.length,

                devoluciones:
                    devResult[0].total,

                historial:
                    result

            });

        });

    });

});

/* REPORTE CAJA */

app.get('/reporte-caja', (req, res) => {

    const {
        tipo,
        fechaInicio,
        fechaFin,
        mes,
        anio
    } = req.query;

    let sql = `

        SELECT

            DATE(V.fecha_venta) AS fecha,

            COUNT(V.id_venta) AS ventas,

            SUM(
                CASE
                    WHEN MP.nombre_metodo='Efectivo'
                    THEN V.total
                    ELSE 0
                END
            ) AS efectivo,

            SUM(
                CASE
                    WHEN MP.nombre_metodo='Tarjeta'
                    THEN V.total
                    ELSE 0
                END
            ) AS tarjeta,

            SUM(V.total) AS ingresos

        FROM ventas V

        INNER JOIN metodo_pago MP
        ON V.id_metodo_pago = MP.id_metodo_pago

        WHERE 1=1

    `;

    /* DIARIO */

    if (tipo === 'diario') {

        sql += `

            AND DATE(V.fecha_venta)=
            '${fechaInicio}'

        `;

    }

    /* PERSONALIZADO */

    if (
        tipo === 'personalizado'
    ) {

        sql += `

            AND DATE(V.fecha_venta)

            BETWEEN '${fechaInicio}'
            AND '${fechaFin}'

        `;

    }

    /* MENSUAL */

    if (tipo === 'mensual') {

        sql += `

            AND DATE_FORMAT(
                V.fecha_venta,
                '%Y-%m'
            )='${mes}'

        `;

    }

    /* ANUAL */

    if (tipo === 'anual') {

        sql += `

            AND YEAR(
                V.fecha_venta
            )='${anio}'

        `;

    }

    sql += `

        GROUP BY DATE(V.fecha_venta)

        ORDER BY V.fecha_venta DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success:false
            });

        }

        res.json(result);

    });

});
/* DASHBOARD CAJERO */

app.get('/dashboard-cajero/:id_usuario', (req, res) => {

    const id_usuario =
        req.params.id_usuario;

    /* VENTAS HOY */

    const ventasSQL = `

        SELECT

            COUNT(*) AS tickets,
            SUM(total) AS totalVentas

        FROM ventas

        WHERE
            id_usuario = ?

    `;

    db.query(ventasSQL, [id_usuario], (err, ventasResult) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        /* DEVOLUCIONES */

        const devSQL = `

            SELECT COUNT(*) AS devoluciones

            FROM devoluciones

            WHERE
                id_usuario = ?

        `;

        db.query(devSQL, [id_usuario], (err2, devResult) => {

            if (err2) {

                console.log(err2);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({

                ventasHoy:
                    ventasResult[0].totalVentas || 0,

                tickets:
                    ventasResult[0].tickets || 0,

                devoluciones:
                    devResult[0].devoluciones || 0

            });

        });

    });

});

/* DASHBOARD ALMACEN */

app.get('/dashboard-almacen', (req, res) => {

    /* PRODUCTOS DISPONIBLES */

    const disponiblesSQL = `

        SELECT COUNT(*) AS disponibles

        FROM productos

        WHERE estado_producto='Disponible'

    `;

    db.query(disponiblesSQL, (err, disponiblesResult) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        /* ENTRADAS HOY */

        const entradasSQL = `

            SELECT COUNT(*) AS entradas

            FROM movimientos_inventario

            WHERE tipo_movimiento = 'Entrada'

            AND DATE(fecha_movimiento)=CURDATE()

        `;

        db.query(entradasSQL, (err2, entradasResult) => {

            if (err2) {

                console.log(err2);

                return res.status(500).json({
                    success: false
                });

            }

            /* SALIDAS HOY */

            const salidasSQL = `

                SELECT COUNT(*) AS salidas

                FROM movimientos_inventario

                WHERE tipo_movimiento = 'Salida'

                AND DATE(fecha_movimiento)=CURDATE()

            `;

            db.query(salidasSQL, (err3, salidasResult) => {

                if (err3) {

                    console.log(err3);

                    return res.status(500).json({
                        success: false
                    });

                }

                res.json({

                    disponibles:
                        disponiblesResult[0].disponibles,

                    entradas:
                        entradasResult[0].entradas,

                    salidas:
                        salidasResult[0].salidas

                });

            });

        });

    });

});

