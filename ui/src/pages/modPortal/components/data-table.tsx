import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { TUser } from "@/types/user";

interface DataTableProps {
  data: any[];
  selectedItems: Map<Number,TUser>;
  onSelectItem: (user: TUser) => void;
}

export function DataTable({
  data,
  selectedItems,
  onSelectItem,
}: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead className="w-[50px]">Inspect</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Avatar</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} onClick={()=>{onSelectItem(item)}}>
            <TableCell>
              {selectedItems.has(item.id) && <Check/>}
            </TableCell>
            <TableCell>
              <Search/>
            </TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.displayName || item.username}</TableCell>
            <TableCell className="w-[50px]">
              <UserAvatar user={item} />
            </TableCell>
            <TableCell>{"@"+item.username}</TableCell>
            <TableCell>{item.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
