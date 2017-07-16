
import {IAuthMethodOptions} from "../define/auth-method-options.interface";
import {GROUP} from "./symbol";
export function Auth(options?:IAuthMethodOptions)
{
    return function (target: any, propertyKey: string) {
        if(options&& options.group)
        {
            Reflect.defineMetadata(GROUP,options.group,target,propertyKey);
        }
    }

}



/**
 * Created by yskun on 2017/7/15.
 */
