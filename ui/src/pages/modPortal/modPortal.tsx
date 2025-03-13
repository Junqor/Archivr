import { useState } from "react";
import { SearchBar } from "./components/search-bar";
import { ActionButtons } from "./components/action-buttons";
import { DataTable } from "./components/data-table";
import { TUser } from "@/types/user";
import { searchUsers } from "@/api/user";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTableSkeleton } from "./components/data-table-skeleton";
import { keyframes } from "@emotion/react";

export default function ModPortal() {
  const [searchParams] = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<Map<number,TUser>>(new Map<number,TUser>);

  const pageNumber = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("q") || "";

  const { data: searchResults, isFetching } = useQuery<TUser[]>({
    queryKey: ["modSearch", query, pageNumber],
    queryFn: async () => {
      const data = await searchUsers(query, 10, pageNumber);
      return data;
    },
  });

  const handleSelectItem = (selection: TUser) => {
    if (!selection) return;
    if (selectedItems.get(selection.id)){
        selectedItems.delete(selection.id);
        setSelectedItems(new Map([...selectedItems]));
    }
    else{
        selectedItems.set(selection.id, selection);
        setSelectedItems(new Map([...selectedItems]));
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold">Mod Portal</h1>
      <h2 className="mb-4 text-lg font-bold text-neutral-500">Oh, you are SO getting banned</h2>
      <div className="flex mb-4 space-x-4">
        <SearchBar />
        <ActionButtons
          selectedItems={selectedItems}
          pageNumber={pageNumber}
          numResults={searchResults?.length || 0}
        />
      </div>
      { selectedItems.size > 0 && <>
      <h4 className="text-red-500">Selected Users</h4>
      <div className="rounded-2xl border border-red-500 bg-red-500 bg-opacity-20 p-2 inline-block min-w-40">
        {[...selectedItems].map((user)=>{return(
            <div key={user[1].id}>
                <button onClick={()=>{handleSelectItem(user[1])}}>{(user[1].displayName||user[1].username)+" [@"+user[1].username+" ID:"+user[1].id+"]"}</button>
            </div>
        );})}
      </div>
      </>}
      {isFetching ? (
        <DataTableSkeleton />
      ) : (
        <DataTable
          data={searchResults || []}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      )}
    </div>
  );
}
