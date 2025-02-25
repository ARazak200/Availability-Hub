// backend/server.js

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase
const serviceAccount = require("./firebase-admin-sdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const SLOTS_COLLECTION = "rota_slots";

// Get all slots
app.get("/slots", async (req, res) => {
    try {
        const snapshot = await db.collection(SLOTS_COLLECTION).get();
        const slots = {};
        snapshot.forEach((doc) => {
            slots[doc.id] = doc.data().users || [];
        });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch slots" });
    }
});

// Sign up for a slot
app.post("/signup", async (req, res) => {
    const { slot, name } = req.body;
    if (!slot || !name) return res.status(400).json({ error: "Missing slot or name" });

    try {
        const slotRef = db.collection(SLOTS_COLLECTION).doc(slot);
        const slotData = await slotRef.get();
        const users = slotData.exists ? slotData.data().users || [] : [];

        if (users.length >= 4) {
            return res.status(400).json({ error: "Slot is full" });
        }

        users.push(name);
        await slotRef.set({ users });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: "Failed to sign up" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
