import { Injectable } from '@angular/core';

// Services
import { FirebaseService } from '../firebase/firebase.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RelationService {

    constructor(
        public firebaseService: FirebaseService,
        public configService: ConfigService
    ) { }

    async getRelationOfPupils(data: any) {

        const ref = this.configService.dataConfig['relationship']['pupils'];

        try {

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (ref.length > 0) {
                        for (let j = 0; j < ref.length; j++) {
                            const fieldName = ref[j]['fieldName'];
                            const collectionName = ref[j]['collectionName'];
                            if (data[i][fieldName]) {
                                const result = await this.firebaseService.getWhereKey(collectionName, data[i][fieldName]);
                                data[i][fieldName] = (result.length > 0) ? result[0] : data[i][fieldName];
                            }
                        }
                    }
                }
            }

        } catch (e) {
            console.log(e);
        }

        return data;

    }

}
