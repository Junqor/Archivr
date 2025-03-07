import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { ActivityFeed } from "./components/activityFeed";
import { cn } from "@/lib/utils";
import { RankedUserMedia } from "./components/rankedUserMedia";
import { PersonRounded, PublicRounded } from "@mui/icons-material";

export function ActivityPage() {
  const { user } = useAuth();
  const [isOnFollowing, setIsOnFollowing] = useState(!!user);

  return (
    <main className="flex h-full w-full flex-col gap-y-5">
      <div className="flex flex-col gap-x-2 py-5">
        <h1 className="font-extrabold">See What's Happening</h1>
        <h4>
          Discover How the{" "}
          <span className="bg-gradient-to-tr from-blue-600 to-fuchsia-700 bg-clip-text text-transparent">
            Archivr
          </span>{" "}
          Community is Exploring & Sharing
        </h4>
      </div>
      <div className="flex w-fit flex-row gap-x-2 overflow-hidden">
        {!!user && (
          <Button
            className={cn(
              isOnFollowing
                ? "bg-primary"
                : "bg-[#1B1B1A] text-[rgba(242,_242,_240,_0.75)] hover:bg-primary/40",
              "gap-x-2 rounded-sm py-5",
            )}
            onClick={() => setIsOnFollowing(!isOnFollowing)}
          >
            <PersonRounded />
            <h4>Following</h4>
          </Button>
        )}
        <Button
          className={cn(
            !isOnFollowing
              ? "bg-primary"
              : "bg-[#1B1B1A] text-[rgba(242,_242,_240,_0.75)] hover:bg-primary/40",
            "gap-x-2 rounded-sm py-5",
          )}
          onClick={() => setIsOnFollowing(!isOnFollowing)}
        >
          <PublicRounded />
          <h4>Global</h4>
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-x-5 gap-y-5 md:flex-row">
        <section className="flex flex-col items-center gap-y-3 md:w-3/4">
          <ActivityFeed type={isOnFollowing ? "following" : "global"} />
        </section>
        <section className="flex h-fit flex-col rounded-xl bg-slate-800 p-3 px-12 outline outline-white/30 md:w-1/4 md:p-3">
          <RankedUserMedia />
        </section>
      </div>
    </main>
  );
}
