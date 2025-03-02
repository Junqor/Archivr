import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { ActivityFeed } from "./components/activityFeed";
import { cn } from "@/lib/utils";
import { RankedUserMedia } from "./components/rankedUserMedia";

export function ActivityPage() {
  const { user } = useAuth();
  const [isOnFollowing, setIsOnFollowing] = useState(!!user);

  return (
    <main className="flex h-full w-full flex-col gap-y-3">
      <div className="inline-flex items-center gap-x-2">
        <h1 className="bg-gradient-to-tr from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold">
          See How Users Like{" "}
          <span className="bg-clip-text text-transparent">You</span> Are Using
          <span className="bg-clip-text text-transparent"> Archivr</span>
        </h1>
      </div>
      <div className="flex w-fit flex-row overflow-hidden rounded-md border border-white">
        {!!user && (
          <Button
            className={cn(
              isOnFollowing ? "bg-primary" : "bg-black hover:bg-primary/40",
              "rounded-none",
            )}
            onClick={() => setIsOnFollowing(!isOnFollowing)}
          >
            Following
          </Button>
        )}
        <Button
          className={cn(
            !isOnFollowing ? "bg-primary" : "bg-black hover:bg-primary/40",
            "rounded-none",
          )}
          onClick={() => setIsOnFollowing(!isOnFollowing)}
        >
          Global
        </Button>
      </div>
      <div className="flex flex-col-reverse gap-x-3 gap-y-3 md:flex-row">
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
