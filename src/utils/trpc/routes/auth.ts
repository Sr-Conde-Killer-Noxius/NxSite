import { publicProcedure, requireAuthProcedure } from "@/utils/trpc/procedures";
import t from "../context";
import { BACKEND_FULL_User, User, UserSchema } from "@/models/user";
import { createUser, getUserByEmail, getUserByPhone } from "@/db/queries/user";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { StatusCodes } from "http-status-codes";
import prisma from "@/db/prisma";
export const JWT_SECRET: string = process.env.JWT_SECRET as string


if(!JWT_SECRET){
    throw new Error("Failed to setup JWT_SECRET")
}

export const authRouter = t.router({
    signup: publicProcedure
        .input(UserSchema.pick({ email: true, passwd: true, name: true, phone: true}))        
        .mutation(async ({ input }) => {            
            const emailCadastred: boolean   = (await getUserByEmail(input.email)) != null;
            const phoneCadasted:  boolean   = (await getUserByPhone(input.phone)) != null;

            if(emailCadastred || phoneCadasted) {                
                throw new TRPCError({
                    code:       "BAD_REQUEST",
                    message:    "Credenciais já cadastradas"
                })
            }

            
            // Hash the password before saving it            
            const hashedPassword = await hash(input.passwd, 10);
            // Create the user in the database (assuming a `createUser` function exists)            
            const newUser = await createUser({ 
                ...input, 
                passwd: hashedPassword });

            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            // @ts-nocheck
            const {passwd, ...user} = newUser
            
            return {
                success:    true,
                user:       user,
                token:      token
            }            
        }),

    login: publicProcedure
        .input(UserSchema.pick({ email: true, passwd: true }))
        .mutation(async ({ input }) => {
            const backendFullUser: BACKEND_FULL_User | null = await getUserByEmail(input.email);
            

            if (!backendFullUser) {
                throw new TRPCError({
                    code:       "UNAUTHORIZED",
                    message:    "Invalid email or password"
                });
            }

            // Verify the password
            const isValidPassword = await compare(input.passwd, backendFullUser.passwd);
            if (!isValidPassword) {
                throw new TRPCError({
                    code:       "UNAUTHORIZED",
                    message:    "Invalid email or password",
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: backendFullUser.id, email: backendFullUser.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            
            const {passwd, ...user} = backendFullUser
            return {
                status:     StatusCodes.OK,                
                user:       user    as User,
                token:      token   as string
            }            
    }),
    
    me: publicProcedure
        .query(async ({ ctx }) => {                        
            return { user: ctx.user }
        }),


    myPermissions: 
        publicProcedure
        .query(async ({ ctx }) => {
            if(!ctx.user || !ctx.user?.id){ 
                return new TRPCError({
                   code:        "UNAUTHORIZED",
                   message:     "sem permissões"
                })
            }
            
            
            return await prisma.permission.findMany({
                where: { 
                    users: { 
                        some: { 
                            userId: ctx.user.id 
                        } 
                    },                    
                },
            })
        })
});
