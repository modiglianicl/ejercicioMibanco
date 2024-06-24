import express from 'express';
import { router } from './routes/router.js';
import 'dotenv/config';

let app = express();
let PORT = process.env.PORT;


// Middlewares

app.use(express.json())

// Rutas

app.use('/',router);



// Listen

app.listen(PORT,()=> {
    console.log(`Server UP ON http://localhost:${PORT}`)
})