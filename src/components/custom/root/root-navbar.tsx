"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/language/useLocale";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLanguage } from "@/hooks/language/useLanguage";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc/trpc";
import { Permission } from "@prisma/client";
import { UrlObject } from "url";

export default function RootNavbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router                        = useRouter();
  const t                             = useLocale();
  const { userData, loadingUser }     = useAuth();
  const language                      = useLanguage(); 
  const trpc_utils                    = trpc.useUtils()
  const myPermissionsQuery            = trpc.auth.myPermissions.useQuery(undefined, { retry: false })

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href as unknown as UrlObject}
      className="relative group px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
      >
      <span>{children}</span>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  );
  
  const handleLogout = async () => {    
    localStorage.removeItem("auth-token");
    await trpc_utils.auth.me.refetch()
    router.push(`/${language}`);
  };
  
  const handleClickDashboard = async () => {    
    router.replace(`/${language}/dashboard`);
  };

  const isAdmin = () => {
    const admin_roles: string[] = ["super-admin"];    
    return (
        myPermissionsQuery.data
        && Array.isArray(myPermissionsQuery.data) 
        && myPermissionsQuery.data.some((permission: Permission) => admin_roles.includes(permission.name))
    );
  };
  
  const AdminButtonComponent = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(`/${language}/admin`)}
      className="text-gray-300 hover:text-white flex items-center gap-2"
    >                  
      <ShieldCheck size={16} />                    
      Admin painel
    </Button>                  
  )
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href={`/${language}`} 
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
          >
            Promover Telegram
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block relative w-1/3 max-w-md">
            <input
              type="text"
              placeholder={t.search_groups}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">                        
            {!loadingUser && userData ? (
              <NavLink href={`/${language}/submit`}>{t.submit_group}</NavLink>
            ) : (
              <NavLink href={`/${language}/how-submit-a-group`}>{t.how_submit_a_group}</NavLink>
            )}

            {loadingUser ? (
              <div className="animate-pulse bg-white/10 rounded-full h-8 w-24" />
            ) : userData ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <UserIcon size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-300">{userData.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClickDashboard()}
                  className="text-gray-300 hover:text-white flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>

                { isAdmin () && <AdminButtonComponent />}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogout()}
                  className="text-gray-300 hover:text-white flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {t.logout}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink href={`/${language}/login`}>{t.login}</NavLink>
                <Button 
                  asChild
                  variant="default" 
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Link href={`/${language}/register`}>{t.register}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2 bg-black/90 border-t border-white/5">
              <input
                type="text"
                placeholder={t.search_groups}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-4"
              />
              
              <Link 
                href={`/${language}`} 
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {t.search_groups}
              </Link>
              
              {!loadingUser && userData ? (
                <Link 
                  href={`/${language}/submit`} 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {t.submit_group}
                </Link>
              ) : (
                <Link 
                  href={`/${language}/how-submit-a-group`} 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {t.how_submit_a_group}
                </Link>
              )}

              {userData ? (
                <>
                  <div className="px-4 py-2 text-gray-300 flex items-center gap-2">
                    <UserIcon size={16} className="text-blue-400" />
                    {userData.name}
                  </div>
                  <button
                    onClick={() => handleLogout()}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href={`/${language}/login`} 
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {t.login}
                  </Link>
                  <Link 
                    href={`/${language}/register`} 
                    className="block px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {t.register}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}