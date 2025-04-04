
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';
import RoomTable from '@/components/RoomTable';
import { getAllRooms } from '@/services/roomService';
import { Room } from '@/types/room';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCreateRoom = () => {
    navigate('/room/new');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[240px]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-karla text-gray-700">All rooms</h1>
            <Button 
              variant="hugo"
              onClick={handleCreateRoom}
            >
              CREATE A ROOM
            </Button>
          </div>
          
          <RoomTable rooms={rooms} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
