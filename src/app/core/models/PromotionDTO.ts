import { roomTypeDTO } from "./RoomType.DTO";

export interface promotionDTO {
    promotionId: number;
    name: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    roomTypeDTO : roomTypeDTO;
}