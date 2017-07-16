import {AutoIncrement, Column, Model, PrimaryKey, Table, Unique} from "sequelize-typescript";

@Table
export class UserGroup extends Model<UserGroup> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Unique
    @Column
    group: string;

    @Column
    description: string;
}


/**
 * Created by yskun on 2017/7/13.
 */
