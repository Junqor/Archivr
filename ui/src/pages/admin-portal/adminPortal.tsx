import { useState } from "react";
import { SearchBar } from "@/pages/admin-portal/components/search-bar";
import { ActionButtons } from "@/pages/admin-portal/components/action-buttons";
import { DataTable } from "@/pages/admin-portal/components/data-table";
import { TMedia } from "@/types/media";
import { searchMedias } from "@/api/media";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export default function AdminPortal() {
  const [selectedItem, setSelectedItem] = useState<TMedia | null>(null); // Added state for selected items
  const [searchResults, setSearchResults] = useState<TMedia[]>([]);
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    // CIA level security check fr
    throw { status: 403 };
  }

  const handleSearch = async (query: string) => {
    setSelectedItem(null);
    try {
      const response = await searchMedias(query, 10);
      setSearchResults(response);
    } catch (error) {
      toast.error("Error searching for media");
      setSearchResults([]);
    }
  };

  const handleSelectItem = (id: number) => {
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
