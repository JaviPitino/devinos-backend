const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
const UserModel = require("../models/User.model")

// POST ('/aapi/Çauth/signup') -> Registrar al usuario
router.post('/signup', async (req, res, next) => {

  const { username, email, password, role } = req.body

  // * Validación de BE

  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "Se deben rellenar todos los campos" })
    return; // No continúes con la función
  }

  // * Validación de la contraseña con bcryptjs
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
  if ( passwordRegex.test(password) === false ) {
    res.status(411).json({ errorMessage: "La contraseña debe tener entre 8 y 15 carácteres, uno en mayúsculas y un número" })
    return; // No continúes con la función
  }

  try {

    const foundUser = await UserModel.findOne({
      $or: [{ email: email}, { username: username }]
    })

    if ( foundUser !== null ) {
      res.status(400).json({ errorMessage: "usuario ya registrado" })
      return; 
    }

    // * Encriptamos la contraseña con bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Creamos usuario nuevo
    await UserModel.create({
      username, email, password: hashPassword, role
    });
    res.status(201).json("Usuario creado")

  } catch(err) { next(err) }

})

// POST ('/api/auth/login') -> Verificamos credenciales del usuario y abrimos sesión
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body

  // * Validación de BE
  if ( !email || !password ) {
    res.status(401).json({ errorMessage: "Debe rellenar todos los campos" })
    return; 
  }

  try {

    const foundUser = await UserModel.findOne({ email: email })

    if ( foundUser === null ) {
      res.status(400).json({ errorMessage: "El usuario ya existe" })
    }

    // * Validacion de usuario
    const passwordMatch = await bcryptjs.compare(password, foundUser.password);
  
    if ( passwordMatch === false ) {
      res.status(401).json({ errorMessage: "la contraseña es incorrecta" })
      return;
    }
  
    // Si la validación es correcta Creamos SESION
    const payload = {
  
      _id: foundUser._id,
      email: foundUser.email, 
      username: foundUser.username,
      role: foundUser.role,
      image: foundUser.image,
      wishlist: foundUser.wishlist
  
    };
  
    // JWT
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "12h",
    });
    res.json({ authToken: authToken })

  } catch(err) { next(err) }

})

// GET ('/api/auth/verify') => Comprobamos que el token es válido. Ruta usada para el flujo del FE
router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(req.payload);
  res.json(req.payload);
});


module.exports = router;