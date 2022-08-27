import mongoose from 'mongoose';
import {Password} from '../services/password';

// Interface for describing the properties needed to make a new user
// Made so we can use type checking with TS when creating a new user
// because mongoose does not tell TS what types the parameters are
interface UserAttributes {
    email: string,
    password: string,
}

// Interface for describing the properties of a User model(collection of user)
// The mongoose.Model<UserDocument> means the user model is extending
// the Model of type UserDocument
interface UserModel extends mongoose.Model<UserDocument> {
    build(attributes: UserAttributes): UserDocument; //returns a single user for mongoose to use
}

// Interface for describing the properties of a User document(single user)
interface UserDocument extends mongoose.Document{
    email:string,
    password: string
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id; //to better match other DB id model 
            delete ret._id;
            delete ret.password; //removes return's password property
            delete ret.__v;
        }
    }
});

//using function to access 'this', as arrow functions => override the this keyword within the file instead of the user document we want
userSchema.pre('save', async function(done){
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});
//used to do type checking with TS, should be used instead of new User
//make sure this goes before the assignment to 'User'
userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
}

//the objects in the <> define the data type for the arguments
//Furthermore User is assigned the User Model
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export {User}