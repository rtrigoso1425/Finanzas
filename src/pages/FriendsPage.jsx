import { friendshipService } from "@/features/friendship/friendshipService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FriendCard } from "@/components/friend-card";
import { testCurrencyConversion } from "@/features/currency/testeo";
import { BlurFade } from "@/components/ui/blur-fade";
import { SkeletonFriendGrid } from "@/components/ui/skeleton";

const FriendsPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [ friends, setFriends ] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (currentUser?.id) {
          const response = await friendshipService.getFriends(currentUser.id);
          setFriends(response);
        }
      } catch (error) {
        console.error("Error cargando amigos:", error);
        setError("No se pudieron cargar los amigos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, [currentUser?.id]);

  const filteredFriends = friends.filter((friend) => {
    const currentUserId = String(currentUser?.id || "");
    const requesterId = String(friend?.requester?.id || "");
    const person = requesterId === currentUserId ? friend?.requested : friend?.requester;
    const name = (person?.username || person?.email || "").toLowerCase();
    return name.includes(query.toLowerCase());
  });

  testCurrencyConversion();

  if (isLoading) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-neutral-200/50 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-full max-w-md bg-neutral-200/50 rounded-lg animate-pulse"></div>
        </div>
        <SkeletonFriendGrid count={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <BlurFade delay={0.1} inView>
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            <p>{error}</p>
          </div>
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <BlurFade delay={0.1} inView>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Amigos</h1>
          <div className="max-w-md">
            <input
              aria-label="Buscar amigos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar amigos..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        {filteredFriends.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-base sm:text-lg text-muted-foreground">
              {friends.length === 0 ? "Aún no tienes amigos. ¡Busca y agrega algunos!" : "No se encontraron amigos."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFriends.map((friendship, index) => {
              const currentUserId = String(currentUser?.id || "");
              const requesterId = String(friendship?.requester?.id || "");
              const isRequester = requesterId === currentUserId;
              const personToShow = isRequester ? friendship?.requested : friendship?.requester;
              return (
                <BlurFade key={friendship.id} delay={0.1 + index * 0.05} inView>
                  <FriendCard friend={personToShow} time={friendship.updated_at} />
                </BlurFade>
              );
            })}
          </div>
        )}
      </BlurFade>
    </div>
  );
};

export default FriendsPage;