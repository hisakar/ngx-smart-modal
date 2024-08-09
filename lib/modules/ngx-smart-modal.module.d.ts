import { ModuleWithProviders } from '@angular/core';
import { NgxSmartModalService } from '../services/ngx-smart-modal.service';
import * as i0 from "@angular/core";
import * as i1 from "../components/ngx-smart-modal.component";
import * as i2 from "@angular/common";
export declare class NgxSmartModalModule {
    service: NgxSmartModalService;
    /**
     * Use in AppModule: new instance of NgxSmartModal.
     */
    static forRoot(): ModuleWithProviders<NgxSmartModalModule>;
    /**
     * Use in features modules with lazy loading: new instance of NgxSmartModal.
     */
    static forChild(): ModuleWithProviders<NgxSmartModalModule>;
    constructor(service: NgxSmartModalService);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxSmartModalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxSmartModalModule, [typeof i1.NgxSmartModalComponent], [typeof i2.CommonModule], [typeof i1.NgxSmartModalComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxSmartModalModule>;
}
