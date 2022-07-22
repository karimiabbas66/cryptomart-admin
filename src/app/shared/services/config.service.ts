import {Injectable} from '@angular/core';
import {TemplateConfig} from '../template-config/config.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public templateConf: TemplateConfig;

    constructor() {
        this.setConfigValue();
    }

    setConfigValue() {
        this.templateConf = {
            layout: {
                variant: 'Light',
                dir: 'rtl',
                customizer: {
                    hidden: true
                },
                sidebar: {
                    collapsed: false,
                    size: 'sidebar-md',
                    backgroundColor: 'man-of-steel',
                    backgroundImage: true,
                    backgroundImageURL: 'assets/img/sidebar-bg/01.jpg'
                }
            }
        };
    }
}
