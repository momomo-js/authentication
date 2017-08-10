import {co, Controller, Method} from "@mo/core";
import {DEL, Express, GET, POST, ResponseHandler, Origin} from "@mo/express";
import {UserViewModel} from "../viewmodel/user.viewmodel";
import {UserService} from "../service/user.service";
import {Auth} from "../decoractor/auth";
import e = require("express");
import {IUser} from "../define/user-interface";

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
    login(model: UserViewModel, res: ResponseHandler, req: Origin): Promise<ResponseHandler> {
        let p = this;
        return co(function* () {

            if (!model.username || !model.password) {
                return res.status(102);
            }

            if (req.request.session.user) {
                return res.status(101);
            }

            let ret = yield p.userService.auth(model);

            if (ret) {
                req.request.session.user = ret;
                res.status(0).body(ret);
            } else {
                res.status(1);
            }

            return res;
        });
    }

    @Method(GET, '/logout')
    @Express({
        responds: logoutResponds
    })
    @Auth({
        group: ['all']
    })
    logout(req: Origin, res: ResponseHandler): Promise<ResponseHandler> {
        return co(function* () {
            if (req.request.session.user) {
                req.request.session.user = null;
                res.status(0);
            }
            else {
                res.status(1);
            }
            return res;
        })
    }

    @Method(POST, '/register')
    @Express({
        responds: registerResponds
    })
    @Auth({
        group: ['!all']
    })
    register(req: Origin, res: ResponseHandler, user: UserViewModel): Promise<ResponseHandler> {
        let p = this;
        return co(function* () {

            //todo 添加同用户名注册问题
            let ret = yield p.userService.register(user);
            if (ret) {
                req.request.session.user = ret;
                res.status(0).body(ret);
            } else {
                res.status(1);
            }

            return res;
        });
    }

    @Method(DEL, '/del')
    @Express({
        responds: delResponds
    })
    @Auth({
        group: ['self']
    })
    del(user: UserViewModel, res: ResponseHandler, req: Origin): Promise<ResponseHandler> {
        let p = this;
        return co(function* () {
            let ret = yield  p.userService.del(user);
            if (ret) {
                req.request.session.user = null;
                res.status(0);
            } else {
                res.status(1);
            }
            return res;
        })
    }

    @Method(GET, '/status')
    @Express({
        responds: statusResponds
    })
    status(origin: Origin, res: ResponseHandler): Promise<ResponseHandler> {
        return co(function* () {
            let nowUser: IUser = origin.request.session.user;
            if (nowUser) {
                return res.status(0);
            } else {
                return res.status(1);
            }
        });
    }
}

/**
 * Created by yskun on 2017/7/15.
 */
