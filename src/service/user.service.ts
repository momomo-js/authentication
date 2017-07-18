import {co} from "@mo/core";
import {User} from "../model/user";
import {IUser} from "../define/user-interface";
import {UserViewModel} from "../viewmodel/user.viewmodel";
import * as crypto from "crypto";
import {UserGroup} from "../model/user-group";
import {Inject, Injectable} from "injection-js";
import {Authentication} from "../bin/authentication";
import {AuthenticationToken} from "../decoractor/symbol";

@Injectable()
export class UserService {
    constructor(@Inject(AuthenticationToken) public authentication: Authentication) {
    }

    encryptionMethod(str: string): string {
        let s = str + this.authentication.salt;
        const hash = crypto.createHash('sha256');
        hash.update(str);
        return hash.digest('hex');
    }

    auth(userModel: UserViewModel): Promise<IUser> {
        let p = this;
        return co(function *() {
            userModel.password = p.encryptionMethod(userModel.password);
            let user: User = yield User.find({
                where: {
                    username: userModel.username,
                    password: userModel.password,
                    state: true
                }
            });


            if (user) {
                let group = yield user.$get('group');
                let p: IUser = {
                    id: user.id,
                    username: user.username,
                    group: group.group
                };
                return p;
            }
            return null;
        });
    }

    register(userModel: UserViewModel): Promise<IUser> {
        let p = this;

        return co(function *() {
            userModel.password = p.encryptionMethod(userModel.password);
            let user: User = new User(userModel);
            let userGroup: UserGroup = yield UserGroup.find({
                where: {
                    group: p.authentication.defaultGroup
                }
            });

            //todo
            let result = true;
            if (!userGroup)
                throw new Error('the default group has wrong value');
            try {
                yield user.save();
            } catch (e) {
                result = false;
            }

            if (result) {
                yield user.$set('group', userGroup);
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
        });
    }

    del(userModel: UserViewModel): Promise<boolean> {
        let p = this;
        return co(function *() {
            userModel.password = p.encryptionMethod(userModel.password);
            let ret: User = yield User.find({
                where: {
                    username: userModel.username,
                    password: userModel.password,
                    state: true
                }
            });

            if (ret) {
                ret.state = false;
                ret = yield ret.save();
            }

            return !!ret;
        })
    }
}

/**
    * Created by yskun on 2017/7/15.
    * MoProject COPYRIGHT
    */
