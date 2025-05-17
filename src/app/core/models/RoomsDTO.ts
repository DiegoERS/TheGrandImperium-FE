import { roomTypeDTO } from "./RoomType.DTO";

export interface RoomsDTO {
    roomId: number;
    roomNumber: string;
    isActive: boolean;
    roomTypeDTO: roomTypeDTO;
}