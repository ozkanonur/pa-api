// Other dependencies
import * as s3 from 'aws-sdk/clients/s3'

// Local files
import { configService } from './config.service'
export class AwsService {
    private s3Instance() {
        return new s3({
            accessKeyId: configService.getEnv('AWS_S3_ACCESS_KEY'),
            secretAccessKey: configService.getEnv('AWS_S3_SECRET_KEY'),
            region: configService.getEnv('AWS_S3_REGION')
        })
    }

    getImageBuffer(fileName: string, directory: 'users' | 'titles'): unknown {
        return new Promise((resolve) => {
            this.s3Instance().getObject({
                Bucket: configService.getEnv('AWS_S3_BUCKET'), Key: `${directory}/${fileName}.jpg`
            }, (error, data) => {
                if (error) {
                    this.s3Instance().getObject({
                        Bucket: configService.getEnv('AWS_S3_BUCKET'),
                        Key: `${directory}/default.jpg`
                    }, (_e, value) => {
                        resolve(value.Body)
                    })
                    return
                }
                resolve(data.Body)
            })
        })
    }

    uploadImage(fileName: string, directory: 'users' | 'titles', buffer: Buffer): void {
        this.s3Instance().upload({
            Bucket: configService.getEnv('AWS_S3_BUCKET'),
            Key: `${directory}/${fileName}.jpg`,
            Body: buffer
        }, (error, _data) => {
            if (error) return error
        })
    }

    deleteImage(fileName: string, directory: 'users' | 'titles'): void {
        this.s3Instance().deleteObject({
            Bucket: configService.getEnv('AWS_S3_BUCKET'),
            Key: `${directory}/${fileName}.jpg`,
        }, (error, _data) => {
            if (error) return error
        })
    }
}
