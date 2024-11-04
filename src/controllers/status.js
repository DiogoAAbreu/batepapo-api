import { db } from '../connection.js';
import { ObjectId } from 'mongodb';

export async function setStatus(req, res) {
    const { user } = req.headers;

    try {
        const existingUser = await db.collection('participants').findOne({ name: user });

        if (!existingUser) {
            return res.sendStatus(404);
        }

        const lastStatus = Date.now();

        await db.collection('participants').upadateOne({ _id: ObjectId(existingUser._id) }, { $set: lastStatus })

        return res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
}