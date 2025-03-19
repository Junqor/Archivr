import { searchUsers } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { MemberBox } from "./components/memberBox";
import { Input } from "@/components/ui/input";
import { SearchRounded, SouthRounded } from "@mui/icons-material";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// TODO: add pagination
export const MembersPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"username" | "followers">("followers");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");

  const pageNumber = searchParams.get("page") || "1";
  const query = searchParams.get("q") || "";

  const handleSearch = useDebouncedCallback((val: string) => {
    const params = new URLSearchParams({ q: val });
    params.set("page", "1");
    if (val.length) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    const url = `${location.pathname}?${params}`;
    navigate(url, { replace: true });
  }, 300);

  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["members", pageNumber, query, sortBy, orderBy],
    queryFn: () => searchUsers(query, 15, pageNumber, sortBy, orderBy),
  });

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-y-5 pt-10">
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        <h1 className="leading-tight">Members</h1>
        <p>Search for Archivr users by their username</p>
        <div className="relative flex w-3/4 items-center space-x-2">
          <Input
            type="text"
            placeholder="Start typing to see results..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("q")?.toString()}
            className="rounded-[28px] px-5 py-3 pr-16 text-xl"
          />
          <div className="absolute right-3 top-[0.4rem] z-10">
            <SearchRounded sx={{ fontSize: "2.5rem" }} />
            <span className="sr-only">Search</span>
          </div>
        </div>
      </div>
      <div className="flex w-3/4 items-end justify-end">
        <select
          name="sortBy"
          id="sortBy"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "username" | "followers")
          }
          className="border-b-2 border-white bg-black px-2 py-1 hover:cursor-pointer"
        >
          <option value="username">Username</option>
          <option value="followers">Followers</option>
        </select>
        <button
          type="button"
          onClick={() => setOrderBy(orderBy === "asc" ? "desc" : "asc")}
          className={`flex items-center justify-center p-1 transition-transform duration-300 ${
            orderBy === "asc" ? "flip-y" : ""
          }`}
        >
          <SouthRounded />
        </button>
      </div>
      <div className="flex w-full flex-col justify-center overflow-hidden rounded-md">
        {isLoading || isPending ? (
          <MembersPageSkeleton />
        ) : isError ? (
          <p>An Unexpected Error Occured</p>
        ) : data.length ? (
          <>
            {data.map((user) => (
              <MemberBox user={user} key={user.id} />
            ))}
          </>
        ) : (
          <p className="self-center">No members found</p>
        )}
      </div>
    </main>
  );
};

const MembersPageSkeleton = () => {
  return [...Array(4)].map((_, i) => (
    <div key={i} className="flex w-full flex-col">
      <Skeleton className="h-20 w-full" />
      <Separator />
    </div>
  ));
};
