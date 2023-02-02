const router = require("express").Router();
const UserModel = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploader = require("../middlewares/uploader");
const WineModel = require("../models/Wines.model");

// GET ('/api/profile/:id') -> Muestra el perfil del usuario
router.get("/:id", isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload

  try {

    const profileUser = await UserModel.findById(_id)
    res.status(200).json(profileUser)

  } catch(err) { next(err) }

})

// PATCH ('api/profile/:id/edit) -> Edita el perfil de usuario
router.patch("/:id/edit", isAuthenticated, uploader.single("image"), async (req, res, next) => {

  const { username, email, image } = req.body
  const { id } = req.params

  try {

    const editProfile = await UserModel.findByIdAndUpdate( id, {
      username, email, image
    });
    res.json(editProfile)

  } catch(err) { next(err) }

})

// GET ('api/profile/wishlist) -> Muestra la lista de vinos favoritos
router.get("/wishlist/:id", isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload
  const { id } = req.params

  try {

    const userObject = await UserModel.findById( _id).populate({path: 'wishlist'}).select('wishlist')
    res.status(200).json(userObject)

  } catch(err) { next(err) }
})

router.patch('/wishlist/:id', isAuthenticated, async (req, res, next) => {

  const { id } = req.params
  const { _id } = req.payload;
  console.log('_id User', _id)
  // const { id } = req.params
  console.log('id params', id)

  try {

    const userName = await UserModel.findByIdAndUpdate( _id).select('wishlist')

    const newArr = userName.wishlist.find((each) => {
      console.log(each.toString());
      return each.toString() === id
    })
    console.log('NewArr', newArr);
    if (newArr === undefined) {
        await  UserModel.findByIdAndUpdate(_id, { $addToSet: {'wishlist': id }}, {new: true})
      } else {
        await  UserModel.findByIdAndUpdate(_id, { $pull: {'wishlist': id }}, {new: true})
      }
    res.status(200).json(userName)

  } catch(err) { next(err) }
})

// PATCH ('/api/profile/wishlist/:id/delete') -> Borrar elemento de la wishlist
router.patch('/wishlist/:id/delete', isAuthenticated, async (req, res, next) => {

  const { _id } = req.payload
  const { id } = req.params

  try {

    const deleteVino = await UserModel.findByIdAndUpdate( _id, {
      $pull: { wishlist: id }
    }).select('wishlist')
    console.log(deleteVino)
    res.status(200).json(deleteVino)

  } catch(err) { next(err) }
 
})

module.exports = router;