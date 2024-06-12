import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://primeraEntrega:132132132@zettacluster.hoh8p1r.mongodb.net/ecommerceSession?retryWrites=true&w=majority&appName=ZettaCluster')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB')
})

export default db