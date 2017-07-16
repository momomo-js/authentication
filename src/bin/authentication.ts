import {Sequelize} from "sequelize-typescript";
import {User} from "../model/user";
import {UserGroup} from "../model/user-group";
import {co, Module, RouterManager} from "@mo/core";
import {AuthenticationSystem} from "../model/authentication-system";
import {IAuthenticationOptions} from "../define/authentication-options.interface";
import {IUserGroup} from "../define/user-group.interface";
import {PluginPackage} from "../method/plugin-package";
import {UserRouter} from "../controller/user.router";
import {AuthenticationToken} from "../decoractor/symbol";

export class Authentication extends Module {

    //属性设置
    //密码盐设置
    public salt: string = 'sadfafdfkdhfdhfdafhkdbdskboeu';

    public defaultGroup: string = 'default';

    public group: IUserGroup[] = null;


//constructor
    constructor(options: IAuthenticationOptions) {
        super();
        if (options) {
            if (options.group) {
                this.group = options.group;
                this.group.unshift({
                    group: 'default',
                    description: 'default group'
                })
            }
        }
    }

    orm: Sequelize = null;

    setOrm(orm: Sequelize): Promise<any> {
        let p = this;
        this.orm = orm;
        return co(function *() {
            orm.addModels([AuthenticationSystem, UserGroup, User]);
            yield orm.sync();

            let state: AuthenticationSystem = yield AuthenticationSystem.find({
                where: {
                    prop: 'initState'
                }
            });

            if (!state || state.code === 'false') {
                let initState = new AuthenticationSystem({
                    prop: 'initState',
                    code: 'true'
                }).save();

                p.setGroup();
            }
        });
    }

    private setGroup() {
        let p = this;
        co(function *() {
            for (let g of p.group) {
                yield new UserGroup(g).save();
            }
        });

    }

    private _routerManager: RouterManager;

    init(): void {
        this._routerManager = this.moServer.routerManager;
        this._routerManager.addService([{provide: AuthenticationToken, useValue: this}]);

        this.moServer._injector.resolveAndInstantiate({
            provide: AuthenticationToken,
            useValue: this
        });

        this.moServer.addPlugin([PluginPackage]);

        this.moServer.routerManager.addRouter([UserRouter]);
    }

    start(): void {
    }

}

/**
 * Created by yskun on 2017/7/13.
 */
