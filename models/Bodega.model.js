const { Schema, model } = require("mongoose")

const bodegaSchema = new Schema({

  name: {
    type: String
  },
  region: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/dttp09igh/image/upload/v1669143103/wines-routes/mljrlvisaphsse1hki8f.jpg"
  },
  wines: [{
    type: Schema.Types.ObjectId,
    ref: "wine"
  }]
},
{
  // this second object adds extra properties: `createdAt` and `updatedAt`    
  timestamps: true
})

const BodegaModel = model("bodega", bodegaSchema)

module.exports = BodegaModel;