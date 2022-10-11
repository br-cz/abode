import mongoose from 'mongoose';
import { OrderStatus } from '@abodeorg/common';
import { FragDocument } from './frag';

// Interface for describing the properties needed to make a new frag
// Made so we can use type checking with TS when creating a new frag
// because mongoose does not tell TS what types the parameters are
interface OrderAttributes {
  status: OrderStatus;
  expiryDate: Date;
  userId: string;
  frag: FragDocument;
}

// Interface for describing the properties of a order model(collection of orders)
// The mongoose.Model<orderDocument> means the order model is extending
// the Model of type orderDocument
interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attributes: OrderAttributes): OrderDocument; //returns a single order for mongoose to use
}

// Interface for describing the properties of a order document(single order)
interface OrderDocument extends mongoose.Document {
  status: OrderStatus;
  expiryDate: Date;
  userId: string;
  frag: FragDocument;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus), //only allowed order status strings
    },
    expiryDate: {
      type: mongoose.Schema.Types.Date,
      //not required because a we only require this for orders not paid for yet
    },
    userId: {
      type: String,
      require: true,
    },
    frag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Frag',
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

//used to do type checking with TS, should be used instead of new order
//make sure this goes before the assignment to 'order'
orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};

//the objects in the <> define the data type for the arguments
//Furthermore Order is assigned the Order Model
const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
