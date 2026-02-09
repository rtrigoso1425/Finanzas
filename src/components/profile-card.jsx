import React from 'react';
import { getTimeAgo } from "@/utils/timeAgo";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  // Calculamos el tiempo desde que se creó (o actualizó) el perfil
  const timeAgo = getTimeAgo(user.created_at || user.updated_at);
  const navigate = useNavigate();
  
  return (
    <>
      {/* Mantenemos tus estilos originales */}
      <style>
        {`
          .hover-scale { transition: transform 700ms ease-out; }
          .hover-scale:hover { transform: scale(1.02); }
          .image-scale { transition: transform 700ms ease-out; }
          .image-container:hover .image-scale { transform: scale(1.03); }
          .hover-translate { transition: transform 500ms ease-out; }
          .hover-translate:hover { transform: translateX(4px); }
          .hover-scale-sm { transition: transform 500ms ease-out; }
          .hover-scale-sm:hover { transform: scale(1.1); }
        `}
      </style>
      
      {/* Quitamos w-full h-screen para que quepa en la grilla */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-black/80 overflow-hidden hover-scale">
          <div className="relative overflow-hidden image-container">
            <img
              src={user?.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"}
              alt="Perfil"
              className="w-full aspect-square object-cover image-scale"
              onError={(e) => e.target.src = "https://i.ibb.co/k6WjwY6N/default.jpg"}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 dark:from-black/60 to-transparent pointer-events-none"></div>
            <div className="absolute top-6 left-6">
              <h2 className="text-2xl font-medium text-white drop-shadow-lg">
                {user?.username || "Sin nombre"}
              </h2>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden hover-scale-sm ring-2 ring-gray-200 dark:ring-zinc-700">
                <img
                  src={user?.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hover-translate">
                <div className="text-sm text-gray-700 dark:text-zinc-200">
                  @{user?.username || "user"}
                </div>
                {/* Aquí mostramos el tiempo dinámico */}
                <div className="text-xs text-gray-500 dark:text-zinc-500">
                  Unido: {timeAgo}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/profile/${user?.username}`)}
              className="bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-lg px-4 py-2 text-sm font-medium
                         transition-all duration-500 ease-out transform hover:scale-105 
                         hover:bg-gray-800 dark:hover:bg-zinc-700
                         active:scale-95 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/50"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;