import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
            profile(profile) {
                // Yahan hum GitHub se uska username (login) nikal rahe hain
                return {
                    id: profile.id.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    githubUsername: profile.login, // <-- ASLI GITHUB USERNAME
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Token mein save karo
            if (user) {
                token.githubUsername = (user as any).githubUsername;
            }
            return token;
        },
        async session({ session, token }) {
            // Session mein bhej do taaki Navbar use kar sake
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).githubUsername = token.githubUsername;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };