import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin-config";
import { customInitApp } from "@/lib/firebase-admin-config";

customInitApp()

//Get the user from the session cookie
//if theres no session or its invalid, return null
const getUser = async ()=> {
  const session = cookies().get("session")?.value;
  if (!session) {
    return null;
  }
  const user = await adminAuth.verifySessionCookie(session, true);
  return user;
}

export default getUser