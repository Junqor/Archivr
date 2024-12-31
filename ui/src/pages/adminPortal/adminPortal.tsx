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

  const { data: searchResults, isFetching } = useQuery<TMedia[]>({
    queryKey: ["adminSearch", searchParams.get("q")],
    queryFn: async () => {
      const data = await searchMedias(searchParams.get("q") || "", 10);
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
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Admin Portal</h1>
      <div className="flex mb-4 space-x-4">
        <SearchBar />
        <ActionButtons selectedItem={selectedItem} />
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
