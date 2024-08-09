import NextAuth from "next-auth"
import { NestedUser } from "@/data/api/types/model"

declare module "next-auth" {
    interface Session {
        user: NestedUser
    } 
}