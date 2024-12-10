import { NextApiRequest, NextApiResponse } from "next";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, message, scheduleDate, expirationDate, active } = req.body;

  // Validate required fields
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message must not be empty" });
  }

  try {
    const newAnnouncement = {
      type,
      message,
      scheduleDate: Timestamp.fromDate(new Date(scheduleDate)),
      expirationDate: Timestamp.fromDate(new Date(expirationDate)),
      active,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, "announcements"),
      newAnnouncement
    );
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
}
