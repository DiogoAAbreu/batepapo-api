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
            time
        }

        await db.collection('messages').insertOne(message);

        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getParticipants(req, res) {
    try {
        const participants = await db.collection('participants').find({}).toArray();

        return res.status(200).send(participants)
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}