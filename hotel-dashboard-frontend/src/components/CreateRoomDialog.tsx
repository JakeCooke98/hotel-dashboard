
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "./ui/dialog";
import { useToast } from '../hooks/use-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (data: { name: string; description: string; facilities: number }) => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateRoom 
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState<number>(10);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    onCreateRoom({
      name,
      description,
      facilities
    });

    // Reset form
    setName("");
    setDescription("");
    setFacilities(10);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. No. 5 Luxury Double Room"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter room description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facilities">Facilities (number of amenities)</Label>
              <Input
                id="facilities"
                type="number"
                min={1}
                max={20}
                value={facilities}
                onChange={(e) => setFacilities(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-hugo-red hover:bg-red-700">
              Create Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
