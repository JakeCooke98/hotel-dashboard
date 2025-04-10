import React from 'react';
import { Room } from '../types/room';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RoomTableProps {
  rooms: Room[];
  isLoading: boolean;
}

const RoomTable: React.FC<RoomTableProps> = ({ rooms, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex justify-center p-8 font-karla">Loading rooms...</div>;
  }

  const handleRowClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-karla">Room</TableHead>
            <TableHead className="font-karla">Description</TableHead>
            <TableHead className="text-center font-karla">Facilities</TableHead>
            <TableHead className="text-center font-karla">Created</TableHead>
            <TableHead className="text-center font-karla">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow 
              key={room.id} 
              className="cursor-pointer hover:bg-gray-50 font-merriweather"
              onClick={() => handleRowClick(room.id)}
            >
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell>{room.description}</TableCell>
              <TableCell className="text-center">{room.facilities}</TableCell>
              <TableCell className="text-center">{formatDate(room.created)}</TableCell>
              <TableCell className="text-center">{room.updated ? formatDate(room.updated) : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomTable;
