import { useState } from "react";
import { SearchBar } from "@/pages/admin-portal/components/search-bar";
import { ActionButtons } from "@/pages/admin-portal/components/action-buttons";
import { DataTable } from "@/pages/admin-portal/components/data-table";
import { TMedia } from "@/types/media";
import { searchMedias } from "@/api/media";

export default function AdminPortal() {
  const [selectedItem, setSelectedItem] = useState<TMedia | null>(null); // Added state for selected items
  const [searchResults, setSearchResults] = useState<TMedia[]>([]);

  const handleSearch = async (query: string) => {
    setSelectedItem(null);
    const response = await searchMedias(query, 10);
    setSearchResults(response);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItem(searchResults.find((item) => item.id === id) || null);
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Admin Portal</h1>
      <div className="flex mb-4 space-x-4">
        <SearchBar onSearch={handleSearch} />
        <ActionButtons selectedItem={selectedItem} />
      </div>
      <DataTable
        data={searchResults}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}
