import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { ApiConfigService } from '../../modules/api-config/api.config.service';

@Injectable()
export class S3StorageAdapter {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ApiConfigService) {
    const secretAccessKey = this.configService.AWS_SECRET_ACCESS_KEY;
    const accessKeyId = this.configService.AWS_ACCESS_KEY_ID;
    this.bucket = this.configService.AWS_BUCKET;
    this.endpoint = this.configService.AWS_ENDPOINT;
    // Set the AWS Region.
    const REGION = 'eu-central-1';
    // Create an Amazon S3 service client object.
    this.s3Client = new S3Client({
      region: REGION,
      // endpoint: 'https://bee-brick.s3.eu-central-1.amazonaws.com',
      credentials: {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKeyId,
      },
    });
  }

  /**
   * Save file to S3
   * @param userId
   * @param photo
   * @param key
   * @param mimetype
   */
  async saveFile(userId: number, photo: Buffer, key: string, mimetype: string) {
    const bucketParams = {
      Bucket: this.bucket,
      // Specify the name of the new object. For example, 'index.html'.
      // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      Key: key,
      // Content of the new object.
      Body: photo,
      ContentType: mimetype, //'image/png',
    };
    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
      return {
        key: `${this.endpoint}/${key}`,
        fieldId: uploadResult.ETag.slice(1, -1),
      };
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Delete file from S3
   * @param key
   */
  async deleteFile(key: string) {
    const delete_bucket_params = {
      Bucket: this.bucket,
      Key: key,
    };
    const command = new DeleteObjectCommand(delete_bucket_params);

    try {
      const data = await this.s3Client.send(command);
      //console.log('Success. Object deleted.------------', data);
      return data; // For unit tests.
    } catch (err) {
      console.error('Error', err);
    }
  }
}
