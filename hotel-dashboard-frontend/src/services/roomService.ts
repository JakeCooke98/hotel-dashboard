
import { Room } from "../types/room";

// Mock data for rooms
const mockRooms: Room[] = [
  {
    id: "1",
    name: "No. 4 King Junior Suite",
    description: "Modern luxury with kingsized bed, walk-in shower, double sinks, sitting area and air conditioning.",
    facilities: 12,
    created: "17/03/25",
    updated: null,
    facilityList: ["King sized bed", "Air Conditioning", "Sitting area"],
    image: undefined
  },
  {
    id: "2",
    name: "No. 3 Luxury Double Room",
    description: "Style and beauty with double bed, walk-in shower and daily servicing.",
    facilities: 12,
    created: "17/03/25",
    updated: null,
    facilityList: ["Double bed", "Walk-in shower", "Daily servicing"],
    image: undefined
  },
  {
    id: "3",
    name: "No. 2 Luxury Double Room",
    description: "Luxury and comfort with double bed, walk-in shower and daily servicing.",
    facilities: 12,
    created: "17/03/25",
    updated: "18/03/25",
    facilityList: ["Double bed", "Walk-in shower", "Daily servicing"],
    image: undefined
  },
  {
    id: "4",
    name: "No. 1 The Apartment",
    description: "Two spacious bedrooms with kingsized beds, full bathroom, kitchen and living area set across two levels.",
    facilities: 14,
    created: "17/03/25",
    updated: "18/03/25",
    facilityList: ["Two king sized beds", "Full bathroom", "Kitchen", "Living area"],
    image: undefined
  }
];

// Service to get all rooms
export const getAllRooms = (): Promise<Room[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockRooms]);
    }, 500);
  });
};

// Service to get a single room by ID
export const getRoom = (id: string): Promise<Room> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const room = mockRooms.find(r => r.id === id);
      if (room) {
        resolve({...room});
      } else {
        reject(new Error("Room not found"));
      }
    }, 500);
  });
};

// Service to add a new room
export const addRoom = (room: Omit<Room, 'id' | 'created'>): Promise<Room> => {
  return new Promise((resolve) => {
    const newRoom: Room = {
      ...room,
      id: Math.random().toString(36).substring(2, 9),
      created: new Date().toLocaleDateString('en-GB'),
      updated: null
    };
    
    mockRooms.push(newRoom);
    
    setTimeout(() => {
      resolve({...newRoom});
    }, 500);
  });
};

// Service to update a room
export const updateRoom = (updatedRoom: Room): Promise<Room> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex(r => r.id === updatedRoom.id);
      
      if (index !== -1) {
        const roomToUpdate = {
          ...updatedRoom,
          updated: new Date().toLocaleDateString('en-GB')
        };
        
        mockRooms[index] = roomToUpdate;
        resolve({...roomToUpdate});
      } else {
        reject(new Error("Room not found"));
      }
    }, 500);
  });
};

// Service to delete a room
export const deleteRoom = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockRooms.findIndex(r => r.id === id);
      
      if (index !== -1) {
        mockRooms.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Room not found"));
      }
    }, 500);
  });
};
