import { AdvertisingImageDTO } from "./AdvertisingImageDTO";

export interface AdvertisingDTO {
    advertisingId: number;
    name: string;
    link: string;
    advertisingImageDTO: AdvertisingImageDTO;
  }