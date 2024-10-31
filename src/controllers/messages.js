import dayjs from "dayjs";
import { messageSchema } from "../schemas/messagesSchemas.js";
import { db } from "../connection.js"

export async function postMessage(req, res) {
    const { to, text, type } = req.body;
    const { user } = req.headers;

    try {
        const participant = await db.collection('participants').findOne({ name: user });
        const validMessage = messageSchema.validate({ to, text, type }, { abortEarly: false });

        if (!participant || validMessage.error) {
            return res.sendStatus(422);
        }

        if (type !== 'message' || type !== 'private_message') {
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
        console.log(error.message);

        return res.sendStatus(500);
    }
}