import {Sequelize} from "sequelize-typescript";

import {ExpressDefaultPluginPackage} from '@mo/express-default-module'
import {Instance, Mo, Moon} from "@mo/core";
import {ExpressServer} from '@mo/express'
import {AuthenticationModule} from "../src/bin/authentication-module";
import {IUserGroup} from "../src/define/user-group.interface";

let orm: Sequelize = new Sequelize({
    name: 'db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: 'test.db'
});


@Instance({
    servers: [ExpressServer],
    modules: [AuthenticationModule],
    plugins: [ExpressDefaultPluginPackage],
    instance: {
        name: 'TEST',
        host: 'localhost',
        port: 3000
    }
})
class TestInstance {
    @Moon('auth-group')
    auth: IUserGroup[] = [{
            group: 'guest',
            description: '访客'
        }, {
            group: 'admin',
            description: '管理员'
        }, {
            group: 'test'
        }];

    @Moon('auth-orm')
    ins_orm = orm;

    @Moon('auth-def-group')
    defaultGroup: string = 'guest';
}

Mo
    .create(TestInstance)
    .then(value => value.startSever());

