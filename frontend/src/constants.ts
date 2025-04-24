import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { login } from "@/api/fetch";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }

      if (account?.provider === "google") {
        await login({
          user: {
            authId: account.userId || "",
            email: user.email || "",
            provider: "google",
            Name: user.name || "",
            imageUrl: user.image || "",
            isSuper: true,
          },
          provider_access_token: account.access_token || "",
        })
          .then(({ data }) => {
            token.authToken = data.data.token;
          })
          .catch((err) => {
            console.error("\u231B cp-server - login err", err);
          });
      }

      return token;
    },
    redirect: () => {
      return "/project";
    },
    async session({ session, token }) {
      if (token.authToken) session.authToken = token.authToken as string;

      return session;
    },
  },
};
