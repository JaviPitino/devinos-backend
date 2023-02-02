const { Schema, model } = require("mongoose")

const winesSchema = new Schema(
  {
    name: {
      type: String
    },
    bodega: {
      type: Schema.Types.ObjectId,
      ref: "bodega"
    },
    tipo: {
      type: String
    },
    uva: [{
      type: String,
      enum: ["Syrah", "Tintilla de Rota", "Petit verdot", "Cabernet sauvignon", "Palomino fino", "Merlot", "Tempranillo", "Chardonnay"]
    }],
    year: {
      type: Number
    },
    description: {
      type: String
    },
    puntuacion: {
      type: Number
    },
    image: {
      type: String
    },
    likes: [{
      // type: Schema.Types.ObjectId,
      // ref: "user"
      type: String  
    }],
    likeCount: Number
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
)

const WineModel = model("wine", winesSchema);
                        // Nombre de la colección

module.exports = WineModel;