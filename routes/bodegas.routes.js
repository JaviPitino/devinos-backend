const router = require("express").Router();
const BodegaModel = require("../models/Bodega.model");
const WineModel = require("../models/Wines.model");
const uploader = require("../middlewares/uploader")

// GET ('api/bodegas') -> Muestra todas las bodegas
router.get('/', async (req, res, next) => {

  try {

    const response = await BodegaModel.find()
    res.json(response)

  } catch(err) { next(err) }

})

// POST ('/api/bodegas') -> Crea una nueva bodega en la DB
router.post('/', async (req, res, next) => {

  const { name, region, description, wines, image } = req.body

  try {

    const response = await BodegaModel.create({
      name, region, description, wines, image
    })
    console.log(response)
    res.json(response)

  } catch(err) { next(err) }
})

// GET ('api/bodegas/:id') -> Muestra una bodega en específico
router.get('/:id', async (req, res, next) => {

  const { id } = req.params

  try {

    const response = await BodegaModel.findById( id ).populate({path: 'wines', strictPopulate: false})
    res.json(response)

  } catch(err) { next(err) }

})

// PATCH ('api/bodegas/:id) -> Edita una bodega específica
router.patch('/:id', uploader.single("image"), async (req, res, next) => {

  const { id } = req.params
  const { name, region, description, image, wines } = req.body

  try {

    // const allWines = await WineModel.find()
    const response = await BodegaModel.findByIdAndUpdate( id, {
      name, region, description, image, wines
    })
    res.json(response)
    
  } catch(err) { next(err) }

})

// DELETE ('api/bodegas/:id) -> Borra una bodega en específico
router.delete('/:id', async (req, res, next) => {

  const { id } = req.params

  try {

    await BodegaModel.findByIdAndDelete( id )
    res.json("La bodega ha sido borrada de la DB")

  } catch(err) { next(err) }

})

module.exports = router;
