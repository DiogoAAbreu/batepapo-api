import { MongoClient } from 'mongodb'

const mongoCliente = new MongoCliente(process.env.MONGO_URI)

export let db;

mongoCliente.connect().then(() => {
    db = mongoCliente.db('batepapo');
})
