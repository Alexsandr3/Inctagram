import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class ClientImagesAdapter {
  private readonly logger = new Logger(ClientImagesAdapter.name);
  urlServiceImages: string;
  constructor(private readonly configService: ApiConfigService) {
    this.urlServiceImages = this.configService.SERVER_URL_IMAGES;
  }

  async sendFormData<T>(formData: FormData): Promise<T> {
    const response = await axios.post(`${this.urlServiceImages}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return this._handleResponse(response);
  }

  deleteImages(keys: string[]): Promise<AxiosResponse> {
    return axios.delete(`${this.urlServiceImages}/images`, {
      data: { keys: keys },
    });
  }

  private async _handleResponse(response: AxiosResponse): Promise<any> {
    switch (response.status) {
      case 200:
      case 201:
        return response.data;
      case 204:
        return;
      case 400:
        throw new Error('Bad Request');
      default:
        const errorMessage = await response.data.error.message;
        throw new Error(errorMessage);
    }
  }
}
