import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express();

app.use(cors());

app.use(express.json());



app.listen(5000, () => {
    console.log('Run in localhost://5000')
})