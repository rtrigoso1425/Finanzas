import { friendshipService } from "@/features/friendship/friendshipService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FriendCard } from "@/components/friend-card";
import { testCurrencyConversion } from "@/features/currency/testeo";

const FriendsPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [ friends, setFriends ] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (currentUser?.id) {
          // 4. Usar await para esperar la respuesta real
          const response = await friendshipService.getFriends(currentUser.id);
        
          // Asegúrate de que response sea el array, a veces viene en response.data
          setFriends(response);
        }
      } catch (error) {
        console.error("Error cargando amigos:", error);
      }
    };
    fetchFriends();
  }, [currentUser?.id]); // Solo se ejecuta cuando el ID del usuario actual esté disponible
  const filteredFriends = friends.filter((friend) => {
    const currentUserId = String(currentUser?.id || "");
    const requesterId = String(friend?.requester?.id || "");
    const person = requesterId === currentUserId ? friend?.requested : friend?.requester;
    const name = (person?.username || person?.email || "").toLowerCase();
    return name.includes(query.toLowerCase());
  });
  testCurrencyConversion(); // Llamada de prueba para verificar la conversión de moneda

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Amigos</h1>

      <div className="mb-6">
        <input
          aria-label="Buscar amigos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar amigos..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none"
        />
      </div>

      {filteredFriends.length === 0 ? (
        <p className="text-sm text-muted-foreground">No se encontraron amigos.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {filteredFriends.map((friendship) => {
            const currentUserId = String(currentUser?.id || "");
            const requesterId = String(friendship?.requester?.id || "");
            const isRequester = requesterId === currentUserId;
            const personToShow = isRequester ? friendship?.requested : friendship?.requester;
            return (
              <div key={friendship.id} className="w-full">
                <FriendCard friend={personToShow} time={friendship.updated_at} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;