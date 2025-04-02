"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Table, { Column } from "@/components/custom/Table";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc/trpc";
import { Ticket, TicketResponse } from "@prisma/client";

const TicketCard = ({ ticket, handleClose, onDelete }: { ticket: Ticket & {responses?: TicketResponse[]}; handleClose: () => void, onDelete: () => void }) => {
    const deleteTicketMutation = trpc.tickets.DeleteTicket.useMutation()
    
    const handleClickOK = async () => {
        await deleteTicketMutation.mutateAsync({ id: ticket.id });
        onDelete(); // Atualiza a lista após a exclusão
    }

    if(deleteTicketMutation.isLoading){
        return <LoadingScreen message={`Deletando ticket ${ticket.id}...`} />
    }

    
    return (
        <div className="cursor-pointer p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <h2 className="text-lg font-semibold text-white">{ticket.subject}</h2>
            <p className="text-sm text-gray-400">{ticket.status} | Prioridade: {ticket.priority}</p>
            <p className="text-xs text-gray-500">Mensagem: {ticket.message}</p>
            <p className="text-xs text-gray-500">Criado em: {ticket.createdAt.toISOString()}</p>        
            <p className="text-xs text-gray-500">Última atualização: {ticket.updatedAt.toISOString()}</p>

            {ticket.responses?.length ? (
                <div>
                    {ticket.responses.map((response: TicketResponse, index: number) => (
                        <p key={`ticket-response-[${index}]`} className="text-lg font-semibold text-white">
                            Resposta: {response.message}
                        </p>
                    ))}                    
                    <div className="flex justify-between w-80">
                        <Button 
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
                            onClick={handleClickOK}
                        >
                            OK - Fechar Ticket
                        </Button>

                        <Button 
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200"
                            onClick={handleClose}
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            ): (
                <Button 
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200"
                    onClick={handleClose}
                >
                    Fechar
                </Button>
            )}

        </div>
    );
}


export function TicketSection() {
    const trpc_utils = trpc.useUtils()
    const myTicketsQuery = trpc.tickets.MyTickets.useQuery();
    const addTicketsMutation = trpc.tickets.AddTicket.useMutation();
    const [tickets, setTickets] = useState<Ticket[]>([]);    
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: "", message: "", priority: "baixa" });
    
    const addTicket = async () => {
        if (!newTicket.subject || !newTicket.message) return;
        
        if (!["baixa", "média", "alta"].includes(newTicket.priority)) {
            console.error("Prioridade inválida:", newTicket.priority);
            return;
        }
    
        const ticket = {                        
            subject: newTicket.subject,
            message: newTicket.message,                        
            priority: newTicket.priority as "baixa" | "média" | "alta", 
        };

        const buildTicket = await addTicketsMutation.mutateAsync(ticket)    
        setTickets([...tickets, buildTicket]);
        setIsAdding(false);
        setNewTicket({ subject: "", message: "", priority: "baixa" });
        await trpc_utils.tickets.MyTickets.refetch()
    };
    
    const openTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };
    
    const closeTicket = () => {
        setSelectedTicket(null);
    };
    
    const columns: Column<Ticket>[] = [
        { 
            key: "subject",     
            label: "Assunto",        
            render: (row) => <Button onClick={() => openTicket(row)}> {row.subject} </Button>
        },
        { key: "status",    label: "Status"         },
        { key: "priority",  label: "Prioridade"     },
        { key: "createdAt", label: "Criado Em", render: (row) => row.createdAt.toISOString() },        
    ];

    useEffect(() => {
        if(myTicketsQuery.data) {
            setTickets(myTicketsQuery.data);
        }
    }, [myTicketsQuery.data, myTicketsQuery.isLoading]);
    
    if (myTicketsQuery.isLoading) {
        return <LoadingScreen message="Carregando tickets..." />;
    }

    const handleDeleteTicket = () => {
        // Atualize a lista de tickets após a exclusão
        setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== selectedTicket?.id));
        closeTicket(); // Fecha o modal de ticket
    };

    return (
        <div className="p-6 bg-gray-950 text-white min-h-screen">
            <h1 className="text-2xl font-bold">Meus Tickets</h1>
            {selectedTicket && <TicketCard handleClose={closeTicket} ticket={selectedTicket} onDelete={handleDeleteTicket}/> }
            
            <Button onClick={() => setIsAdding(true)} className="my-4 bg-blue-600 hover:bg-blue-700">Adicionar Ticket</Button>
            <Table columns={columns} data={tickets} />

            {isAdding && (
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogContent className="bg-gray-900 text-white border-gray-700 p-6 rounded-lg">
                        <DialogTitle>Adicionar Novo Ticket</DialogTitle>
                        <DialogDescription>
                            <input 
                                type="text" 
                                placeholder="Assunto" 
                                value={newTicket.subject} 
                                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} 
                                className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded text-white"
                            />
                            <textarea 
                                placeholder="Mensagem" 
                                value={newTicket.message} 
                                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} 
                                className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded text-white"
                            />
                            <select 
                                value={newTicket.priority} 
                                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} 
                                className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded text-white"
                            >
                                <option value="baixa">Baixa</option>
                                <option value="média">Média</option>
                                <option value="alta">Alta</option>
                            </select>
                        </DialogDescription>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => setIsAdding(false)} className="bg-red-600 hover:bg-red-700 mr-2">Cancelar</Button>
                            <Button onClick={addTicket} className="bg-green-600 hover:bg-green-700">Salvar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}            
        </div>
    );
}
