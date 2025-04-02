"use client"
import { JSX } from "react";


export interface Column<T> {
  key:      keyof T;
  label:    string;
  render?:  (row: T) => React.ReactNode; // Allows custom rendering per column
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}
import { motion } from "framer-motion";

const Table = <T,>({ columns, data }: TableProps<T>): JSX.Element => {
  return (
    <div className="relative overflow-x-auto mt-6">
      {/* Camada extra de brilho neon ao redor da tabela */}
      <div className="absolute inset-0 rounded-xl border-[4px] border-transparent pointer-events-none animate-neon-glow" />

      <motion.table
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full border border-gray-800 shadow-[0_0_80px_rgba(37,99,235,0.7)] rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-md relative z-10"
      >
        {/* Cabeçalho da Tabela */}
        <thead>
          <motion.tr
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 via-purple-600 to-red-500 text-gray-200"
          >
            {columns.map((col) => (
              <th key={String(col.key)} className="p-4 text-left text-sm font-semibold tracking-wide uppercase">
                {col.label}
              </th>
            ))}
          </motion.tr>
        </thead>

        {/* Corpo da Tabela */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                whileHover={{
                  backgroundColor: "rgba(192, 38, 211, 0.2)", // Neon roxo suave
                  scale: 1.01,
                  transition: { duration: 0.3 },
                }}
                className="border-t border-gray-700 hover:cursor-pointer transition-all"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="p-4 text-gray-300">
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </motion.tr>
            ))
          ) : (
            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                Nenhum dado disponível
              </td>
            </motion.tr>
          )}
        </tbody>
      </motion.table>

      {/* Animação da borda neon ao redor de toda a tabela */}
      <style jsx>{`
        @keyframes neonGlow {
          0% { box-shadow: 0 0 80px rgba(37, 99, 235, 0.7); } /* Azul */
          25% { box-shadow: 0 0 90px rgba(192, 38, 211, 0.7); } /* Roxo */
          50% { box-shadow: 0 0 100px rgba(255, 0, 0, 0.7); } /* Vermelho */
          75% { box-shadow: 0 0 90px rgba(192, 38, 211, 0.7); } /* Roxo */
          100% { box-shadow: 0 0 80px rgba(37, 99, 235, 0.7); } /* Azul */
        }

        .animate-neon-glow {
          animation: neonGlow 4s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Table;
