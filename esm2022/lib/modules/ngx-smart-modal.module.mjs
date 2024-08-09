import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSmartModalComponent } from '../components/ngx-smart-modal.component';
import { NgxSmartModalService } from '../services/ngx-smart-modal.service';
import { NgxSmartModalStackService } from '../services/ngx-smart-modal-stack.service';
import * as i0 from "@angular/core";
import * as i1 from "../services/ngx-smart-modal.service";
export class NgxSmartModalModule {
    /**
     * Use in AppModule: new instance of NgxSmartModal.
     */
    static forRoot() {
        return {
            ngModule: NgxSmartModalModule,
            providers: [
                NgxSmartModalService,
                NgxSmartModalStackService
            ]
        };
    }
    /**
     * Use in features modules with lazy loading: new instance of NgxSmartModal.
     */
    static forChild() {
        return {
            ngModule: NgxSmartModalModule,
            providers: [
                NgxSmartModalService,
                NgxSmartModalStackService
            ]
        };
    }
    constructor(service) {
        this.service = service;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalModule, deps: [{ token: i1.NgxSmartModalService }], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalModule, declarations: [NgxSmartModalComponent], imports: [CommonModule], exports: [NgxSmartModalComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxSmartModalComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        NgxSmartModalComponent
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i1.NgxSmartModalService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1zbWFydC1tb2RhbC9zcmMvbGliL21vZHVsZXMvbmd4LXNtYXJ0LW1vZGFsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7OztBQWF0RixNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU87UUFDbkIsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULG9CQUFvQjtnQkFDcEIseUJBQXlCO2FBQzFCO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRO1FBQ3BCLE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxvQkFBb0I7Z0JBQ3BCLHlCQUF5QjthQUMxQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsWUFBbUIsT0FBNkI7UUFBN0IsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7SUFBSSxDQUFDOytHQTNCMUMsbUJBQW1CO2dIQUFuQixtQkFBbUIsaUJBVDVCLHNCQUFzQixhQUd0QixZQUFZLGFBR1osc0JBQXNCO2dIQUdiLG1CQUFtQixZQU41QixZQUFZOzs0RkFNSCxtQkFBbUI7a0JBWC9CLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLHNCQUFzQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLHNCQUFzQjtxQkFDdkI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgTmd4U21hcnRNb2RhbENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvbmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hTbWFydE1vZGFsU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25neC1zbWFydC1tb2RhbC5zZXJ2aWNlJztcbmltcG9ydCB7IE5neFNtYXJ0TW9kYWxTdGFja1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9uZ3gtc21hcnQtbW9kYWwtc3RhY2suc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE5neFNtYXJ0TW9kYWxDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTmd4U21hcnRNb2RhbENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neFNtYXJ0TW9kYWxNb2R1bGUge1xuICAvKipcbiAgICogVXNlIGluIEFwcE1vZHVsZTogbmV3IGluc3RhbmNlIG9mIE5neFNtYXJ0TW9kYWwuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxOZ3hTbWFydE1vZGFsTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ3hTbWFydE1vZGFsTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxuICAgICAgICBOZ3hTbWFydE1vZGFsU3RhY2tTZXJ2aWNlXG4gICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgaW4gZmVhdHVyZXMgbW9kdWxlcyB3aXRoIGxhenkgbG9hZGluZzogbmV3IGluc3RhbmNlIG9mIE5neFNtYXJ0TW9kYWwuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvckNoaWxkKCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4U21hcnRNb2RhbE1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4U21hcnRNb2RhbE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBOZ3hTbWFydE1vZGFsU2VydmljZSxcbiAgICAgICAgTmd4U21hcnRNb2RhbFN0YWNrU2VydmljZVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UpIHsgfVxufVxuIl19