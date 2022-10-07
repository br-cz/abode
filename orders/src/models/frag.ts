//
// NOTE!!!!!
// While this is similar to the frag model, this frag db is for order service use only
// Hence it has specific features for it only, keeping maintainability/scalability in mind
//

import { OrderStatus } from '@abodeorg/common';
import mongoose from 'mongoose';
import { Order } from './order';

// Interface for describing the properties needed to make a new frag
// Made so we can use type checking with TS when creating a new frag
// because mongoose does not tell TS what types the parameters are
interface FragAttributes {
  title: string;
  price: number;
}

// Interface for describing the properties of a Frag model(collection of frag)
// The mongoose.Model<FragDocument> means the frag model is extending
// the Model of type FragDocument
interface FragModel extends mongoose.Model<FragDocument> {
  build(attributes: FragAttributes): FragDocument; //returns a single frag for mongoose to use
}

// Interface for describing the properties of a Frag document(single frag)
export interface FragDocument extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): boolean;
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
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //to better match other DB id model
        delete ret._id;
        delete ret.password; //removes return's password property
        delete ret.__v;
      },
    },
  }
);

//used to do type checking with TS, should be used instead of new Frag
//make sure this goes before the assignment to 'Frag'
fragSchema.statics.build = (attributes: FragAttributes) => {
  return new Fragrance(attributes);
};

fragSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    frag: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  if (existingOrder) {
    return true;
  } else {
    return false;
  }
};

//the objects in the <> define the data type for the arguments
//Furthermore Frag is assigned the Frag Model
const Fragrance = mongoose.model<FragDocument, FragModel>('Frag', fragSchema);

export { Fragrance };
