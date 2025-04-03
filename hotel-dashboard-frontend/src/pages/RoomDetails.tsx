
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';
import { getRoom, updateRoom, deleteRoom } from '@/services/roomService';
import { Room } from '@/types/room';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [facilityInput, setFacilityInput] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const roomData = await getRoom(id);
        setRoom(roomData);
        setName(roomData.name);
        setDescription(roomData.description);
        setFacilities(roomData.facilityList || []);
        setImage(roomData.image || null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch room data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id, toast]);

  const handleAddFacility = () => {
    if (!facilityInput.trim()) return;
    
    setFacilities([...facilities, facilityInput]);
    setFacilityInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate image upload by creating a data URL
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!id || !room) return;
    
    try {
      const updatedRoom = await updateRoom({
        ...room,
        name,
        description,
        facilityList: facilities,
        image: image || undefined,
      });
      
      setRoom(updatedRoom);
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteRoom(id);
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      // Navigate back to the rooms list
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Info",
      description: "PDF download functionality would be implemented here",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-[220px] flex-1 overflow-auto p-6">
          <div className="p-6 bg-white rounded-lg shadow-sm w-full">
            Loading room details...
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-[220px] flex-1 overflow-auto p-6">
          <div className="p-6 bg-white rounded-lg shadow-sm w-full">
            Room not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-[220px] flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-red-500 hover:text-red-700 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>back to rooms</span>
            </Link>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Room details</h1>
            <Button 
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              DELETE ROOM
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-6">Room details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-100"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  {image ? (
                    <div className="relative w-64 h-48 mb-2">
                      <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImage(null)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="bg-white text-red-500 border-red-500"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      ADD IMAGE
                    </Button>
                  )}
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-6">Facilities</h2>
              
              <div className="space-y-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      value={facility}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                ))}
                
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Facility detail"
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    className="bg-gray-100"
                  />
                  <Button 
                    variant="outline" 
                    className="flex-shrink-0 bg-white text-red-500 border-red-500"
                    onClick={handleAddFacility}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD FACILITY
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleSave}
                >
                  UPDATE ROOM
                </Button>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 space-y-6">
            <div className="bg-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-6">Dates</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Created</div>
                  <div>{room.created}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Updated</div>
                  <div>{room.updated || '-'}</div>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD PDF
            </Button>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are deleting a room...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              NO TAKE ME BACK
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-700"
              onClick={handleDelete}
            >
              YES DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomDetails;
