import {User} from "../model/user";
import {IUser} from "../define/user-interface";
import {UserViewModel} from "../viewmodel/user.viewmodel";
import * as crypto from "crypto";
import {UserGroup} from "../model/user-group";
import {Injectable} from "injection-js";
import {Input} from "@mo/core";

@Injectable()
export class UserService {

    @Input('auth-salt')
    salt: string = null;

    @Input('auth-def-group')
    defaultGroup: string = null;

    constructor() {
    }

    encryptionMethod(str: string): string {
        let s = str + this.salt;
        const hash = crypto.createHash('sha256');
        hash.update(str);
        return hash.digest('hex');
    }

    async auth(userModel: UserViewModel): Promise<IUser> {
        userModel.password = this.encryptionMethod(userModel.password);
        let user: User = <User> await User.find({
            where: {
                username: userModel.username,
                password: userModel.password,
                state: true
            }
        });


        if (user) {
            let group: UserGroup = <UserGroup> await user.$get('group');
            let p: IUser = {
                id: user.id,
                username: user.username,
                group: group.group
            };
            return p;
        }
        return null;
    }

    async register(userModel: UserViewModel): Promise<IUser> {
        userModel.password = this.encryptionMethod(userModel.password);
        let user: User = new User(userModel);
        let userGroup: UserGroup = <UserGroup> await UserGroup.find({
            where: {
                group: this.defaultGroup
            }
        });

        //todo
        let result = true;
        if (!userGroup)
            throw new Error('the default group has wrong value');
        try {
            await user.save();
        } catch (e) {
            result = false;
        }

        if (result) {
            await user.$set('group', userGroup);
            let ret: IUser = {
                id: user.id,
                username: user.username,
                group: userGroup.group
            };

            return ret;
        }

        else {
            return null;
        }
    }

    async del(userModel: UserViewModel): Promise<boolean> {
        userModel.password = this.encryptionMethod(userModel.password);
        let ret: User = <User> await User.find({
            where: {
                username: userModel.username,
                password: userModel.password,
                state: true
            }
        });

        if (ret) {
            ret.state = false;
            ret = await ret.save();
        }

        return !!ret;
    }
}

/**
 * Created by yskun on 2017/7/15.
 * MoProject COPYRIGHT
 */
