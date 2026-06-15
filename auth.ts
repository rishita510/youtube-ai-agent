// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "./lib/prisma"

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     session({ session, user }) {
//       session.user.id = user.id
//       return session
//     },
//   },
// })
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "./lib/prisma"

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "database",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     session({ session, user }) {
//       session.user.id = user.id
//       return session
//     },
//   },
//   pages: {
//     signIn: "/",
//   },
// })

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        checks: ["none"],
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})