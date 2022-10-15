import mongoose from 'mongoose';
import { OrderStatus } from '@abodeorg/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface for describing the properties needed to make a new frag
// Made so we can use type checking with TS when creating a new frag
// because mongoose does not tell TS what types the parameters are
interface OrderAttributes {
  id: string;
  version: number;
  status: OrderStatus;
  price: number;
  userId: string;
}

// Interface for describing the properties of a order model(collection of orders)
// The mongoose.Model<orderDocument> means the order model is extending
// the Model of type orderDocument
interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attributes: OrderAttributes): OrderDocument; //returns a single order for mongoose to use
}

// Interface for describing the properties of a order document(single order)
interface OrderDocument extends mongoose.Document {
  version: number;
  status: OrderStatus;
  price: number;
  userId: string;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus), //only allowed order status strings
    },
    userId: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

//used to do type checking with TS, should be used instead of new order
//make sure this goes before the assignment to 'order'
orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order({
    _id: attributes.id,
    version: attributes.version,
    price: attributes.price,
    userId: attributes.userId,
    status: attributes.status,
  });
  // return new Order(attributes);
};

//the objects in the <> define the data type for the arguments
//Furthermore Order is assigned the Order Model
const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
