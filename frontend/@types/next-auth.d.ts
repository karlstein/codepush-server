import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
    } & DefaultSession["user"];
    expires: DefaultSession["expires"];
    authToken?: string;
  }
}
