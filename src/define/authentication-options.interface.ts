import {IUserGroup} from "./user-group.interface";
export interface IAuthenticationOptions{
    group:IUserGroup[];
    salt?: string;
    defaultGroup?: string;
}

/**
 * Created by yskun on 2017/7/14.
 */
