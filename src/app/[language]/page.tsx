"use client";
import { Search, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/language/useLanguage';
import { trpc } from '@/utils/trpc/trpc';
import { Category, TelegramGroup } from '@prisma/client';
import Image from 'next/image';
import { Card }                                           from '@/components/ui/card';
import { Button }                                         from '@/components/ui/button';
import { Input }                                          from '@/components/ui/input';

const SITE_IMAGE_SIZE = 200;
const GlowingBackground = lazy(() => import('@/components/custom/root/root-background'));
const LoadingScreen = lazy(() => import('@/components/custom/LoadingScreen'));

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [elementsCount, setElementsCount] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  

  // Query to fetch groups with pagination
  const groupsQuery = trpc.groups.getPageGroups.useQuery({ 
    page:     page, 
    elements: elementsCount
  });

  const categoriesQuery = trpc.groups.getAllCategories.useQuery();
  const language = useLanguage();
  
  // Update categories when data is fetched
  useEffect(() => {
    setElementsCount(15)
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  // Memoize filtered groups
  const filteredGroups = useMemo(() => {
    if (groupsQuery.data) {
      return groupsQuery.data.groups.filter((group) =>
        group.name.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedCategory || group.categoryId === selectedCategory)
      );
    }
    return [];
  }, [groupsQuery.data, search, selectedCategory]);

  // Calculate total pages based on the total number of groups and elements per page
  const totalPages = Math.ceil((groupsQuery.data?.totalCount ?? 0) / elementsCount);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <AnimatePresence>
      <Suspense fallback={<LoadingScreen />}>
        <GlowingBackground />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-black text-white"
        >
          <div className="relative">
            {/* Header */}
            <motion.header
              className="sticky top-0 backdrop-blur-xl bg-black/20 border-b border-white/5"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <Suspense fallback={<LoadingScreen />}>
                    <Input
                      type="text"
                      placeholder="Buscar grupos..."
                      className="w-full pl-12 pr-4 py-6 bg-white/5 border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-blue-500/50 transition-all duration-300"
                      value={search}
                      onChange={(e: any) => setSearch(e.target.value)}
                    />
                  </Suspense>
                </div>
              </div>
            </motion.header>

            <main className="container mx-auto px-4 py-8">
              {/* Categories */}
              <motion.div
                className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {categories.map((category: Category) => (
                  <Suspense key={category.id} fallback={<LoadingScreen />}>
                    <Button
                      variant="ghost"
                      className={`flex-shrink-0 px-6 py-3 rounded-full border transition-all duration-300 ${selectedCategory === category.name ? "bg-blue-500/20 border-blue-500 text-blue-400" : "border-white/10 hover:border-white/30 text-white/70 hover:text-white"}`}
                      onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
                    >
                      {category.name}
                    </Button>
                  </Suspense>
                ))}
              </motion.div>

              {/* Groups Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredGroups.map((group: TelegramGroup, index: number) => (
                    <Suspense key={`${group.id}-${index}`} fallback={<LoadingScreen />}>
                      <motion.div
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                        onHoverStart={() => setHoveredGroup(group.name)}
                        onHoverEnd={() => setHoveredGroup(null)}
                      >                        
                        <div className={`absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl transition-opacity duration-300 ${hoveredGroup === group.id ? 'opacity-100' : 'opacity-0'}`} />
                        <Suspense fallback={<LoadingScreen />}>
                          <Card className="relative h-full bg-white/5 border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                            <div className="p-6 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{group.name}</h3>                                
                              </div>
                              <Image
                                src={group.imageUrl}
                                alt="Imagem do grupo"
                                className="object-cover text-center mx-auto my-4"
                                width={SITE_IMAGE_SIZE}
                                height={SITE_IMAGE_SIZE / 2}
                              />
                              <p className="text-white/60 mb-6 line-clamp-2 text-center">{group.description}</p>

                              <Button
                                className="mt-auto bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 group transition-all duration-300"
                                asChild
                              >
                                <a href={`${language}/group/${group.id}`} className="flex items-center justify-center">
                                  Entrar no Grupo
                                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                              </Button>
                            </div>
                          </Card>
                        </Suspense>
                      </motion.div>
                    </Suspense>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination Controls */}
              <motion.div
                className="flex justify-center items-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="text-white">{`Página ${page} de ${totalPages}`}</span>
                <Button 
                  variant="ghost" 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </motion.div>
            </main>
          </div>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
}
