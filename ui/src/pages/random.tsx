import { useEffect, useState } from "react";
import { LoadingScreen } from "./loadingScreen";
import { Navigate } from "react-router-dom";
import { getRandomMedia } from "@/api/media";
import { toast } from "sonner";

export function Random() {
  const [id, setId] = useState(0);

  useEffect(() => {
    const getId = async () => {
      const media = await getRandomMedia();
      setId(media.id);
    };

    try {
      getId();
    } catch (e) {
      toast.error("An unexpected error occurred");
      setId(-1);
    }
  }, []);

  if (!id) {
    return <LoadingScreen />;
  } else if (id === -1) {
    return <Navigate to="/" />;
  } else {
    return <Navigate to={`/media/${id}`} />;
  }
}
