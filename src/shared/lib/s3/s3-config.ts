import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: "https://s3.ru1.storage.beget.cloud", // Beget S3 endpoint
  region: "ru-1", // Регион Beget S3
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!
  },
  forcePathStyle: true // Обязательно для некоторых S3-совместимых хранилищ
} as S3ClientConfig);

export default s3Client;