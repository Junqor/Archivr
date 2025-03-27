import { useState } from "react";
import { SearchBar } from "@/pages/adminPortal/components/search-bar";
import { ActionButtons } from "@/pages/adminPortal/components/action-buttons";
import { DataTable } from "@/pages/adminPortal/components/data-table";
import { TMedia } from "@/types/media";
import { searchMedias } from "@/api/media";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "./components/data-table-skeleton";

export default function AdminPortal() {
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<TMedia | null>(null);

  const pageNumber = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("q") || "";

  const { data: searchResults, isFetching } = useQuery<TMedia[]>({
    queryKey: ["adminSearch", query, pageNumber],
    queryFn: async () => {
      const data = await searchMedias(query, 10, pageNumber - 1);
      return data;
    },
  });

  const handleSelectItem = (id: number) => {
    if (!searchResults) return;
    const selection = searchResults.find((item) => item.id === id) || null;
    if (selection === selectedItem) {
      setSelectedItem(null); // for deselection
    } else {
      setSelectedItem(selection);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <div className="mb-4 flex space-x-4">
        <SearchBar />
        <ActionButtons
          selectedItem={selectedItem}
          pageNumber={pageNumber}
          numResults={searchResults?.length || 0}
        />
      </div>
      {isFetching ? (
        <DataTableSkeleton />
      ) : (
        <DataTable
          data={searchResults || []}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
        />
      )}
    </div>
  );
}
