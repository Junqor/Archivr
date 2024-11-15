// mediaPage.tsx
/*
  To-Do:
  - Users don't have to be logged in to view media details
  - Update UI
 */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Clock, ThumbsUp, MessageSquare } from "lucide-react";
import { UseMutateFunction, useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { TMedia } from "@/types/media";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/context/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { searchMedia, TReview } from "@/api/media";

export function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const { isLiked, updateLikes, numLikes, reviews, updateReview } = useMedia(
    id as string,
    user.id
  );
  const { isPending, error, data } = useQuery<TMedia>({
    queryKey: ["media", id],
    queryFn: () => searchMedia({ id } as { id: string }),
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
          <div className="py-6 my-6 border-gray-700 border-y">
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
                <AddReviewButton updateReview={updateReview} />
              </div>
            </div>
          </div>

          {/* User Reviews */}
          {reviews && (
            <div className="flex flex-col mt-3 space-y-2">
              <h3 className="self-start font-bold">
                See What Others Are Saying
              </h3>
              {reviews?.map((review) => {
                return (
                  <Card
                    key={crypto.randomUUID()}
                    className="mb-4 bg-gray-800 border-gray-700"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{review.username}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{review.comment}</p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-400">
                        {new Date(review.created_at).toLocaleString()}
                      </p>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type AddReviewButtonProps = {
  updateReview: UseMutateFunction<
    TReview,
    Error,
    {
      comment: string;
    },
    unknown
  >;
};

const AddReviewButton = ({ updateReview }: AddReviewButtonProps) => {
  const [newReview, setNewReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleAddReview() {
    updateReview({ comment: newReview });
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white bg-black">
        <DialogHeader>
          <DialogTitle>Add a New Review</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-left">
          Share your thoughts and opinions for others to see.
        </DialogDescription>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="border-gray-600 bg-[rgb(22,22,22)]"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleAddReview} variant="default">
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
