import {Authentication} from "../src/bin/authentication";
import {Sequelize} from "sequelize-typescript";

import {ExpressDefaultPluginPackage} from '@mo/express-default-module'
import {MoServer,co} from "@mo/core";
import {ExpressServer} from '@mo/express'

let orm: Sequelize = new Sequelize({
    name: 'db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: 'test.db'
});

co(function *() {

    let u = new Authentication({
        group: [{
            group: 'guest',
            description: '访客'
        }, {
            group: 'admin',
            description: '管理员'
        }, {
            group: 'test'
        }]
    });
    u.defaultGroup = 'guest';
    yield u.setOrm(orm);

    let server = new MoServer();
    let express = new ExpressServer();
    server.addServer(express);
    express.addPlugin(new ExpressDefaultPluginPackage());
    server.addModule(u);
    server.startSever();
});

