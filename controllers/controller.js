import { pool } from "../config/db.js";
import { format } from 'date-fns';

let transaccionDinero = async (depositador,recibidor,monto) => {
    try {
        // Banderas
        let depositadorOk = true;
        let recibidorOk = false;
        // BEGIN
        await pool.query('BEGIN');
        // Chequeando si deposito sale bien
        let sqlDeposito = {
            text : "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *",
            values : [monto,depositador]
        };
        let descontar = await pool.query(sqlDeposito)
        if (descontar.rowCount > 0) {
            depositadorOk = true;
            console.log('El descuento fue exitoso',descontar.rows);
        } else {
            console.log('El descuento no se pudo realizar!');
            await pool.query('ROLLBACK');
            return("Error! revisar consola!")
        }
        // Si deposito ok...
        if (depositadorOk) {
            let sqlAbono = {
                text : "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 RETURNING *",
                values : [monto,recibidor]
            };
            let abonar = await pool.query(sqlAbono);
            if (abonar.rowCount > 0) {
                recibidorOk = true;
                console.log('El abono fue exitoso!',abonar.rows);
            } else {
                console.log('El descuento no se pudo realizar!');
                await pool.query('ROLLBACK');
                return("Error! revisar consola!")
            }
        }

        // Si todo ok hacemos el log de transferencias
        if (depositadorOk && recibidorOk) {
            await pool.query('COMMIT');
            console.log("Transaccion exitosa!");
            let descripcion = "Realizado desde node con body";
            let fecha_now = new Date();
            let fecha_formateada = format(fecha_now,'yyyy-MM-dd');
            let sql_log = {
                text : "INSERT INTO transferencias (descripcion,fecha,monto,cuenta_origen,cuenta_destino) VALUES($1,$2,$3,$4,$5)",
                values : [descripcion,fecha_formateada,monto,depositador,recibidor]
            }
            let trans_log = await pool.query(sql_log);
            return (trans_log.rows)
        } else {
            console.log('El descuento no se pudo realizar!');
            await pool.query('ROLLBACK');
            return("Error! revisar consola! error en chequeo depositador ok y recibidor ok");
        };
        
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log(`Error : ${error.code} , ${error.message}`);
    }
}

let ultimasTransferencias = async () => {
    try {
        let sql = {
            text : "SELECT * FROM transferencias"
        }
        let response = await pool.query(sql);
        return (response.rows)
    } catch (error) {
        console.log('Error, revisar consola!');
        console.log(`Error : ${error.code} , ${error.message}`);
        return ("Error!, favor consultar al administrador.")
    }
}

let revisarSaldo = async (id) => {
    try {
        let sql = {
            text : "SELECT saldo FROM cuentas WHERE id = $1",
            values : [id]
        }
        let response = await pool.query(sql);
        return response.rows;
    } catch (error) {
        console.log('Error, revisar consola!');
        console.log(`Error : ${error.code} , ${error.message}`);
        return ("Error!, favor consultar al administrador.")
    }
}

export {
    transaccionDinero,
    ultimasTransferencias,
    revisarSaldo
}