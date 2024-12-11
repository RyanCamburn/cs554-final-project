import { NextApiRequest, NextApiResponse } from "next";
import { createAnnouncement } from "../../../data/annoucementData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const id = await createAnnouncement(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
}
