import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authSecret = process.env.NEXTAUTH_SECRET;

if (!clientId || !clientSecret || !authSecret) {
  throw new Error(
    "Missing auth env vars. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET in .env.local"
  );
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  secret: authSecret,
});

export { handler as GET, handler as POST };
