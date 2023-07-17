import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import notify from './notify.js'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Alive!');
});

app.post('/notify', async(req, res) => {
    if (!req.body) {        
        throw new Error("Body empty...Resend request with data in body")        
    }
    const body = req.body
    const result = await notify(body.addresses, body.message)
    if (result === 'success') {
        res.send({ status: 'success', msg: 'email sent'})
    } else {
        res.send({ status: 'error', msg: 'something went wrong'})
    }
})

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});