const {MongoClient} = require('mongodb')

const DB_NAME = 'app_patrimonio'
const DB_USER = 'enrique'
const DB_PASSWORD = 'cQZ2R6jufLnlIr1n'
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.uwalp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

class MongoLib {
    async connect() {
        if (MongoLib.connection != null) {
            return MongoLib.connection.db(DB_NAME)
        }
        try {
            MongoLib.connection = await MongoClient.connect(MONGO_URI)
            console.log('Conexión a MongoDB exitosa.')
            return MongoLib.connection.db(DB_NAME)
        } catch (e) {
            console.log('Error en conexión a MongoDB.')
            return e
        }
    }

    async getDatos(nombreColeccion) {
        try {
            const db = await this.connect()
            return await db.collection(nombreColeccion).find().toArray()
        } catch (e) {
            return e
        }
    }

    async insertar(nombreColeccion, datos) {
        try {
            const db = await this.connect()
            return await db.collection(nombreColeccion).insertOne(datos)
        } catch (e) {
            throw new Error(
                `Error al insertar en la colección ${nombreColeccion}`
            )
        }
    }

    async eliminar(nombreColeccion, consulta) {
        try {
            const db = await this.connect()
            return await db.collection(nombreColeccion).deleteOne(consulta)
        } catch (e) {
            throw new Error(
                `Error al eliminar en la colección ${nombreColeccion}`
            )
        }
    }

    async actualizar(nombreColeccion, consulta, datos) {
        try {
            const db = await this.connect()
            return await db.collection(nombreColeccion).updateOne(consulta, { $set: datos })
        } catch (e) {
            throw new Error(
                `Error al actualizar en la colección ${nombreColeccion}`
            )
        }
    }
}

module.exports = MongoLib
