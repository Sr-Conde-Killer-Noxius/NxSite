"use client";
import withPermissions from "@/components/custom/security/withPermision";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc/trpc";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { Ticket } from "@prisma/client";

// Definição das colunas, sem a coluna ID
const columns: ColumnDef<any>[] = [    
    { accessorKey: "subject",   header: "Assunto" },
    { accessorKey: "status",    header: "Status" },
    { accessorKey: "createdAt", header: "Data" },
];

const SupportTicketsPage = () => {
    const trpc_utils = trpc.useUtils()
    const { data: tickets, isLoading } = trpc.tickets.GetAllTickets.useQuery();
    const [selectedTicket, setSelectedTicket] = useState<Ticket| null>(null);
    const [response, setResponse] = useState("");
    const answerTicketMutation = trpc.tickets.AnswerTicket.useMutation({    
        onSuccess: async () => await trpc_utils.tickets.GetAllTickets.refetch()
    })
    
    const table = useReactTable({ data: tickets || [], columns, getCoreRowModel: getCoreRowModel() });
    

    const handleResponse = async () => {        
        if(!selectedTicket) return
                
        await answerTicketMutation.mutateAsync({
            message:    response,
            ticketId:   selectedTicket.id
        })
        
        
        setResponse("");
        setSelectedTicket(null);
        
    };

    useEffect(() => {
        if (tickets) {
            console.log("Tickets carregados:", tickets);
        }
    }, [tickets]);
    
    // Se estiver carregando, mostra a tela de loading
    if (isLoading) {
        return <LoadingScreen message="Carregando tickets..." />;
    }

    if(answerTicketMutation.isLoading){
        return <LoadingScreen message="Carregando tickets..." />;
    }

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-white">Atendimento de Tickets</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LISTA DE TICKETS */}
                <Card className="bg-gray-800 shadow-md text-white text-center">
                    <CardHeader><CardTitle>Tickets Abertos</CardTitle></CardHeader>                    
                    <CardContent>
                        <Table className="w-full text-left text-white">
                            <TableHeader>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowCount() === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={table.getVisibleFlatColumns().length} className="text-center">
                                            Nenhum ticket esperando resposta!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow 
                                            key={row.id} 
                                            className="hover:bg-gray-700 cursor-pointer text-white" 
                                            onClick={() => setSelectedTicket(row.original)}
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* DETALHES DO TICKET */}
                {selectedTicket && (
                    <Card className="bg-gray-800 shadow-md text-white">
                        <CardHeader>
                            <CardTitle>Detalhes do Ticket</CardTitle>
                        </CardHeader>
                        <CardContent>                            
                            <p><strong>Assunto:</strong> {selectedTicket.subject}</p>
                            <p><strong>Mensagem:</strong> {selectedTicket.message}</p>
                            <p><strong>Status:</strong> {selectedTicket.status}</p>
                            <p><strong>Data:</strong> {new Date(selectedTicket.createdAt).toUTCString()}</p>

                            {/* ÁREA DE RESPOSTA */}
                            <Textarea
                                className="mt-4"
                                value={response}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponse(e.target.value)}
                                placeholder="Digite sua resposta aqui..."
                            />
                            <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={handleResponse}>Enviar Resposta</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default withPermissions([], SupportTicketsPage);
