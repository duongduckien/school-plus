import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {

    getAll(collection: string) {
        return firebase.database().ref(collection);
    }

    getWhereLimit(collection: string, param, start, end) {
        return firebase.database().ref(collection).orderByChild(param).startAt(start).endAt(end);
    }

    getWhereParam(collection: string, param, value) {
        return firebase.database().ref(collection).orderByChild(param).equalTo(value);
    }

    insert(collection: string, data): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).push(data, err => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    updateWhereKey(collection: string, key, data): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection + '/' + key).update(data, err => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            })
        });
    }

    create(collection: string, data): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).push(data, err => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            })

        });
    }

    deleteWhereKey(collection: string, key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).child(key).remove(err => {
                if (!err) {
                    resolve()
                } else {
                    reject(err);
                }
            })
        });
    }

    getWhere(collection: string, param, value): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).orderByChild(param).equalTo(value).once('value', res => {
                if (res.val()) {
                    resolve(this.convertData(res.val()));
                } else {
                    resolve([]);
                }
            });
        });
    }

    getWhereKey(collection: string, key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).child(key).once('value', res => {
                if (res.val()) {
                    resolve(this.convertDataOfKey(res.val(), key));
                } else {
                    resolve([]);
                }
            });
        });
    }

    getLimit(collection: string, param, start, end): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).orderByChild(param).startAt(start).endAt(end).once('value', res => {
                if (res.val()) {
                    resolve(this.convertData(res.val()));
                } else {
                    resolve([]);
                }
            });
        });
    }

    get(collection: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).once('value', res => {
                if (res.val()) {
                    resolve(this.convertData(res.val()));
                } else {
                    resolve([]);
                }
            });
        });
    }

    getPupilOfReport(): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref('pupils').once('value', res => {

                if (res.val()) {

                    const data = res.val();
                    const result = [];
                    const reports = [];
                    if (Object.keys(data).length > 0) {
                        for (const key of Object.keys(data)) {

                            const obj = data[key];
                            obj['$key'] = key;
                            result.push(obj);

                            const objReport = {
                                first_name: obj['first_name'],
                                last_name: obj['last_name']
                            }
                            reports.push(objReport);

                        }
                    }

                    resolve({
                        pupils: result,
                        reports: reports
                    });

                } else {
                    resolve([]);
                }
            });
        });
    }

    getLogsWhere(collection: string, param, value: any, type: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(collection).orderByChild(param).equalTo(value).once('value', res => {

                if (res.val()) {

                    const data = res.val();
                    const result = [];
                    if (Object.keys(data).length > 0) {
                        for (const key of Object.keys(data)) {
                            if (data[key]['type'] === type) {
                                const obj = data[key];
                                obj['$key'] = key;
                                result.push(obj);
                            }
                        }
                    }

                    resolve(result);

                } else {
                    resolve([]);
                }
            });
        });
    }

    /**
     * Function create new account for Firebase
     */
    createAccount(email: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    resolve('Success');
                })
                .catch(() => {
                    resolve('Error');
                });
        });
    }

    /**
     * Function update password for Firebase
     */
    updatePasswordForAccount(email: string, password: string, newPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    user.updatePassword(newPassword).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Function delete account for Firebase
     */
    deleteAccount(email: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    user.delete().then(() => {
                        resolve(true);
                    }).catch(err => {
                        reject(err);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Function login
     */
    signIn(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    /**
     * Function get current user
     */
    getActiveUser() {
        return firebase.auth().currentUser;
    }

    /**
     * Function check authentication
     */
    checkAuthentication(): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(res => {
                if (res) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Function convert data before resolve in promise
     */
    convertData(data) {
        const result = [];
        if (Object.keys(data).length > 0) {
            for (const key of Object.keys(data)) {
                const obj = data[key];
                obj['$key'] = key;
                result.push(obj);
            }
        }
        return result;
    }

    /**
     * Function convert data without key
     */
    convertDataOfKey(data: any, key: string) {
        const result = [];
        data['$key'] = key;
        result.push(data);
        return result;
    }

}
