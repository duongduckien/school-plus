import { Injectable } from '@angular/core';
declare var firebase: any;

@Injectable()
export class UploadService {

  constructor() {

  }

  insertData(file, key = null) {
    const extension = file.name.split('.').pop();
    const fileName = `${key}.${extension}`;
    return firebase.storage().ref(`uploads/${fileName}`).put(file);
  }

}
