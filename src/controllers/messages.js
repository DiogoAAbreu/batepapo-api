import dayjs from "dayjs";
import { messageSchema, putMessageSchema } from "../schemas/messagesSchemas.js";
import { db } from "../connection.js"
import { ObjectId } from "mongodb";

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

        await db.collection('messages').insertOne(message);

        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getMessages(req, res) {
    const { limit } = req.query;
    const { user } = req.headers;

    try {
        const query = {
            $or: [
                { type: 'message' },
                { to: user },
                { from: user },
                { type: 'status' }
            ]
        };

        if (limit) {
            const numLimit = Number(limit);

            if (isNaN(numLimit)) {
                return res.sendStatus(400);
            }

            const messages = await db.collection('messages').find(query).sort({ _id: -1 }).limit(numLimit).toArray();

            return res.status(200).send(messages.reverse());
        }

        const messages = await db.collection('messages').find(query).sort({ _id: -1 }).toArray();

        return res.status(200).send(messages);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function deleteMessage(req, res) {
    const { user } = req.headers;
    const { id } = req.params;


    try {
        const messageExists = await db.collection('messages').findOne({ _id: new ObjectId(id) });

        if (!messageExists) {
            return res.sendStatus(404);
        }

        if (user != messageExists.from) {
            return res.sendStatus(401);
        }

        await db.collection('messages').deleteOne({ _id: new ObjectId(id) });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function putMessage(req, res) {
    const { id } = req.params;
    const { to, text, type } = req.body;
    const { user } = req.headers;

    try {
        const newMessage = {
            from: user,
            text,
            to,
            type
        }

        const messageValidade = putMessageSchema.validate(newMessage, { abortEarly: false });

        if (messageValidade.error) {
            const erros = messageValidade.error.details.map(error => error.message);
            return res.status(422).send(erros);
        }

        const messageExists = await db.collection('messages').findOne({ _id: new ObjectId(id) });

        if (!messageExists) {
            return res.sendStatus(404);
        }

        const participantExists = await db.collection('participants').findOne({ name: user });

        if (!participantExists) {
            return res.sendStatus(404);
        }

        if (messageExists.from !== user) {
            return res.sendStatus(401);
        }

        await db.collection('messages').updateOne({ _id: messageExists._id }, { $set: newMessage });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error);
    }
}