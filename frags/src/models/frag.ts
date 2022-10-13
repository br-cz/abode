import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface for describing the properties needed to make a new frag
// Made so we can use type checking with TS when creating a new frag
// because mongoose does not tell TS what types the parameters are
interface FragAttributes {
  title: string;
  price: number;
  userId: string;
}

// Interface for describing the properties of a Frag model(collection of user)
// The mongoose.Model<UserDocument> means the user model is extending
// the Model of type UserDocument
interface FragModel extends mongoose.Model<FragDocument> {
  build(attributes: FragAttributes): FragDocument; //returns a single user for mongoose to use
}

// Interface for describing the properties of a User document(single user)
interface FragDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

const fragSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //to better match other DB id model
        delete ret._id;
      },
    },
  }
);
//set _v to version in db
fragSchema.set('versionKey', 'version');

//use Optimization Concurrency Control
fragSchema.plugin(updateIfCurrentPlugin);

//used to do type checking with TS, should be used instead of new User
//make sure this goes before the assignment to 'User'
fragSchema.statics.build = (attributes: FragAttributes) => {
  return new Fragrance(attributes);
};

//the objects in the <> define the data type for the arguments
//Furthermore Frag is assigned the Frag Model
const Fragrance = mongoose.model<FragDocument, FragModel>(
  'Fragrance',
  fragSchema
);

export { Fragrance };
