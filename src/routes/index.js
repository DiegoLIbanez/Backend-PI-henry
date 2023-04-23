const { Router } = require('express');
const { createDog, getDog,  getDogByIdRaza } = require('../controllers/dogs.Controller');
const { createTemperament } = require('../controllers/temperament.Controller');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


router.get("/dogs/", getDog );
router.get("/dogs/:id", getDogByIdRaza);
router.post("/dogs", createDog)
router.get("/temperaments", createTemperament);


module.exports = router;
