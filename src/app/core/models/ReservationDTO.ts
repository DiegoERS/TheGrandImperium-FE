import { CustomerDTO } from "./CustomerDTO";
import { RoomsDTO } from "./RoomsDTO";

export interface ReservationDTO {
    reservationId: number;
    reservationDate: string;
    startDate: string;
    endDate: string;
    customerDTO: CustomerDTO;
    roomDTO: RoomsDTO;
}
