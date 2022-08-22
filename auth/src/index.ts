import express from 'express';
import { json } from 'body-parser';
const bodyParser=require('body-parser');


import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();
app.use(json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(currentUserRouter); 
app.use(signInRouter); 
app.use(signOutRouter); 
app.use(signUpRouter); 

app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!");
});