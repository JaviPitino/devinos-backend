const { expressjwt } = require("express-jwt")

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload", // Pasa el req.payload a la siguiente funcion de ruta
  getToken: (req) => {

    if ( req.headers === undefined || req.headers.authorization === undefined) {
      return null
    }

    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if ( tokenType !== "Bearer" ) {
      return null;
    };

    // console.log("El token fue entregado")
    return token;
  }
})

module.exports = isAuthenticated