import { FeatureDTO } from "./FeatureDTO";

export interface FacilityDTO {
  facilityId: number;
  name: string;
  description: string;
  imageUrl: string;
  features: FeatureDTO[];
  schedule?: string;
}