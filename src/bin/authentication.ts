import {Sequelize} from "sequelize-typescript";
import {User} from "../model/user";
import {UserGroup} from "../model/user-group";
import {Component, Input, Option, RouterManager} from "@mo/core";
import {AuthenticationSystem} from "../model/authentication-system";
import {IAuthenticationOptions} from "../define/authentication-options.interface";
import {IUserGroup} from "../define/user-group.interface";
import {AuthenticationToken} from "../decoractor/symbol";
import {Injectable} from "injection-js";

@Injectable()
export class Authentication extends Component {

    //属性设置
    //密码盐设置
    @Option('auth-salt')
    public salt: string = 'sadfafdfkdhfdhfdafhkdbdskboeu';

    @Option('auth-def-group')
    defaultGroup: string = 'default';

    @Input('auth-group')
    public group: IUserGroup[] = null;

    //constructor
    constructor(private routerManager: RouterManager) {
        super();

    }

    @Input('auth-orm')
    orm: Sequelize = null;

    async setOrm(): Promise<any> {
        let orm = this.orm;
        orm.addModels([AuthenticationSystem, UserGroup, User]);
        await orm.sync();

        const state: AuthenticationSystem = <AuthenticationSystem> await AuthenticationSystem.find({
            where: {
                prop: 'initState'
            }
        });

        if (!state || state.code === 'false') {
            let initState = new AuthenticationSystem({
                prop: 'initState',
                code: 'true'
            }).save();

            await this.setGroup();
        }
    }

    private async setGroup() {
        for (let g of this.group) {
            await new UserGroup(g).save();
        }
    }

    async onInit() {
        if (!this.group) {
            throw new Error('no auth-option');
        }

        if (this.orm) {
            await this.setOrm();
        } else {
            throw new Error('no auth-orm');
        }

        this.routerManager.addService([{provide: AuthenticationToken, useValue: this}]);
    }

    onStart(): void {
    }

    onStop(): void {
    }
}

/**
 * Created by yskun on 2017/7/13.
 */
