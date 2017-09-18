import {Controller, Method} from "@mo/core";
import {DEL, Express, GET, POST, ResponseHandler} from "@mo/express";
import {UserViewModel} from "../viewmodel/user.viewmodel";
import {UserService} from "../service/user.service";
import {Auth} from "../decoractor/auth";
import {UserSession} from "../bin/user-session";

let loginResponds = [
    {
        status: 0,
        message: '登陆成功'
    },
    {
        status: 1,
        message: '登陆失败，请检查用户密码是否正确'
    },
    {
        status: 101,
        message: '用户已登陆'
    },
    {
        status: 102,
        message: '请输入用户和密码'
    }];

let logoutResponds = [
    {
        status: 0,
        message: '已注销'
    },
    {
        status: 1,
        message: '用户尚未登陆'
    }];

let registerResponds = [
    {
        status: 0,
        message: '注册成功'
    },
    {
        status: 1,
        message: '注册失败'
    }];

let delResponds = [
    {
        status: 0,
        message: '删除用户成功'
    },
    {
        status: 1,
        message: '删除失败，用户不存在或密码不正确'
    }
];

let statusResponds = [
    {
        status: 0,
        message: '用户已登陆'
    },
    {
        status: 1,
        message: '用户未登录'
    }
];

@Controller({
    models: [UserViewModel]
})
export class UserController {

    constructor(private userService: UserService) {
    }

    @Method(POST, '/login')
    @Express({
        responds: loginResponds
    })
    async login(model: UserViewModel, res: ResponseHandler, userSession: UserSession): Promise<ResponseHandler> {

        if (!model.username || !model.password) {
            return res.status(102);
        }

        if (userSession.has()) {
            return res.status(101);
        }

        let ret = await this.userService.auth(model);

        if (ret) {
            userSession.set(ret);
            res.status(0).body(ret);
        } else {
            res.status(1);
        }

        return res;
    }

    @Method(GET, '/logout')
    @Express({
        responds: logoutResponds
    })
    @Auth({
        group: ['all']
    })
    async logout(userSession: UserSession, res: ResponseHandler): Promise<ResponseHandler> {
        if (userSession.has()) {
            userSession.delete();
            res.status(0);
        }
        else {
            res.status(1);
        }
        return res;
    }

    @Method(POST, '/register')
    @Express({
        responds: registerResponds
    })
    @Auth({
        group: ['!all']
    })
    async register(userSession: UserSession, res: ResponseHandler, user: UserViewModel): Promise<ResponseHandler> {

        //todo 添加同用户名注册问题
        let ret = await this.userService.register(user);
        if (ret) {
            userSession.set(ret);
            res.status(0).body(ret);
        } else {
            res.status(1);
        }

        return res;
    }

    @Method(DEL, '/del')
    @Express({
        responds: delResponds
    })
    @Auth({
        group: ['self']
    })
    async del(userSession: UserSession, user: UserViewModel, res: ResponseHandler): Promise<ResponseHandler> {
        let ret = await this.userService.del(user);
        if (ret) {
            userSession.delete();
            res.status(0);
        } else {
            res.status(1);
        }
        return res;
    }

    @Method(GET, '/status')
    @Express({
        responds: statusResponds
    })
    async status(userSession: UserSession, res: ResponseHandler): Promise<ResponseHandler> {
        if (userSession.has()) {
            return res.status(0);
        } else {
            return res.status(1);
        }
    }
}

/**
 * Created by yskun on 2017/7/15.
 */
