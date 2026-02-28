import { DefaultSession, DefaultUser } from "next-auth";
import { Role, MemberRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      organizationId: string | null;
      memberRole: MemberRole | null;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    organizationId: string | null;
    memberRole: MemberRole | null;
  }
}
