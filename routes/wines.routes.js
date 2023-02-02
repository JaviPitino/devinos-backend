const router = require("express").Router();
const WineModel = require("../models/Wines.model");
const isAuthenticated = require("../middlewares/isAuthenticated")
const CommentModel = require("../models/Comment.model");
const UserModel = require("../models/User.model");

// GET ("/api/wines") -> Nos da la lista de wines
router.get('/', async (req, res, next) => {
  
  try {

    const response = await WineModel.find().populate({path: 'bodega', select: 'name'})
    res.json(response)

  } catch(err) { next(err) }

})

// POST ('api/wines') -> Crear un nuevo vino en la DB
router.post('/', isAuthenticated, async (req, res, next) => {

  const { name, bodega, tipo, uva, year, description, puntuacion, image } = req.body

  try {

    const response = await WineModel.create({
      name, bodega, tipo, uva, year, description, puntuacion, image, likes, likeCount
    })
  
    res.json(response)

  } catch(err) { next(err) }

})

// GET ('api/wines/:id') -> Detalles de un vino en específico
router.get("/:id", async (req, res, next) => {

  const { id } = req.params

  try {

    const response = await WineModel.findById(id).populate({path: 'bodega'}).populate({path: 'likes', select: '_id'})
    res.json(response)

  } catch(err) {
    next(err)
  }

})

// PATCH ('/api/wines/:id) -> Edita un vino en específico a través del formulario
router.patch('/:id', async (req, res, next) => {

  const { name, bodega, tipo, uva, year, description, puntuacion, image } = req.body
  const { id } = req.params

  try {

    // const allBodegas = await BodegaModel.find()
    const response = await WineModel.findByIdAndUpdate( id, {
      name, bodega, tipo, uva, year, description, puntuacion, image
    } )
    
    res.status(200).json(response)

  } catch(err) { next(err) }

})

// DELETE ('/api/wines/:id) -> Borra un vino en específico
router.delete('/:id', async (req, res, next) => {

  const { id } = req.params

  try {
    
    await WineModel.findByIdAndDelete( id )
    res.json("El Vino ha sido borrado de la DB")

  } catch(err) { next(err) }

})

// Crear un nuevo comentario
router.post('/:id/comments', isAuthenticated, async (req, res, next) => {

  const { comment, wineId, commentUser } = req.body;
  const { _id } = req.payload;
  const { id } = req.params;

  try {

    const userName = await UserModel.findById(_id)

    const response = await CommentModel.create({
      comment, wineId: id, commentUser: userName
    })
    res.status(200).json(response)

  } catch(err) { next(err) }

})

// Mostrar todos los comentarios
router.get('/:id/comments', isAuthenticated, async (req, res, next) => {

  try {

    const response = await CommentModel.find().populate({path: "commentUser"}).populate("wineId")
    res.json(response)

  } catch(err) {
    next(err)
  }

})

// Ruta para los LIKES
router.patch('/:id/likes', isAuthenticated, async (req, res, next) => {

  const { id } = req.params
  const { _id } = req.payload;

  try {

    const userName = await UserModel.findById(_id)

    const updatedLike = await WineModel.findById({ '_id': id, 'likes': userName._id})
    

    const newArr = updatedLike.likes.find((each) => {
      return each === userName._id.toString()
    })
    
    console.log('UpdatedLike', updatedLike.likes);

    if (newArr === undefined) {
    // if (newArr !== userName._id.toString()) {
      await  WineModel.findByIdAndUpdate(id, { $push: {'likes': userName._id }, $inc: { 'likeCount': 1 } }, {new: true})
    } else {
      await  WineModel.findByIdAndUpdate(id, { $pull: {'likes': userName._id }, $inc: { 'likeCount': -1 } }, {new: true})
    }
    

    console.log('userId', userName._id.toString())
    // console.log('NewArray', newArr);

    res.json(updatedLike)

  } catch(err) { next(err) }
})

module.exports = router;