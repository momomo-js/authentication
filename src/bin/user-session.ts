import {Origin} from "@mo/express";
import {IUser} from "../define/user-interface";

export class UserSession {

    private session: any;

    constructor(origin: Origin) {
        this.session = origin.request['session'];
    }

    set(user: IUser) {
        this.session.user = user;
    }

    get(): IUser {
        return this.session.user;
    }

    isUser(id?: number, username?: string, group?: string): boolean {
        let ret = true;
        if (!this.has()) {
            return false;
        }
        let user: IUser = this.get();
        if (id && user.id !== id) {
            ret = false;
        }

        if (username && user.username !== username) {
            ret = false;
        }

        if (group && user.group !== group) {
            ret = false;
        }

        return ret;
    }

    has(): boolean {
        return !!this.session.user;
    }

    delete() {
        this.session.user = null;
    }

}