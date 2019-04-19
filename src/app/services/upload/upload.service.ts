import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

// Services
import { ConfigService } from '../config/config.service';

@Injectable()
export class UploadService {

    constructor(
        public configService: ConfigService
    ) { }

    uploadAvatar(file, name): Promise<any> {
        return new Promise((resolve, reject) => {

            const uploadFolder = this.configService.dataConfig['avatarFolder'];

            if (file && name) {

                const uploadTask = firebase.storage().ref(`${uploadFolder}/${name}`).put(file);

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snap => {
                    console.log(snap);
                }, err => {
                    resolve({
                        status: 'Error',
                        error: err
                    });
                }, () => {
                    resolve({
                        status: 'Success',
                        url: uploadTask.snapshot.downloadURL
                    });
                });

            }

        });
    }

    deleteImage(path: string): Promise<any> {
        return new Promise((resolve, reject) => {

            if (path) {

                firebase.storage().ref().child(path).delete().then(() => {
                    resolve({
                        status: 'Success'
                    });
                })
                .catch(err => {
                    resolve({
                        status: 'Error',
                        error: err
                    });
                });

            }

        });
    }

}
