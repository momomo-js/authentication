import "reflect-metadata";
import {Inject, Injectable, InjectionToken, ReflectiveInjector} from "injection-js";
import {UserService} from "../src/service/user.service";

export class AppConfig {
    apiEndpoint: string;
    title: string;
    injector:ReflectiveInjector;
    constructor(u)
    {

    }
    test() {
        this.injector = ReflectiveInjector.resolveAndCreate([{ provide: UserService, useValue: this }]);
        let child = ReflectiveInjector.resolveAndCreate([UserService],this.injector);
        child.get(UserService);
    }
}



export const HERO_DI_CONFIG: AppConfig = new AppConfig(1);
HERO_DI_CONFIG.title = 'Dependency Injection';
HERO_DI_CONFIG.apiEndpoint=  'api.heroes.com';


export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

class Q {
    constructor(@Inject(AppConfig) config: AppConfig) {
        console.log(config.title);
    }

}



HERO_DI_CONFIG.test();

/**
 * Created by yskun on 2017/7/16.
 */
