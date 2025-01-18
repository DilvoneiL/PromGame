import credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // Importa o jsonwebtoken para criar o JWT
const prisma = new PrismaClient();
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
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      

      // Aqui você pode gerar um JWT completo com a biblioteca jsonwebtoken
      const payload = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        image: token.image,
        iat: Math.floor(Date.now() / 1000), // Tempo de criação do token
        exp: Math.floor(Date.now() / 1000) + 3600, // Expiração do token (1 hora)
      };

      // Assina o JWT (gerando o Header + Payload + Signature)
      const signedToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { algorithm: 'HS256' });

      // Log do JWT completo (Header + Payload + Signature)
      console.log("JWT Completo (Header + Payload + Signature):", signedToken);

      // Retorna o token com a assinatura completa
      token.signedToken = signedToken;

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.token = token.signedToken;
      console.log("Session:", session);
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
