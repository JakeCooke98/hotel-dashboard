
import React from 'react';
import { Room } from '../types/room';
import { useNavigate } from 'react-router-dom';
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
    return <div className="flex justify-center p-8">Loading rooms...</div>;
  }

  const handleRowClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Facilities</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow 
              key={room.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(room.id)}
            >
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell>{room.description}</TableCell>
              <TableCell className="text-center">{room.facilities}</TableCell>
              <TableCell className="text-center">{room.created}</TableCell>
              <TableCell className="text-center">{room.updated || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoomTable;
