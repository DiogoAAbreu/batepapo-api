import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getParticipants, postParticipants } from './controllers/participants.js';

const app = express();

app.use(cors());

app.use(express.json());

app.post('/participants', postParticipants);
app.get('/participants', getParticipants);

app.listen(5000, () => {
    console.log('Run in localhost://5000')
});