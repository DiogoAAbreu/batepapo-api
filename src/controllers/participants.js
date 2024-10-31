import dayjs from "dayjs";
import { participantsSchema } from '../schemas/partcipantsSchemas.js';
import { db } from '../connection.js';

export async function postParticipants(req, res) {
    const { name } = req.body;

    try {
        const validParticipant = participantsSchema.validate({ name }, { abortEarly: false })
        if (validParticipant.error) {
            return res.sendStatus(422);
        }

        const participantExists = await db.collection('participants').findOne({ name: name });

        if (participantExists) {
            return res.sendStatus(409);
        }

        const participant = {
            name,
            lastStatus: Date.now()
        };

        await db.collection('participants').insertOne(participant);

        const time = dayjs().format('HH:mm:ss');

        const message = {
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: time
        }

        await db.collection('messages').insertOne(message);

        return res.sendStatus(201);
    } catch (error) {
        console.log(error.message)
    }
}