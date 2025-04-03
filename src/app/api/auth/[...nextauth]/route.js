import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASS;
        if (credentials.username === adminUser && credentials.password === adminPass) {
          return { id: 1, name: "Admin", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 86400 // Session will be valid for 1 day (86400 seconds)
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
