import dayjs from "dayjs";
import { messageSchema } from "../schemas/messagesSchemas.js";
import { db } from "../connection.js"

export async function postMessage(req, res) {
    const { to, text, type } = req.body;
    const { user } = req.headers;

    try {
        const participant = await db.collection('participants').findOne({ name: user });
        const validMessage = messageSchema.validate({ to, text, type }, { abortEarly: false });

        if (!participant) {
            return res.sendStatus(422);
        }

        if (validMessage.error) {
            const errors = validMessage.error.details.map(error => error.message)
            return res.status(422).send(errors);
        }

        if (type !== 'message' && type !== 'private_message') {
            return res.sendStatus(422);
        }

        const time = dayjs().format('HH:mm:ss');

        const message = {
            from: participant.name,
            to,
            text,
            type,
            time
        };

        await db.collection('messages').insertOne({ message });

        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getMessages(req, res) {
    const { limit } = req.query;
    const { user } = req.headers;

    try {
        if (limit) {
            const numLimit = Number(limit);

            if (isNaN(numLimit)) {
                return res.sendStatus(400);
            }

            const messages = await db.collection('messages').find({}).sort({ _id: -1 }).limit(numLimit).toArray();

            return res.status(200).send(messages)
        }
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}