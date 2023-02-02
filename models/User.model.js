const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    image: {
      type: String,
      default: "https://res.cloudinary.com/dttp09igh/image/upload/v1668715269/wines-routes/prorile-default_oawuzm.png"
    },
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'wine'
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const UserModel = model("user", userSchema);

module.exports = UserModel;
