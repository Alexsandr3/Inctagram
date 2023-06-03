import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClientAdapter {
  private readonly logger = new Logger(ClientAdapter.name);
  constructor() {}

  async sendFormData<T>(formData: FormData): Promise<T> {
    try {
      const response = await axios.post('http://localhost:5004/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  deleteImages(keys: string[]) {
    return axios.delete('http://localhost:5004/images', {
      data: { keys: keys },
    });
  }
}
