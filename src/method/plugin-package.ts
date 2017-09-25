import {CFunc, ExpressBeforeController, ExpressServer, Origin, ResponseHandler} from "@mo/express";
import {Plugin, PluginPackage} from "@mo/core";
import {IUser} from "../define/user-interface";
import {GROUP} from "../decoractor/symbol";
import {UserSession} from "../bin/user-session";

@PluginPackage(ExpressServer)
export class AuthPluginPackage {

    @Plugin(ExpressBeforeController)
    judge(origin: Origin, res: ResponseHandler, cFunc: CFunc) {
        let user: IUser = origin.request['session'].user;
        let userSession = new UserSession(origin);
        let req = origin.request;
        let group: string[] = cFunc.getMetadata(GROUP);
        if (group) {
            for (let g of group) {
                switch (g) {
                    case 'all':
                        if (user && user.group)
                            return userSession;
                        break;
                    case '!all':
                        if (!user)
                            return userSession;
                        break;
                    case 'self':
                        if (user && req.body.username && req.body.username === user.username)
                            return userSession;
                        break;
                    default:
                        if (user.group == g)
                            return userSession;
                        break;
                }
            }
        } else {
            return userSession;
        }
        res.status(200).message('无访问权限');
        return false;
    }
}

/**
 * Created by yskun on 2017/7/15.
 */
