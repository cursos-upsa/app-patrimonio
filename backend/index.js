require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const patrimonioAPI = require('./rutas/patrimonio.js')
const twelveDataAPI = require('./rutas/twelveData.js')

patrimonioAPI(app)
twelveDataAPI(app)

app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen('8080', () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`)
});