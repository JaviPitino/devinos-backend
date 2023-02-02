const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const CommentModel = require("../models/Comment.model");


// ('/comment') -> mostrar comentario
router.get('/', async (req, res, next) => {

  const { id } = req.params

  try {

    const response = await CommentModel.find().populate({path: "commentUser", select: "username"}).populate("wineId")
    res.json(response)

  } catch(err) { next(err) }
})

// Crear un nuevo comentario
router.post('/', async (req, res, next) => {

  const { comment, rating, wineId } = req.body

  try {

    const response = await CommentModel.create({
      comment, rating, wineId
    })
    res.json(response)

  } catch(err) { next(err) }

})

module.exports = router;