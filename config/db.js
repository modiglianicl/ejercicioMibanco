import pg from 'pg';
import 'dotenv/config';


let { DB_USER , DB_PASSWORD , DB_HOST , DB_DATABASE , DB_DIALECT } = process.env;

let { Pool } = pg;

let config = {
    user : DB_USER,
    password : DB_PASSWORD,
    host : DB_HOST,
    database : DB_DATABASE,
    allowExitOnIdle : true
}

let pool = new Pool(config);

 // Funcion que prueba si nos conectamos correctamente
let probarDB = async () => {
    let mensaje_raw = await pool.query('SELECT now()')
    let mensajeOk = mensaje_raw.rows
    console.log(mensajeOk[0].now);
}

probarDB();


export {
    pool
}