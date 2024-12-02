import credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

export default {
	providers: [
		credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				const user = await prisma.user.findUnique({
					where: {
						email: credentials?.email as string,
						password: credentials?.password as string,
					},
				});

				if (!user || user.password !== credentials?.password) {
          console.log("Credenciais inválidas.");
          return null;
        }

				return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Incluindo o role
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
