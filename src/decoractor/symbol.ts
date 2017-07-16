
import {InjectionToken} from "injection-js";
import {Authentication} from "../bin/authentication";
export let GROUP = Symbol("GROUP");
export let AuthenticationToken = new InjectionToken<Authentication>('authentication');

/**
 * Created by yskun on 2017/7/15.
 */
