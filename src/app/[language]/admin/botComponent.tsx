"use client"
import withPermissions              from "@/components/custom/security/withPermision";
import { useEffect, useState }      from "react";
import Table, { Column }            from "@/components/custom/Table";
import LoadingScreen                from "@/components/custom/LoadingScreen";
import { trpc }                     from "@/utils/trpc/trpc";

interface IBot {
    name:   string;
    status: string;
}

function BotPage() {
    const botStatusQuery = trpc.health.botStatus.useQuery()    
    const columns: Column<IBot>[] = [
        { key: "name",      label: "Nome" },
        { key: "status",    label: "Status" },
    ];    
    const [bot, setBot] = useState<IBot | null>(null)

    useEffect(() => {
        if(botStatusQuery.data) {
            setBot(botStatusQuery.data)
        }        
    }, [botStatusQuery.isLoading, botStatusQuery.data])

    if (botStatusQuery.isLoading) {
        return <LoadingScreen message="Carregando status do bot..." />;
    }

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold">Status do Bot</h1>
            {bot ? (
                <Table 
                    columns={columns} 
                    data={[bot]} 
                />
            ): (
                <div>
                    Bot não ativo
                </div>
            )}
            
        </div>
    );
}

export default withPermissions([], BotPage);
