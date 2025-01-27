import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { postgres } from "@/postgres";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(postgres),
  providers: [
    Resend({
      from: "daniel@mail.danielbacsur.dev",
    }),
  ],
});
