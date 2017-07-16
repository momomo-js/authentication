import {AllowNull, BelongsTo, Column, Default, ForeignKey, Model, Table, Unique} from "sequelize-typescript";
import {UserGroup} from "./user-group";

@Table
export class User extends Model<User> {

    @Unique
    @AllowNull(false)
    @Column
    username: string;

    @AllowNull(false)
    @Column
    password: string;

    @AllowNull(false)
    @Default(true)
    @Column
    state: boolean;

    @ForeignKey(() => UserGroup)
    groupId: number;

    @BelongsTo(() => UserGroup)
    group: UserGroup;
}


/**
 * Created by yskun on 2017/7/13.
 */
