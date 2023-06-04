import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AxiosResponse } from 'axios/index';

@Injectable()
export class ClientAdapter {
  private readonly logger = new Logger(ClientAdapter.name);
  constructor() {}

  async sendFormData<T>(formData: FormData): Promise<T> {
    const response = await axios.post('http://localhost:5004/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return this._handleResponse(response);
  }

  deleteImages(keys: string[]) {
    return axios.delete('http://localhost:5004/images', {
      data: { keys: keys },
    });
  }

  private async _handleResponse(response: AxiosResponse) {
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    const errorMessage = await response.data.error.message;
    throw new Error(errorMessage);
  }
}
