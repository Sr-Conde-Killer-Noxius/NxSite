"use client";

import { useState, useMemo, useEffect } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc/trpc";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { User } from "@/models/user";






export default function UsersPage() {
    const usersQuery = useMemo(() => {
        return trpc.user.getAllUsers.useQuery()        
    }, [])
    const [users, setUsers] = useState<User[]>([]);
    const meQuery = trpc.auth.me.useQuery()
    // Função para deletar usuário (Apenas console.log)
    const deleteUser = (id?: string) => {
        console.log("Deletando usuário com ID:", id);
    };

    // Definição das colunas da tabela
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { accessorKey: "name",          header: "Nome" },
            { accessorKey: "email",         header: "E-mail" },
            { accessorKey: "phone",         header: "Telefone" },
            { accessorKey: "createdAt",     header: "Criado Em" },
            { accessorKey: "plan",          header: "Plano" },            
            {
                header: "Ações",
                cell: ({ row }: CellContext<User, unknown>) => (                    
                    <Button variant="destructive" onClick={() => deleteUser(row.original.id)}>
                        Deletar
                    </Button>
                ),
            },
        ],
        []
    );
    useEffect(() => {
        if(usersQuery.data) {
            setUsers(usersQuery.data)
        }
    }, [usersQuery.isLoading, usersQuery.data])

    if(usersQuery.isLoading || meQuery.isLoading){
        return <LoadingScreen message="Carregando usuarios..." />
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Monitoramento de Usuários</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column: ColumnDef<User>, index: number) => (
                            <TableHead key={`${column.id}-${index}`}>{column.header as string}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.createdAt? user.createdAt.toString(): "..."}</TableCell>                            
                            <TableCell>R$ {(0).toFixed(2)}</TableCell>
                            <TableCell>
                                { meQuery.data && user.id !== meQuery.data.user?.id
                                ? (
                                    <Button variant="destructive" onClick={() => deleteUser(user.id)}>
                                        Deletar
                                    </Button>
                                ): null}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
