import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TMedia } from "@/types/media";

interface DataTableProps {
  data: any[];
  selectedItem: TMedia | null;
  onSelectItem: (id: number) => void;
}

export function DataTable({
  data,
  selectedItem,
  onSelectItem,
}: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Release Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Checkbox
                checked={selectedItem?.id === item.id}
                onCheckedChange={() => onSelectItem(item.id)}
                aria-label={`Select item ${item.id}`}
              />
            </TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              {new Date(item.release_date).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}