import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { ActivityFeed } from "./components/activityFeed";

export function ActivityPage() {
  const { user } = useAuth();
  const [isOnFollowing, setIsOnFollowing] = useState(!!user);

  return (
    <main className="h-full w-full">
      <div className="inline-flex items-center gap-x-2">
        <h1 className="bg-gradient-to-tr from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold">
          See How Users Like{" "}
          <span className="bg-clip-text text-transparent">You</span> Are Using
          <span className="bg-clip-text text-transparent"> Archivr</span>
        </h1>
      </div>
      <Button className="flex" onClick={() => setIsOnFollowing(!isOnFollowing)}>
        {isOnFollowing ? "Following" : "Global"}
      </Button>
      <ActivityFeed type={isOnFollowing ? "following" : "global"} />
    </main>
  );
}
