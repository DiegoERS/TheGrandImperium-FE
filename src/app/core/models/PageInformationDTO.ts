import { PageDTO } from "./PageDTO";
import { PageInformationImageDTO } from "./PageInformationImageDTO";

export interface PageInformationDTO {
    pageInformationId: number;
    subtitle: string;
    description: string;
    pageDTO: PageDTO;
    pageInformationImageDTOs: PageInformationImageDTO[];
  }