"use client";
import withPermissions from "@/components/custom/security/withPermision";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement, ChartData } from "chart.js";
import useStatsMap from "@/hooks/UseStatsMap";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { createRichChartData } from "@/lib/stats/chart";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const AdminDashboardPage = () => {
    const statsMap = useStatsMap();    
    const revenueData:      number[]    = statsMap.stats.anualRevenue.data?.map(mounthInfo => mounthInfo.revenue)           || [];
    const newMembersData:   number[]    = statsMap.stats.annualNewMembers.data?.map(mounthInfo => mounthInfo.newMembers)    || [];    
    const anualRevenueChardData:    ChartData<'line'> = createRichChartData("Faturamento Mensal", revenueData)    
    const anualNewUsersChartData:   ChartData<'line'> = createRichChartData("Usuários Cadastrados", newMembersData)
    
    if (statsMap.isLoading)
        return <LoadingScreen message="Carregando dashboard ..." />;

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

            {/* MÉTRICAS PRINCIPAIS */}
            <div className="flex flex-row gap-6 justify-evenly">
                <Card className="bg-gray-800 shadow-md  text-white w-1/3 text-center">
                    <CardHeader><CardTitle>Usuários Cadastrados</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{statsMap.stats.totalUsers.data}</p></CardContent>
                </Card>
                <Card className="bg-gray-800 shadow-md text-white w-1/3 text-center">
                    <CardHeader><CardTitle>Grupos Ativos</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{statsMap.stats.activeGroups.data}</p></CardContent>
                </Card>
                <Card className="bg-gray-800 shadow-md text-white w-1/3 text-center">
                    <CardHeader><CardTitle>Faturamento Total</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">R$ {statsMap.stats.totalRevenue.data?.toLocaleString()}</p></CardContent>
                </Card>
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className="bg-gray-800 shadow-md text-white">
                    <CardHeader><CardTitle>Faturamento Mensal</CardTitle></CardHeader>
                    <CardContent><Line data={anualRevenueChardData} /></CardContent>
                </Card>
                <Card className="bg-gray-800 shadow-md text-white">
                    <CardHeader><CardTitle>Usuários Cadastrados</CardTitle></CardHeader>
                    <CardContent><Line data={anualNewUsersChartData} /></CardContent>                    
                </Card>
            </div>
        </div>
    );
};

export default withPermissions([], AdminDashboardPage);
