import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-advertising',
  imports: [CommonModule],
  templateUrl: './advertising.component.html',
  styleUrl: './advertising.component.scss'
})
export class AdvertisingComponent implements OnInit {
  modalVisible = false; // Inicialmente, el modal está visible

  ngOnInit() {
    this.modalVisible = true; // Asegúrate de que el modal esté visible al iniciar el componente
  }
  cerrarModal() {
    this.modalVisible = false;
  }
}
