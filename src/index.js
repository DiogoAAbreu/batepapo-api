import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getParticipants, postParticipants } from './controllers/participants.js';
import { deleteMessage, getMessages, postMessage } from './controllers/messages.js';
import { setStatus } from './controllers/status.js';
import { db } from './connection.js';
import dayjs from 'dayjs';

const app = express();

app.use(cors());

app.use(express.json());

app.post('/participants', postParticipants);
app.get('/participants', getParticipants);

app.post('/messages', postMessage);
app.get('/messages', getMessages)
app.delete('/messages/:id', deleteMessage)

app.post('/status', setStatus);

setInterval(async () => {
    const participants = await db.collection('participants').find({}).toArray();
    participants.map(async (participant) => {
        if ((Date.now() - participant.lastStatus) > 10000) {
            const time = dayjs().format('HH:mm:ss');

            const messageLogout = {
                from: participant.name,
                to: 'Todos',
                text: 'sai da sala...',
                type: 'status',
                time
            }
            await db.collection('messages').insertOne(messageLogout);
            await db.collection('participants').deleteOne({ _id: participant._id });
        }
    })
}, 15000)

app.listen(5000, () => {
    console.log('Run in localhost://5000')
});