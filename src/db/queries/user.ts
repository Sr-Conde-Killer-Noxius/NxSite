import { GroupMember, Payment, TelegramGroup }    from "@prisma/client";
import { BACKEND_FULL_User, User, UserSchema }                                   from "@/models/user";
import prisma                                           from "@/db/prisma";
import { z }                                            from "zod";
import { TRPCError } from "@trpc/server";


// Tipagem para criação e atualização de usuário
type CreateUserInput = Omit<z.infer<typeof UserSchema>, 'createdAt'|'id'>;
type UpdateUserInput = Partial<CreateUserInput>;

type UserWithRelations = User & {
    groups:             TelegramGroup[],
    memberships:        GroupMember[],
    payments:           Payment[],
};

/**
 * @function createUser
 * @description Cria um novo usuário na plataforma após validar os dados de entrada.
 * @param {CreateUserInput} user - Dados do usuário a serem cadastrados.
 * @returns {Promise<User>} Usuário criado no banco de dados.
 * @throws {Error} Se os dados forem inválidos.
 */
export const createUser = async (user: CreateUserInput): Promise<BACKEND_FULL_User> => {
    const parsed = UserSchema.safeParse(user);
    if (!parsed.success) {
        console.log(parsed.error)
        throw new TRPCError({
                code:       "BAD_REQUEST",
                message:    parsed.error.errors.map((issue: z.ZodIssue) => {
                    console.log(issue.path.join(":"))
                    return issue.path.join(":")
                }).join(', ')
        })        
    }

    return await prisma.user.create({
        data: parsed.data,
    });
};


/**
 * @function getUserById
 * @description Busca um usuário pelo ID e retorna seus dados completos, incluindo relacionamentos.
 * @param {string} id - ID único do usuário.
 * @returns {Promise<UserWithRelations | null>} Usuário encontrado ou `null` se não existir.
 * @throws {Error} Se o ID for inválido.
 */
export const getUserById = async (id: string): Promise<UserWithRelations | null> => {
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) {
        throw new Error("ID inválido.");
    }

    return await prisma.user.findUnique({
        where: { id: parsed.data },
        include: {
            payments:       true,
            groups:         true,
            memberships:    true
        }
    });
};
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Número de telefone inválido",
});
/**
 * @function getUserByPhone
 * @description Busca um usuário pelo phone e retorna seus dados completos, incluindo relacionamentos.
 * @param {string} phone - Phone cadastrado
 * @returns {Promise<BACKEND_FULL_User | null>} Usuário encontrado ou `null` se não existir.
 * @throws {Error} Se o phone for inválido.
 */
export const getUserByPhone = async (phone: string): Promise<BACKEND_FULL_User | null> => {    
    const parsed = z.string().safeParse(phone)
    if (!parsed.success) {
        throw new TRPCError({
            code:       "BAD_REQUEST",
            message:    "Numero invalido"
        })
    }

    return prisma.user.findFirst({
        where: { phone: parsed.data }
    })
}
/**
 * @function getUserById
 * @description Busca um usuário pelo email e retorna seus dados completos, incluindo relacionamentos.
 * @param {string} email - Email cadastrado
 * @returns {Promise<BACKEND_FULL_User | null>} Usuário encontrado ou `null` se não existir.
 * @throws {Error} Se o email for inválido.
 */
export const getUserByEmail = async (email: string): Promise<BACKEND_FULL_User | null> => {
    const parsed = z.string().email().safeParse(email)
    if (!parsed.success) {
        throw new Error("Email invalido")
    }

    return prisma.user.findFirst({
        where: { email: parsed.data }        
    })
}
/**
 * @function getAllUsers
 * @description Retorna uma lista com todos os usuários da plataforma.
 * @returns {Promise<UserWithRelations[]>} Lista de usuários cadastrados.
 */
type IncludeUserRelations = {
    groups:         boolean
    memberships:    boolean
    payments:       boolean
}
export const getAllUsers = async (): Promise<UserWithRelations[]> => {
    const relations: IncludeUserRelations = {
        groups:         true,
        memberships:    true,
        payments:       true,
    }

    return await prisma.user.findMany({
        include: relations,
        omit: { passwd: true }
    });
};

/**
 * @function updateUser
 * @description Atualiza um usuário existente no banco de dados.
 * @param {string} id - ID do usuário a ser atualizado.
 * @param {UpdateUserInput} userData - Dados a serem atualizados (nome e/ou telefone).
 * @returns {Promise<User>} Usuário atualizado.
 * @throws {Error} Se o ID ou os dados forem inválidos.
 */
export const updateUser = async (id: string, userData: UpdateUserInput): Promise<User> => {
    const parsedId = z.string().uuid().safeParse(id);
    if (!parsedId.success) {
        throw new Error("ID inválido.");
    }

    const parsedData = UserSchema.partial().safeParse(userData);
    if (!parsedData.success) {
        throw new Error(parsedData.error.errors.map(err => err.message).join(", "));
    }

    return await prisma.user.update({
        where: { id: parsedId.data },
        data: parsedData.data,
    });
};

/**
 * @function deleteUser
 * @description Exclui um usuário do banco de dados.
 * @param {string} id - ID do usuário a ser removido.
 * @returns {Promise<User>} Usuário excluído.
 * @throws {Error} Se o ID for inválido.
 */
export const deleteUser = async (id: string): Promise<User> => {
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) {
        throw new Error("ID inválido.");
    }

    return await prisma.user.delete({
        where: { id: parsed.data },
    });
};
