import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="flex items-center w-full max-w-sm space-x-2">
      <Input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
      <Button size="icon">
        <Search className="w-4 h-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
