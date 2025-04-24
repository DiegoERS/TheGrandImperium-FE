import { Component,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisingDTO } from '../../../core/models/AdvertisingDTO';
import { AdvertisingService } from '../../../core/services/advertising.service';
@Component({
  selector: 'app-advertising',
  imports: [CommonModule],
  templateUrl: './advertising.component.html',
  styleUrl: './advertising.component.scss'
})
export class AdvertisingComponent implements OnInit {
  advertisingService=inject(AdvertisingService);

  advertisings: AdvertisingDTO[] = [];
  modalVisible = false; // Inicialmente, el modal está visible

  ngOnInit() {
    this.advertisingService.getAdvertisings().subscribe((data: AdvertisingDTO[]) => {
      this.advertisings = data;
      console.log(this.advertisings);
    }
    );
    this.modalVisible = true; // Asegúrate de que el modal esté visible al iniciar el componente
  }
  cerrarModal() {
    this.modalVisible = false;
  }


  
}
