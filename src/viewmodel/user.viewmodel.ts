import {Body} from "@mo/express";

export class UserViewModel {
    @Body
    username;
    @Body
    password;
}

/**
 * Created by yskun on 2017/7/15.
 */
