import mongoose from 'mongoose';

// Interface for describing the properties needed to make a new frag
// Made so we can use type checking with TS when creating a new frag
// because mongoose does not tell TS what types the parameters are
interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

// Interface for describing the properties of a order model(collection of orders)
// The mongoose.Model<orderDocument> means the order model is extending
// the Model of type orderDocument
interface PaymentModel extends mongoose.Model<PaymentDocument> {
  build(attributes: PaymentAttributes): PaymentDocument; //returns a single order for mongoose to use
}

// Interface for describing the properties of a order document(single order)
interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    stripeId: {
      type: String,
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

//used to do type checking with TS, should be used instead of new order
//make sure this goes before the assignment to 'order'
paymentSchema.statics.build = (attributes: PaymentAttributes) => {
  return new Payment(attributes);
};

//the objects in the <> define the data type for the arguments
//Furthermore Order is assigned the Order Model
const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
