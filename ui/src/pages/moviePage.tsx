import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ThumbsUp, MessageSquare } from "lucide-react";

export default function MovieCard() {
  return (
    <div className="flex items-start justify-center w-full h-full px-4 py-8 text-gray-100 bg-black sm:px-6 lg:px-8">
      <Card className="w-full text-gray-100 bg-purple/20 bg-gradient-to-br from-black to-purple/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Movie Poster */}
            <div className="mb-6 md:w-1/3 md:mb-0">
              <img
                src="https://www.themoviedb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
                alt="Movie Poster"
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Movie Information */}
            <div className="md:w-2/3 md:pl-6">
              <h1 className="mb-2 text-3xl font-bold">Interstellar</h1>
              <div className="flex items-center mb-4">
                <span className="mr-2 text-yellow-500">
                  <Star className="inline" size={18} />
                </span>
                <span className="text-lg font-semibold">8.6/10</span>
                <Badge variant="secondary" className="ml-4">
                  PG-13
                </Badge>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mr-2">
                  Sci-Fi
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Adventure
                </Badge>
                <Badge variant="outline">Drama</Badge>
              </div>
              <p className="mb-4 text-sm text-gray-300">
                A team of explorers travel through a wormhole in space in an
                attempt to ensure humanity's survival.
              </p>
              <div className="flex items-center mb-4 text-sm">
                <Clock className="mr-2" size={16} />
                <span>169 minutes</span>
              </div>
              <Button size="sm" className="mb-4" asChild>
                <a
                  href={`https://www.themoviedb.org/search?language=en-US&query=${"interstellar"}`}
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
                <Button variant="outline" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Recommend
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
