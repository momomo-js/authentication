import {GROUP} from "./symbol";
export function AuthSelf() {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata(GROUP, ['self'], target, propertyKey);
    }

}

/**
 * Created by yskun on 2017/7/18.
 */
