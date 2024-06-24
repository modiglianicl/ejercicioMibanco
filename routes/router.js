import { Router } from 'express';
import { transaccionDinero, ultimasTransferencias,revisarSaldo } from '../controllers/controller.js';

let router = Router()


router.get('/',(req,res) => {
    res.send('Holis')
})

router.post('/transaccion',async (req,res) => {
    let { depositador , recibidor ,monto } = req.body;
    let resultado = await transaccionDinero(depositador,recibidor,monto);
    res.send(resultado);
})

router.get('/transferencias',async (req,res) =>  {
    let resultado = await ultimasTransferencias();
    res.send(resultado);

})

router.post('/revisarsaldo', async(req,res) => {
    let { id } = req.body;
    let resultado = await revisarSaldo(id);
    res.send(resultado);
})


export {
    router
}