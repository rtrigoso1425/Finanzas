// src/pages/SearchPage.jsx
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import UserCard from "@/components/profile-card"; 
import { useFetchUsers } from "@/hooks/useFetchUsers"; // <--- Importamos nuestra lógica

const SearchPage = () => {
  // 1. Usamos el hook para traer los datos (Separación de lógica)
  const { users, isLoading } = useFetchUsers();
  
  // 2. Estado local solo para la interacción del buscador
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Lógica de filtrado (Mínimo 3 letras)
  const showResults = searchTerm.length >= 3;
  
  const filteredUsers = showResults
    ? users.filter((user) => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-10">
      
      <div className="max-w-7xl mx-auto mb-10 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Explorar Comunidad
        </h1>
        
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-800 rounded-xl leading-5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm"
            placeholder="Buscar por username (mínimo 3 letras)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- GRID DE RESULTADOS --- */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          
          {/* Caso A: Usuario no ha escrito suficiente */}
          {!showResults ? (
            <div className="col-span-full text-center py-20 opacity-50">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-zinc-600" />
              <p className="text-gray-500 dark:text-zinc-500 text-lg">
                Ingresa al menos 3 letras para comenzar.
              </p>
            </div>
          ) : (
            
            /* Caso B: Buscando... */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 dark:text-zinc-500 text-lg">
                    No encontramos a nadie llamado "{searchTerm}".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;