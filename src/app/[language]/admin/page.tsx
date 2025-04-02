"use client";
import { JSX, useState } from "react";
import { 
  LucideBot, 
  LucideChevronDown, 
  LucideChevronUp, 
  LucideLayoutDashboard, 
  LucideTicket, 
  LucideUsers 
} from "lucide-react";
import { RequireAuth }  from "@/components/custom/security/withAuth";
import BotPage          from "./botComponent";
import UsersPage        from "./UsersComponent"
import Dashboard        from "./DashBoardComponent"
import Tickets          from "./TicketsComponent"


// Tipos para MenuItem e SubMenuItem
interface MenuItem {
  name: string;
  icon: JSX.Element;
  content: JSX.Element | null;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  content: JSX.Element;
}


// Lista de itens do menu
const menuItems: MenuItem[] = [  
  { name: "Dashboard",  icon: <LucideLayoutDashboard />,    content: <Dashboard />},
  { name: "Bot",        icon: <LucideBot />,                content: <BotPage   />},
  { name: "Usuários",   icon: <LucideUsers />,              content: <UsersPage />},  
  { name: "Ticket",     icon: <LucideTicket />,             content: <Tickets   />},
]

// Função principal da página de dashboard
function DashboardPage() {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({}); // Estado para submenus abertos
  const [mainContent, setMainContent] = useState<JSX.Element>(menuItems[0].content ?? <>Dados nao encontrados</>); // Estado para conteúdo principal

  // Função para alternar o estado de submenus
  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Função para lidar com clique no menu
  const handleMenuClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleSubmenu(item.name); // Abre ou fecha o submenu
    } else if (item.content) {
      setMainContent(item.content); // Atualiza o conteúdo principal
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-5">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <div 
                className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuClick(item)} // Função de clique no item do menu
              >
                <div className="flex items-center gap-3">
                  {item.icon} {item.name}
                </div>
                {item.submenu && (openSubmenus[item.name] ? <LucideChevronUp /> : <LucideChevronDown />)} {/* Ícone para submenus */}
              </div>
              {item.submenu && openSubmenus[item.name] && (
                <ul className="ml-5 mt-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <li 
                      key={subIndex} 
                      className="p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                      onClick={() => setMainContent(subItem.content)} // Atualiza o conteúdo principal ao clicar no submenu
                    >
                      {subItem.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Conteúdo Principal</h1>
        <div className="text-gray-400">{mainContent}</div> {/* Exibe o conteúdo principal */}
      </main>
    </div>
  );
}

// Adiciona a proteção de autenticação à página
export default RequireAuth(DashboardPage);
