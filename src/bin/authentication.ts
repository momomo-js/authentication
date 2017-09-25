import {Sequelize} from "sequelize-typescript";
import {User} from "../model/user";
import {UserGroup} from "../model/user-group";
import {AuthenticationSystem} from "../model/authentication-system";
import {IUserGroup} from "../define/user-group.interface";
import {Injectable} from "injection-js";
import {MoBasic, Moon, MoonOption, OnInit} from "@mo/core";

@Injectable()
export class Authentication extends MoBasic implements OnInit{

    //属性设置
    //密码盐设置
    @Moon('auth-salt')
    public salt: string = 'sadfafdfkdhfdhfdafhkdbdskboeu';

    @Moon('auth-def-group')
    defaultGroup: string = 'default';

    @MoonOption('auth-group')
    public group: IUserGroup[] = null;

    //constructor
    constructor() {
        super();

    }

    @MoonOption('auth-orm')
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
            await new AuthenticationSystem({
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

    }

}

/**
 * Created by yskun on 2017/7/13.
 */
