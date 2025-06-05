import { Component, inject, OnInit } from '@angular/core';
import { FeatureDTO } from '../../core/models/FeatureDTO';
import { FormBuilder, FormGroup } from '@angular/forms';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { FeatureService } from '../../core/services/feature.service';
import { RoomTypeService } from '../../core/services/roomType.service';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-features',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './update-features.component.html',
  styleUrl: './update-features.component.scss'
})
export class UpdateFeaturesComponent implements OnInit {

  features: FeatureDTO[] = [];
  featureForm: FormGroup;
  displayedColumns = ['name', 'actions'];

  // RoomType section
  roomTypes: roomTypeDTO[] = [];
  selectedRoomTypeId: number | null = null;
  linkedFeatures: FeatureDTO[] = [];
  unlinkedFeatures: FeatureDTO[] = [];
  selectedFeatureToLink: FeatureDTO | null = null;

  private featureService= inject(FeatureService);
  private roomTypeService= inject(RoomTypeService);
  private fb = inject(FormBuilder);

  constructor() {
    this.featureForm = this.fb.group({
      featureId: [null],
      name: ['']
    });
  }

  ngOnInit(): void {
    this.loadFeatures();
    this.roomTypeService.getAll().subscribe(data => this.roomTypes = data);
  }

  loadFeatures() {
    this.featureService.getAllFeatures().subscribe(data => this.features = data);
  }

saveFeature() {
  const feature: FeatureDTO = this.featureForm.value;

  const action = feature.featureId
    ? this.featureService.updateFeature(feature)
    : this.featureService.addFeature(feature);

  action.subscribe(() => {
    this.loadFeatures();
    this.resetForm();

    Swal.fire({
      icon: 'success',
      title: feature.featureId ? 'Feature actualizada' : 'Feature agregada',
      timer: 1500,
      showConfirmButton: false
    });
  });
}

  editFeature(feature: FeatureDTO) {
    this.featureForm.patchValue(feature);
  }

deleteFeature(id: number) {
  // Verificar si está vinculada a algún RoomType
  const isLinked = this.roomTypes.some(rt =>
    rt.features?.some(f => f.featureId === id)
  );

  if (isLinked) {
    Swal.fire({
      icon: 'error',
      title: 'No se puede eliminar',
      text: 'La Caracteristica está vinculada a un tipo de habitación.',
    });
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this.featureService.deleteFeature(id).subscribe(() => {
        this.loadFeatures();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  });
}


  resetForm() {
    this.featureForm.reset({ featureId: null, name: '' });
  }

  // Vincular/Desvincular
  loadRoomTypeFeatures() {
    if (!this.selectedRoomTypeId) return;

    this.featureService.getFeaturesByRoomType(this.selectedRoomTypeId).subscribe(linked => {
      this.linkedFeatures = linked;

      this.featureService.getAllFeatures().subscribe(all => {
        this.unlinkedFeatures = all.filter(f => !linked.find(lf => lf.featureId === f.featureId));
      });
    });
  }

  link() {
  if (!this.selectedFeatureToLink || !this.selectedRoomTypeId) return;

  this.featureService
    .linkFeatureToRoomType(this.selectedFeatureToLink.featureId, this.selectedRoomTypeId)
    .subscribe(() => {
      this.loadRoomTypeFeatures();

      Swal.fire({
        icon: 'success',
        title: 'Feature vinculada',
        timer: 1500,
        showConfirmButton: false
      });
    });
}

unlink(feature: FeatureDTO) {
  if (!this.selectedRoomTypeId) return;

  this.featureService
    .unlinkFeatureFromRoomType(feature.featureId, this.selectedRoomTypeId)
    .subscribe(() => {
      this.loadRoomTypeFeatures();

      Swal.fire({
        icon: 'info',
        title: 'Feature desvinculada',
        timer: 1500,
        showConfirmButton: false
      });
    });
}
}
