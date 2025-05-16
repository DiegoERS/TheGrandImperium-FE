import { FeatureDTO } from "./FeatureDTO";
import { RoomTypeImageDTO } from "./RoomTypeImageDTO";

export interface roomTypeDTO {
    roomTypeId: number;
    description: string;
    name: string;
    basePrice: number;
    features: FeatureDTO[];
    roomTypeImageDTO: RoomTypeImageDTO; 
}