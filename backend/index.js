const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const ciudadesAPI = require('./rutas/patrimonio.js')
ciudadesAPI(app)

app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen('8080', () => {
    console.log(`servidor escuchando en ${server.address().port}`)
});