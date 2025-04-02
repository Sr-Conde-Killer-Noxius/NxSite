import { z } from "zod";
import { publicProcedure } from "@/utils/trpc/procedures";
import t from "../context";
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from "@/db/queries/user"; 
import { UserSchema } from "@/models/user";

export const userRouter = t.router({
    /**
     * @mutation createUser
     * @description Cria um novo usuário após validar os dados de entrada.
     */
    createUser: publicProcedure
        .input(UserSchema)
        .mutation(async ({ input }) => {
            return await createUser(input);
        }),

    /**
     * @query getUserById
     * @description Busca um usuário pelo ID e retorna seus dados completos.
     */
    getUserById: publicProcedure
        .input(z.string().uuid("ID inválido."))
        .query(async ({ input }) => {
            return await getUserById(input);
        }),

    /**
     * @query getAllUsers
     * @description Retorna todos os usuários cadastrados.
     */
    getAllUsers: publicProcedure
        .query(async () => {
            return await getAllUsers();
        }),

    /**
     * @mutation updateUser
     * @description Atualiza os dados de um usuário específico.
     */
    updateUser: publicProcedure
        .input(z.object({
            id: z.string().uuid("ID inválido."),
            name: z.string().optional(),
            phone: z.string().min(10).optional()
        }))
        .mutation(async ({ input }) => {
            return await updateUser(input.id, { name: input.name, phone: input.phone });
        }),

    /**
     * @mutation deleteUser
     * @description Remove um usuário do banco de dados pelo ID.
     */
    deleteUser: publicProcedure
        .input(z.string().uuid("ID inválido."))
        .mutation(async ({ input }) => {
            return await deleteUser(input);
        }),
});
