import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Plus } from 'lucide-react';
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
import { getRoom, updateRoom, deleteRoom, addRoom, generateRoomPDF } from '@/services/roomService';
import { Room } from '@/types/room';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [facilityInput, setFacilityInput] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const isNewRoom = id === 'new';

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        
        if (isNewRoom) {
          const newRoomTemplate: Room = {
            id: "new",
            name: "",
            description: "",
            facilities: 0,
            created: new Date().toLocaleDateString('en-GB'),
            updated: null,
            facilityList: [],
            image: null
          };
          
          setRoom(newRoomTemplate);
          setName("");
          setDescription("");
          setFacilities([]);
          setImage(null);
          setIsLoading(false);
        } else {
          const roomData = await getRoom(id!);
          setRoom(roomData);
          setName(roomData.name);
          setDescription(roomData.description);
          setFacilities(roomData.facilityList || []);
          setImage(roomData.image || null);
          setIsLoading(false);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch room data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id, toast, isNewRoom]);

  const handleAddFacility = () => {
    if (!facilityInput.trim()) return;
    
    const newFacility = facilityInput.trim();
    // Check for duplicates
    if (facilities.includes(newFacility)) {
      toast({
        title: "Warning",
        description: "This facility already exists",
        variant: "destructive",
      });
      return;
    }
    
    setFacilities(prevFacilities => [...prevFacilities, newFacility]);
    setFacilityInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFacility();
    }
  };

  const removeFacility = (indexToRemove: number) => {
    setFacilities(prevFacilities => 
      prevFacilities.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (isNewRoom) {
        const newRoom = await addRoom({
          name,
          description,
          facilityList: facilities,
          image: image || undefined,
          facilities: facilities.length,
          updated: null
        });
        
        setRoom(newRoom);
        toast({
          title: "Success",
          description: "Room created successfully",
        });
        
        // After creating the room successfully, generate PDF
        try {
          setIsPdfGenerating(true);
          await handleGeneratePDF(newRoom.id);
        } catch (pdfError) {
          console.error("PDF generation failed after room creation", pdfError);
        } finally {
          setIsPdfGenerating(false);
        }
        
        navigate(`/room/${newRoom.id}`);
      } else {
        if (!room) return;
        
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
        
        // After updating the room successfully, generate PDF
        try {
          setIsPdfGenerating(true);
          await handleGeneratePDF(updatedRoom.id);
        } catch (pdfError) {
          console.error("PDF generation failed after room update", pdfError);
        } finally {
          setIsPdfGenerating(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: isNewRoom ? "Failed to create room" : "Failed to update room",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async (roomId: string) => {
    if (roomId === 'new') return;
    
    try {
      setIsPdfGenerating(true);
      const pdfBlob = await generateRoomPDF(roomId);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `room-${roomId}-details.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNewRoom) return;
    
    try {
      await deleteRoom(id);
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 pl-[240px]">
          <div className="px-8 py-6">
            Loading room details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[240px]">
        <div className="px-8 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-merriweather font-light mb-2">Room details</h1>
            <Link to="/" className="text-hugo-red flex items-center text-sm hover:underline">
              <ArrowLeft className="w-3 h-3 mr-1" />
              <span>back to rooms</span>
            </Link>
          </div>
          
          <div className="flex">
            <div className="w-2/3 pr-8">
              <h2 className="text-2xl font-merriweather font-light mb-6">Room details</h2>
              
              {!isNewRoom && (
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    className="text-hugo-red border-hugo-red hover:bg-red-50 text-xs flex items-center"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isSaving || isPdfGenerating}
                  >
                    DELETE ROOM
                  </Button>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-karla font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-100 rounded-none"
                  placeholder="Room title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-karla font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-100 rounded-none"
                  placeholder="Room description..."
                  rows={4}
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-karla font-medium text-gray-700 mb-1">
                  Image
                </label>
                {image ? (
                  <div className="relative mb-2">
                    <img 
                      src={image} 
                      alt={name} 
                      className="w-64 h-auto object-cover" 
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImage(null)}
                    >
                      <span className="sr-only">Remove</span>
                      <span className="text-xs">×</span>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="bg-white text-hugo-red border-hugo-red hover:bg-red-50 text-xs flex items-center"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span>ADD IMAGE</span>
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
              
              <h2 className="text-2xl font-merriweather font-light mb-6">Facilities</h2>
              
              <div className="space-y-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="mb-4 relative">
                    <label className="block text-sm font-karla font-medium text-gray-700 mb-1">
                      Facility
                    </label>
                    <div className="flex items-center">
                      <Input
                        value={facility}
                        readOnly
                        className="bg-gray-100 rounded-none"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-hugo-red hover:bg-red-50"
                        onClick={() => removeFacility(index)}
                      >
                        <span className="sr-only">Remove</span>
                        <span className="text-lg">×</span>
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-karla font-medium text-gray-700 mb-1">
                    Facility
                  </label>
                  <Input
                    placeholder="Facility detail"
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-100 mb-2 rounded-none"
                  />
                  <Button 
                    variant="outline" 
                    className="bg-white text-hugo-red border-hugo-red hover:bg-red-50 text-xs flex items-center"
                    onClick={handleAddFacility}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    <span>ADD FACILITY</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-hugo-red hover:bg-red-600 text-white uppercase text-sm px-6 py-3 rounded-none"
                  onClick={handleSave}
                  disabled={isSaving || isPdfGenerating}
                >
                  {isSaving || isPdfGenerating 
                    ? (isNewRoom ? "CREATING..." : "SAVING...") 
                    : (isNewRoom ? "CREATE AND GENERATE PDF" : "SAVE AND GENERATE PDF")}
                </Button>
              </div>
            </div>
            
            <div className="w-1/3">
              <div className="bg-gray-200 p-6">
                <h2 className="text-xl font-merriweather font-light mb-6">Dates</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-karla text-gray-500 mb-1">Created</div>
                    <div className="font-karla">{room?.created || new Date().toLocaleDateString('en-GB')}</div>
                  </div>
                  <div>
                    <div className="text-sm font-karla text-gray-500 mb-1">Updated</div>
                    <div className="font-karla">{room?.updated || '-'}</div>
                  </div>
                </div>
              </div>
              
              {!isNewRoom && (
                <div className="mt-6">
                  <Button 
                    className="bg-hugo-red hover:bg-red-600 text-white uppercase text-sm w-full flex items-center justify-center py-3 rounded-none"
                    onClick={() => handleGeneratePDF(room?.id || '')}
                    disabled={isPdfGenerating}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isPdfGenerating ? "GENERATING..." : "DOWNLOAD PDF"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are deleting a room. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 uppercase font-karla text-xs">
              No take me back
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-hugo-red hover:bg-red-700 uppercase font-karla text-xs"
              onClick={handleDelete}
            >
              Yes delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomDetails;
