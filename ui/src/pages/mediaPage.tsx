import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ThumbsUp, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { TMedia } from "@/types/media";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/context/auth";

export function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const { isLiked, updateLikes, numLikes } = useMedia(id as string, user.id);
  const { isPending, error, data } = useQuery<TMedia>({
    queryKey: ["media", id],
    queryFn: async () =>
      await fetch(import.meta.env.VITE_API_URL + `/search/${id}`).then(
        async (res) => {
          const result = await res.json();
          return result.media satisfies TMedia;
        }
      ),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex items-start justify-center w-full h-full px-4 py-8 text-gray-100 bg-black sm:px-6 lg:px-8">
      <Card className="w-full text-gray-100 bg-purple/20 bg-gradient-to-br from-black to-purple/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Media Poster */}
            <div className="mb-6 md:w-1/3 md:mb-0">
              <img
                src={data.thumbnail_url}
                alt="Media Poster"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Media Information */}
            <div className="md:w-2/3 md:pl-6">
              <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
              <div className="flex items-center mb-4">
                <span className="mr-2 text-yellow-500">
                  <Star className="inline" size={18} />
                </span>
                <span className="text-lg font-semibold">
                  {data.rating ? data.rating.toFixed(1) : "~"}/10
                </span>
                <Badge variant="secondary" className="ml-4">
                  {data.age_rating}
                </Badge>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mr-2">
                  {data.genre}
                </Badge>
              </div>
              <p className="mb-4 text-sm text-gray-300">{data.description}</p>
              <div className="flex items-center mb-4 text-sm">
                <Clock className="mr-2" size={16} />
                <span>169 minutes</span>
              </div>
              <Button size="sm" className="mb-4" asChild>
                <a
                  href={`https://www.themoviedb.org/search?language=en-US&query=${data.title}`}
                >
                  TMDB
                </a>
              </Button>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Director:</span> Christopher
                  Nolan
                </p>
                <p>
                  <span className="font-semibold">Cast:</span> Matthew
                  McConaughey, Anne Hathaway, Jessica Chastain
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-6 mt-6 border-t border-gray-700">
            <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="mr-4 text-3xl font-bold text-yellow-500">
                  92%
                </span>
                <div>
                  <p className="font-semibold">Critic Score</p>
                  <p className="text-sm text-gray-400">Based on 350 reviews</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateLikes()}
                >
                  <ThumbsUp
                    className={(isLiked && "fill-white ") + "w-4 h-4 mr-2"}
                  />
                  {numLikes}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
