
import {Router} from "@mo/core";
import {UserController} from "./user.controller";
import {UserService} from "../service/user.service";
@Router({
    controllers:[UserController],
    services:[UserService]
})
export class UserRouter {

}

/**
 * Created by yskun on 2017/7/15.
 */
