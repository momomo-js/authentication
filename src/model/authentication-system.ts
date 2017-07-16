import {AllowNull, Column, Model, Table, Unique} from "sequelize-typescript";
@Table
export class AuthenticationSystem extends Model<AuthenticationSystem> {

    @Unique
    @AllowNull(false)
    @Column
    prop: string;

    @AllowNull(false)
    @Column
    code: string;

}

/**
 * Created by yskun on 2017/7/14.
 */
