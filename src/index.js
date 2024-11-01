import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getParticipants, postParticipants } from './controllers/participants.js';
import { getMessages, postMessage } from './controllers/messages.js';

const app = express();

app.use(cors());

app.use(express.json());

app.post('/participants', postParticipants);
app.get('/participants', getParticipants);

app.post('/messages', postMessage);
app.get('/messages', getMessages)

app.listen(5000, () => {
    console.log('Run in localhost://5000')
});