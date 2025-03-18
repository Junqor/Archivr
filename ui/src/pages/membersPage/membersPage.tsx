import { searchUsers } from "@/api/user";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { MemberBox } from "./components/memberBox";

export const MembersPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pageNumber = searchParams.get("page") || "1";
  const query = searchParams.get("q") || "j";

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
    queryKey: ["members", pageNumber, query],
    queryFn: () => searchUsers(query, 15, pageNumber),
  });

  return (
    <main className="flex h-full w-full flex-col">
      <h1>Members</h1>
      <div className="flex w-full flex-col justify-center">
        {isLoading || isPending ? (
          <MembersPageSkeleton />
        ) : isError ? (
          <p>An Unexpected Error Occured</p>
        ) : (
          <>
            {data.map((user) => (
              <MemberBox user={user} key={user.id} />
            ))}
          </>
        )}
      </div>
    </main>
  );
};

const MembersPageSkeleton = () => {
  return <LoadingSpinner />;
};
