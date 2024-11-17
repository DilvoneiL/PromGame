import credentials from "next-auth/providers/credentials";


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

				if (!user) {
					console.log("Não logado.");
					return null;
				}

				return user;
			},
		}),
	],
};

