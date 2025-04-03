
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';
import RoomTable from '@/components/RoomTable';
import CreateRoomDialog from '@/components/CreateRoomDialog';
import { getAllRooms, addRoom } from '@/services/roomService';
import { Room } from '@/types/room';

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getAllRooms();
        setRooms(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch rooms data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [toast]);

  const handleCreateRoom = async (data: { name: string; description: string; facilities: number }) => {
    try {
      const newRoom = await addRoom({
        name: data.name,
        description: data.description,
        facilities: data.facilities,
        updated: null
      });

      setRooms((prevRooms) => [...prevRooms, newRoom]);
      toast({
        title: "Success",
        description: "Room created successfully",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-[220px] flex-1 overflow-auto p-6">
        <div className="p-6 bg-white rounded-lg shadow-sm w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-light text-gray-700">The Hugo Hotel - Rooms dashboard</h1>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All rooms</h2>
            <Button 
              className="bg-hugo-red hover:bg-red-700"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              CREATE A ROOM
            </Button>
          </div>
          
          <RoomTable rooms={rooms} isLoading={isLoading} />
        </div>
      </div>
      
      <CreateRoomDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default Index;
