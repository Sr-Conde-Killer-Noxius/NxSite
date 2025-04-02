"use client";

import { motion } from "framer-motion";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLanguage } from "@/hooks/language/useLanguage";
import { trpc } from "@/utils/trpc/trpc";
import { Payment, TelegramGroup } from "@prisma/client";
import Table, { Column } from "@/components/custom/Table";
import { useRouter } from "next/navigation";





const PromoteButton = ({ group, onClick }: {group: TelegramGroup & {payments: Payment[]}, onClick: () => void}) => (
  <div className="flex justify-center items-center">  
    {group.payments.length !== 0 ? (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"                
      >
        <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-60 rounded-xl"></span>
        <span className="relative z-10">Promovido 🚀</span>
      </motion.button>
    ) : (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        onClick={onClick}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-60 rounded-xl"></span>
        <span className="relative z-10">Promover 🚀</span>
      </motion.button>
    )}
  </div>
)

export function MeusGruposSection() {
  const allGroupsQuery    = trpc.groups.getAllGroups.useQuery()
  const auth              = useAuth()
  const language          = useLanguage()
  const router            = useRouter()
  

  const clickedPromoteGroup = (groupId: string) => router.push(`/${language}/dashboard/promote/${groupId}`)

  const columns: Column<any>[] = [
      { key: "name",      label: "Título" },
      { key: "members",   label: "Views",     render: (row: any) => row.members.length },
      { key: "status",    label: "Status",    render: () => "Ativo"},
      {
        key: "id", label: "Link", render: (row: TelegramGroup) => (
          <a 
            href={`/${language}/group/${row.id}`} 
            className="text-blue-400 hover:underline"            
            target="_blank"
            aria-label={`ver ${row.name}`}
          >
            Ver
          </a>
        ),
      },
      {
        key:    "actions", 
        label:  "Promover", 
        render: (row: TelegramGroup & {payments: Payment[]}) => (
          <PromoteButton 
            group={row} 
            onClick={() => clickedPromoteGroup(row.id)}
          />
        )
      },
  ];

  
  if (!allGroupsQuery.data || allGroupsQuery.isLoading || auth.loadingUser || !auth.userData)
    return <LoadingScreen message="Carregando seus grupos..."/>
  
  const myGroups = allGroupsQuery.data.filter((group: TelegramGroup) => group.ownerId === auth.userData?.id)

  return (
      <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Meus Grupos</h1>
          <div className="text-gray-400 mb-4 space-y-2">
              <p>Para impulsionar o grupo, clique no botão <strong>Promover</strong>. Para renovar o plano, clique em <strong>Renovar destaque</strong>.</p>
              <p>Entre em contato caso o grupo esteja <strong>Pendente</strong>.</p>
          </div>
          <nav className="mb-4">
              <ul className="space-y-2 text-gray-300">
                  {/*<li><a href="#" className="text-blue-400 hover:underline">Como cadastrar um grupo</a></li>*/}
                  {/*<li><a href="#" className="text-blue-400 hover:underline">Como promover o grupo (passo a passo)</a></li>*/}
                  {/*<li><a href="#" className="text-blue-400 hover:underline">Como funciona o impulsionamento do grupo</a></li>*/}
                  {/*<li><a href="#" className="text-blue-400 hover:underline">Quero outros sites de divulgação</a></li>*/}
                  {/*<li><a href="#" className="text-blue-400 hover:underline">Comprar canais/grupos do Telegram</a></li>*/}
              </ul>
          </nav>
          <div className="overflow-x-auto mt-6">
              <Table 
                  data={myGroups}
                  columns={columns}
              />
          </div>
      </div>
  );
}
