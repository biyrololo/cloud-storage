// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name?: string | null;
      image?: string | null;
      maxSpace?: number | null;
      usedSpace?: number | null;
    };
  }
}