import {randomBytes} from "node:crypto";
import {cookies} from "next/headers";
import {db} from "@/app/db";
import {userTable} from "@/app/db/schema";
import {verify} from "argon2";
import {dbError, User} from "@/app/util/db";

export function createSession() {
    return randomBytes(32).toString("hex");
}

export function checkExpire(creation: number) {
    return creation + 1000 * 60 * 60 * 24 * 30 < Date.now();
}

export async function validateSession(): Promise<[Response, boolean, User?]> {
    try {
        const session = await cookies().then(store => store.get("session"));

        if(!session?.value) {
            return [Response.json({error: "Session required"}, {status: 400}), false];
        }

        const users: User[] = await db.select().from(userTable);
        let sessionUser: User | undefined;
        for(const user of users) {
            if(await verify(session.value, user.sessionKey)) {
                sessionUser = user;
                break;
            }
        }

        if(!sessionUser) {
            return [Response.json({error: "Invalid session"}, {status: 401}), false];
        }
        if(checkExpire(sessionUser.sessionKeyCreation)) {
            return [Response.json({error: "Old session"}, {status: 401}), false];
        }

        return [Response.json({...sessionUser}, {status: 200}), true, sessionUser];
    }

    catch(e) {
        return [dbError(e), false];
    }
}