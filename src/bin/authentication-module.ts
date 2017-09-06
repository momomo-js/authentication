import {Module} from "@mo/core";
import {Authentication} from "./authentication";
import {AuthPluginPackage} from "../method/plugin-package";
import {UserRouter} from "../controller/user.router";

@Module({
    routers: [UserRouter],
    components: [Authentication],
    plugins: [AuthPluginPackage]
})
export class AuthenticationModule {
}