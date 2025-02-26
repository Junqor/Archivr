import { useEffect, useState } from "react";
import { TMedia } from "@/types/media";
import { TGenre } from "@/types/genre";
import {
  getLikes,
  getUserRating,
  getMediaBackground,
  getMediaTrailer,
} from "@/api/media";
import { getGenres } from "@/api/genre";
import { Link } from "react-router-dom";
import {
  FavoriteRounded,
  StarRounded,
  ChatBubbleRounded,
} from "@mui/icons-material";

function formatReleaseDate(date: string) {
  return date.split("-")[0];
}

function heroMedia({ media }: { media: TMedia }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [mediaTrailer, setMediaTrailer] = useState<string | null>(null);
  const [genresList, setGenresList] = useState<TGenre[] | null>(null);

  useEffect(() => {
    async function fetchLikes() {
      const likes = await getLikes({ mediaId: media.id.toString() });
      setLikes(likes);
    }
    async function fetchUserRating() {
      const userRating = await getUserRating({ mediaId: media.id.toString() });
      setUserRating(userRating);
    }
    async function fetchBackground() {
      const background = await getMediaBackground(media.id);
      setBackground(background);
    }
    async function fetchTrailer() {
      const trailer = await getMediaTrailer(media.id);
      setMediaTrailer(trailer);
    }
    async function fetchGenresList() {
      const genresList = await getGenres();
      setGenresList(genresList);
    }
    fetchLikes();
    fetchUserRating();
    fetchBackground();
    fetchTrailer();
    fetchGenresList();
  }, [media.id]);

  return (
    <div
      title={media.title}
      style={{
        background: `linear-gradient(0deg, rgba(13, 13, 13, 0.05) 0%, rgba(13, 13, 13, 0.05) 100%), radial-gradient(50% 50% at 50% 50%, rgba(13, 13, 13, 0.00) 0%, rgba(13, 13, 13, 0.75) 100%), url(${background}) lightgray 50% / cover no-repeat`,
      }}
      className="flex aspect-[16/9] w-full cursor-pointer flex-row items-end justify-between bg-cover bg-center p-10"
    >
      <div className="flex flex-col items-start justify-start gap-3">
        <div className="flex flex-row items-end gap-3">
          <h2 className="leading-none text-white">{media.title}</h2>
          <h3 className="leading-none text-white">
            {formatReleaseDate(media.release_date)}
          </h3>
          <div className="flex-column flex items-center justify-center gap-3 rounded-sm bg-white px-1">
            <p className="text-black">{media.age_rating}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          {media.genres.map((genre) => {
            const genreObj = genresList?.find((g: TGenre) => g.genre === genre);
            return (
              <>
                <Link
                  key={genre}
                  to={`/genre/${genreObj?.slug}`}
                  className="hover:underline"
                >
                  <h4 className="text-white">{genre}</h4>
                </Link>
                {media.genres.indexOf(genre) !== media.genres.length - 1 && (
                  <h4 className="text-white">|</h4>
                )}
              </>
            );
          })}
        </div>
        <div className="flex flex-row items-center gap-3">
          <Link
            to={`/media/${media.id}`}
            className="box-border flex items-center justify-center rounded-full bg-purple px-6 py-2 text-white transition-colors hover:bg-purple/75"
          >
            View Details
          </Link>
          {mediaTrailer && (
            <Link
              to={mediaTrailer || "#"}
              target="_blank"
              className="box-border flex items-center justify-center rounded-full border border-white bg-transparent px-6 py-2 transition-colors hover:bg-white hover:text-black"
            >
              Watch Trailer
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-2">
        <div className="flex flex-row items-center gap-4">
          <FavoriteRounded />
          <p className="text-white">
            {likes !== null ? likes.toString() : "Loading..."}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <StarRounded />
          <p className="text-white">{userRating ? userRating / 2 : "~"}/5</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <ChatBubbleRounded />
          <p className="text-white">0</p>
        </div>
      </div>
    </div>
  );
}

export default heroMedia;
