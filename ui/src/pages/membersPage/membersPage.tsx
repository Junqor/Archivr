import { searchUsers } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { MemberBox } from "./components/memberBox";
import { Input } from "@/components/ui/input";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  SearchRounded,
  SouthRounded,
} from "@mui/icons-material";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const PAGE_SIZE = 15;

export const MembersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"username" | "followers">("followers");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");

  const pageNumber = parseInt(searchParams.get("page") || "0");
  const query = searchParams.get("q") || "";

  const { data, isLoading, isPending, isError } = useQuery({
    queryKey: ["members", pageNumber, query, sortBy, orderBy],
    queryFn: () => searchUsers(query, PAGE_SIZE, pageNumber, sortBy, orderBy),
  });

  const handleSearch = useDebouncedCallback((val: string) => {
    const params = new URLSearchParams({ q: val });
    params.set("page", "0");
    if (val.length) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    const url = `${location.pathname}?${params}`;
    navigate(url, { replace: true });
  }, 300);

  const handleChangePage = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-y-5 pt-10">
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        <h1 className="leading-tight">Members</h1>
        <p>Search for Archivr users by their username</p>
        <div className="relative flex w-3/4 items-center space-x-2">
          <Input
            name="disable-password-autofill"
            placeholder="Start typing to see results..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("q")?.toString()}
            className="rounded-[28px] px-5 py-3 pr-16 text-xl"
            autoFocus
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
            <section className="mt-5 flex w-full justify-center gap-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleChangePage(Math.max(0, pageNumber - 1))}
                  disabled={pageNumber === 0}
                  className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <ChevronLeftRounded />
                </button>
                <h3
                  className={`${pageNumber === 0 ? "text-muted" : "text-white"}`}
                >
                  Previous
                </h3>
              </div>
              <Separator orientation="vertical" className="h-auto" decorative />
              <div className="flex items-center gap-3">
                <h3
                  className={`${
                    !data || data.length < PAGE_SIZE
                      ? "text-muted"
                      : "text-white"
                  }`}
                >
                  Next
                </h3>
                <button
                  onClick={() => handleChangePage(pageNumber + 1)}
                  disabled={!data || data.length < PAGE_SIZE}
                  className={`flex items-center justify-center rounded-md border border-white p-1 transition-all duration-300 enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <ChevronRightRounded />
                </button>
              </div>
            </section>
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
