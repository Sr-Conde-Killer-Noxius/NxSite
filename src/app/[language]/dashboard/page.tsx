"use client"
import { RequireAuth } from "@/components/custom/security/withAuth";
import { useAuth } from "@/hooks/auth/useAuth";
import React, { JSX, useState } from "react";
import { 
  LucideUser, 
  LucideChevronDown, 
  LucideChevronUp, 
  LucidePlus,
  LucideTicket,
} from "lucide-react";
import { MeusGruposSection } from "./meus-grupos";
import { CadastrarGruposSection } from "./cadastrar-grupos";
import { TicketSection } from "./TicketSection";


  
interface MenuItem {
  name:     string;
  icon:     JSX.Element;
  route?:   string;
  content?: JSX.Element;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  name:       string;
  route?:     string;
  content:    JSX.Element;
}

const menuItems: MenuItem[] = [
    { name: "Meus Grupos",        icon: <LucideUser />,       content: <MeusGruposSection /> },
    { name: "Adicionar Grupo",    icon: <LucidePlus />,       content: <CadastrarGruposSection /> },
    { name: "Ticket",             icon: <LucideTicket />,     content: <TicketSection />},    
];

function DashboardPage() {
  const { userData } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [mainContent, setMainContent]   = useState<JSX.Element>(menuItems[0].content ?? <></>);  

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleSubmenu(item.name);
    } else {
      setMainContent(item.content!);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 z-50">
      {/* Sidebar */}
      <aside className={`h-svh bg-gray-800 p-5 transition-all ${isSidebarOpen ? "block" : "hidden"}`}>
        <h2 className="text-xl font-bold mb-4">Painel</h2>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <div 
                className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center gap-3">
                  {item.icon} {item.name}
                </div>
                {item.submenu && (openSubmenus[item.name] ? <LucideChevronUp /> : <LucideChevronDown />)}
              </div>
              {item.submenu && openSubmenus[item.name] && (
                <ul className="ml-5 mt-2">
                  {item.submenu.map((subItem, subIndex) => (
                    <li 
                      key={subIndex} 
                      className="p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                      onClick={() => setMainContent(subItem.content)}
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
        <button className="mb-4 p-2 bg-gray-700 rounded-md" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "Fechar Menu" : "Abrir Menu"}
        </button>
        <h1 className="text-2xl font-semibold">Bem-vindo, {userData?.name || "Usuário"}</h1>
        <div className="text-gray-400">{mainContent}</div>
      </main>
    </div>
  );
}

export default RequireAuth(DashboardPage);
