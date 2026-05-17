import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

type AppSession = {
  user: {
    id: string;
    role: string;
  } & NonNullable<DefaultSession["user"]>;
  token?: JWT;
};

type AppUser = {
  role?: string;
};

declare module "@auth/core/types" {
  interface Session {
    user: AppSession["user"];
    token?: AppSession["token"];
  }

  interface User {
    role?: AppUser["role"];
  }
}

declare module "next-auth" {
  interface Session {
    user: AppSession["user"];
    token?: AppSession["token"];
  }

  interface User {
    role?: AppUser["role"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    signedToken?: string;
  }
}
