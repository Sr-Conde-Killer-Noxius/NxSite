import { trpc } from "@/utils/trpc/trpc";
import { useEffect, useMemo, useState } from "react";



const useStatsMap = () => {  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificação para garantir que 'data' não seja undefined
  const stats = useMemo(() => ({
    totalRevenue:       trpc.health.totalRevenue.useQuery(),
    totalUsers:         trpc.health.totalUsers.useQuery(),
    activeGroups:       trpc.health.activeGroups.useQuery(),
    anualRevenue:       trpc.health.annualRevenue.useQuery(new Date().getFullYear()),
    annualNewMembers:   trpc.health.annualNewMembers.useQuery(new Date().getFullYear()),
  }), []);  
  

  

  useEffect(() => {
    const isSomeLoading = Object.keys(stats).some((key: string) => stats[key as keyof typeof stats].isLoading)
    setIsLoading(isSomeLoading)

  }, [stats]);

  return { stats, isLoading };
};

export default useStatsMap;
