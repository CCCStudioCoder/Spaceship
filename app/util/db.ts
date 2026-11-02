import {projectTable, userTable} from "@/app/db/schema";
import HttpStatusCode from "@/app/util/status-code";

export function dbError(e: any) {
    return Response.json({error: "Database or internal error: " + e}, {status: HttpStatusCode.INTERNAL_SERVER_ERROR});
}

export type User = typeof userTable.$inferSelect;
export type Project = typeof projectTable.$inferSelect;

export const SUCCESSFUL = Response.json({}, {status: HttpStatusCode.OK});