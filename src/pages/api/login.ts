import { getAuth } from "firebase-admin/auth";
import { serialize } from "cookie";
import { firebase } from "@/firebase/admin-config";

export default async function handler(req, res) {
  // 1. Check if the HTTP method is POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  // 2. Parse the token from the request body
  const { token } = req.body;

  // 3. Validate that the token exists
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // 4. Verify the token with Firebase Admin SDK
    const decodedToken = await getAuth(firebase).verifyIdToken(token);

    // 5. Set the token in a secure, HTTP-only cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
      sameSite: "strict",
    });

    // 6. Add the cookie to the response headers
    res.setHeader("Set-Cookie", cookie);

    // 7. Send a success response with optional user data
    return res.status(200).json({ message: "Login successful", uid: decodedToken.uid });
  } catch (error) {
    // 8. Handle errors (e.g., invalid or expired token)
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}