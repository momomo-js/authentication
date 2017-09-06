import {ExpressBeforeController, ExpressServer, ResponseHandler} from "@mo/express";
import {IController, Plugin, PluginPackage} from "@mo/core";
import * as e from "express";
import {IUser} from "../define/user-interface";
import {GROUP} from "../decoractor/symbol";

@PluginPackage(ExpressServer)
export class AuthPluginPackage {

    @Plugin(ExpressBeforeController)
    judge(req: e.Request, res: ResponseHandler, cIns: IController, cFun: Function) {
        let user: IUser = req['session'].user;
        let group: string[] = Reflect.getMetadata(GROUP, cIns, cFun.name);
        if (group) {
            for (let g of group) {
                switch (g) {
                    case 'all':
                        if (user && user.group)
                            return true;
                        break;
                    case '!all':
                        if (!user)
                            return true;
                        break;
                    case 'self':
                        if (user && req.body.username && req.body.username === user.username)
                            return true;
                        break;
                    default:
                        if (user.group == g)
                            return true;
                        break;
                }

            }
        } else {
            return true;
        }
        res.status(200).message('无访问权限');
        return false;
    }
}

/**
 * Created by yskun on 2017/7/15.
 */
