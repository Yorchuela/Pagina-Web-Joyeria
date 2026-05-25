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
    
        SELECT * FROM Clientes
    
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
/* AGREGAR CLIENTE */

app.post('/clientes', (req, res) => {

    const {
        apellido_paterno,
        apellido_materno,
        nombre,
        correo,
        telefono
    } = req.body;

    const sql = `
    
        INSERT INTO Clientes
        (
            apellido_paterno,
            apellido_materno,
            nombre,
            correo,
            telefono
        )
        VALUES(?,?,?,?,?)
    
    `;

    db.query(sql,
        [
            apellido_paterno,
            apellido_materno,
            nombre,
            correo,
            telefono
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
/* ELIMINAR PRODUCTO */

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
/* CREAR VENTA */

app.post('/ventas', (req, res) => {

    const {

        id_cliente,
        carrito,
        metodo_pago

    } = req.body;

    let subtotal = 0;

    carrito.forEach(p => {

        subtotal += Number(p.precio);

    });

    const descuento = 0;

const total = subtotal;

/* METODO PAGO */

let id_metodo_pago = 1;

if(metodo_pago === 'Tarjeta'){

    id_metodo_pago = 2;

}
    

    /* INSERTAR VENTA */

    const ventaSQL = `

       INSERT INTO ventas (

            id_cliente,
            id_metodo_pago,
            subtotal,
            descuento,
            total

        )

        VALUES (?,?,?,?,?)

    `;

    db.query(

        ventaSQL,

        [

            id_cliente,
            id_metodo_pago,
            subtotal,
            descuento,
            total


        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false

                });

            }

            const id_venta =
                result.insertId;

            /* INSERTAR DETALLE */

            carrito.forEach(p => {

                const detalleSQL = `

                    INSERT INTO detalle_ventas (

                        id_venta,
                        id_producto,
                        cantidad,
                        precio_unitario,
                        descuento,
                        total

                    )

                    VALUES (?,?,?,?,?,?)

                `;

                db.query(

                    detalleSQL,

                    [

                        id_venta,
                        p.id_producto,
                        1,
                        p.precio,
                        0,
                        p.precio

                    ]

                );

                /* CAMBIAR STOCK */

                const stockSQL = `

                    UPDATE productos

                    SET estado_producto='Vendido'

                    WHERE id_producto=?

                `;

                db.query(

                    stockSQL,

                    [p.id_producto]

                );

            });

            res.json({

                success: true

            });

        }

    );

});
