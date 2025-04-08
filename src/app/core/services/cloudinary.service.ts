import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = environment.cloudinary_name; // Lo configuras en tu cuenta Cloudinary
  private uploadPreset = environment.cloudinary_upload_preset; // Lo configuras en tu cuenta Cloudinary
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  httpClient=inject(HttpClient);

    /**
   * ✅ Subir una imagen
   * @param file archivo de imagen
   * @returns Observable<string> URL de la imagen subida
   */
    uploadImage = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
    
      const res = await this.httpClient.post<any>(this.uploadUrl, formData).toPromise();
      return res.secure_url;
    }
  
    /**
     * ✅ Subir múltiples imágenes
     * @param files arreglo de archivos
     * @returns Promise<string[]> URLs de las imágenes subidas
     */
    uploadMultipleImages = async (files: File[]): Promise<string[]> => {
      const uploadPromises = files.map(file => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    }
}
