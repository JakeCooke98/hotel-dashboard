import { Room } from "../types/room";
import { toast } from "sonner";

const API_URL = "http://localhost:8000/api/v1";

// Service to get all rooms
export const getAllRooms = async (): Promise<Room[]> => {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/rooms`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    toast.error("Failed to load rooms. Please try again later.");
    // Return empty array instead of throwing - more graceful degradation
    return [];
  }
};

// Service to get a single room by ID
export const getRoom = async (id: string): Promise<Room> => {
  // Handle invalid or undefined IDs
  if (!id || id === "undefined") {
    console.warn("Invalid room ID provided:", id);
    // Return a template for a new room if id is invalid
    return {
      id: "new",
      name: "",
      description: "",
      facilities: 0,
      created: new Date().toLocaleDateString('en-GB'),
      updated: null,
      facilityList: [],
      image: null
    };
  }
  
  if (id === "new") {
    // Return a template for a new room
    return {
      id: "new",
      name: "",
      description: "",
      facilities: 0,
      created: new Date().toLocaleDateString('en-GB'),
      updated: null,
      facilityList: [],
      image: null
    };
  }
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Room not found: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching room:", error);
    toast.error("Failed to load room details. Please try again later.");
    throw error;
  }
};

// Service to add a new room
export const addRoom = async (room: Omit<Room, 'id' | 'created'>): Promise<Room> => {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(room),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create room: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating room:", error);
    toast.error("Failed to create room. Please try again later.");
    throw error;
  }
};

// Service to update a room
export const updateRoom = async (updatedRoom: Room): Promise<Room> => {
  try {
    if (updatedRoom.id === "new") {
      // Create a new room instead
      return addRoom(updatedRoom);
    }
    
    const response = await fetch(`${API_URL}/rooms/${updatedRoom.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updatedRoom),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update room: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating room:", error);
    toast.error("Failed to update room. Please try again later.");
    throw error;
  }
};

// Service to delete a room
export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete room: ${response.status} ${errorText}`);
    }
    
    toast.success("Room deleted successfully");
  } catch (error) {
    console.error("Error deleting room:", error);
    toast.error("Failed to delete room. Please try again later.");
    throw error;
  }
};

// Service to generate a PDF for a room
export const generateRoomPDF = async (id: string): Promise<Blob> => {
  if (!id || id === "new" || id === "undefined") {
    throw new Error("Cannot generate PDF for unsaved room");
  }
  
  try {
    const response = await fetch(`${API_URL}/rooms/${id}/pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF: ${response.status} ${errorText}`);
    }
    
    toast.success("PDF generated successfully");
    return await response.blob();
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again later.");
    throw error;
  }
};
