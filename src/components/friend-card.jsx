import { useState, useEffect } from "react"
import { Instagram, Twitter, Star } from "lucide-react"
import { getTimeAgo } from '@/utils/timeAgo';
import { Link } from "react-router-dom"
import { reviewsService } from "@/features/reviews/reviewsService";

export function FriendCard({
  friend,
  time
}) {
  const [expProgress, setExpProgress] = useState(0)
  const [animatedLikes, setAnimatedLikes] = useState(0)
  const [animatedPosts, setAnimatedPosts] = useState(0)
  const [animatedViews, setAnimatedViews] = useState(0)
  const [raitingAverage, setRaitingAverage] = useState(0)
  const name = friend.username
  const title = `Amigos ${getTimeAgo(time)}`
  const avatarUrl = friend.avatar_url
  const backgroundUrl = "https://i.ibb.co/nHk8jc8/cloud-image.jpg"
  const likes = 72900
  const posts = 828
  const views = 342900
  const instagramUrl = "https://instagram.com/bhomikchauhan"
  const twitterUrl = "https://twitter.com/bhomikchauhan"
  const threadsUrl = "https://threads.net/@bhomikchauhan"

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const avg = await reviewsService.getAverageRatingForUser(friend.id);
        setRaitingAverage(Number(avg));
      } catch (error) {
        console.error("Error obteniendo rating:", error);
      }
    };
    fetchRating();
  }, [friend.id]);
  // Animate experience bar
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setExpProgress((prev) => {
          // Usamos el estado raitingAverage
          if (prev >= Math.round(raitingAverage * 20)) {
            clearInterval(interval)
            return Math.round(raitingAverage * 20)
          }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(interval);
    }, 300)
    return () => clearTimeout(timer);
  }, [raitingAverage])

  // Animate counters
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const likesIncrement = likes / steps
    const postsIncrement = posts / steps
    const viewsIncrement = views / steps

    let currentStep = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentStep++
        setAnimatedLikes(Math.min(Math.floor(likesIncrement * currentStep), likes))
        setAnimatedPosts(Math.min(Math.floor(postsIncrement * currentStep), posts))
        setAnimatedViews(Math.min(Math.floor(viewsIncrement * currentStep), views))

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
      return () => clearInterval(interval);
    }, 500)

    return () => clearTimeout(timer);
  }, [likes, posts, views])

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  return (
    <div className="w-full">
      <div className="bg-card rounded-[2rem] shadow-lg overflow-hidden">
        {/* Header with background */}
        <div
          className="relative h-40 bg-gradient-to-br from-sky-start to-sky-end overflow-hidden">
          <img
            src={backgroundUrl || "/placeholder.svg"}
            alt="Background"
            className="w-full h-full object-cover opacity-60" />

          {/* Follow button */}
          <Link
            to={`/profile/${friend.username}`}
            className={`absolute top-4 right-4 rounded-full px-6 py-2 font-medium transition-all duration-300 bg-card text-card-foreground border-2 border-border hover:bg-secondary`}>
            Ver Perfil
          </Link>
        </div>

        {/* Profile content */}
        <div className="px-6 pb-6 -mt-12">
          {/* Avatar */}
          <div className="relative w-24 h-24 mb-4">
            <div
              className="w-full h-full rounded-full border-4 border-card overflow-hidden bg-card shadow-lg">
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Experience bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300 ease-out"
                  style={{ width: `${expProgress}%` }} />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground font-light">{raitingAverage.toFixed(1)}/5</span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Name and title */}
          <h2
            className="text-2xl font-semibold text-card-foreground mb-2 tracking-tight">{name}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">{title}</p>
          {/* Stats 
          <div
            className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-border">
            <div className="text-center">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{formatNumber(animatedLikes)}</div>
              <div className="text-xs text-muted-foreground font-light">Likes</div>
            </div>
            <div className="text-center border-l border-r border-border">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{animatedPosts}</div>
              <div className="text-xs text-muted-foreground font-light">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{formatNumber(animatedViews)}</div>
              <div className="text-xs text-muted-foreground font-light">Views</div>
            </div>
          </div>
          */}

          {/* Social icons
          <div className="flex justify-center gap-8">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Instagram Profile">
              <Instagram className="w-5 h-5 text-card-foreground" />
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Twitter Profile">
              <Twitter className="w-5 h-5 text-card-foreground" />
            </a>
            <a
              href={threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Threads Profile">
              <svg
                className="w-5 h-5 text-card-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </a>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
