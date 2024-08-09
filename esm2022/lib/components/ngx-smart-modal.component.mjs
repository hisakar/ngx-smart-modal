import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, PLATFORM_ID, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { NgxSmartModalConfig } from '../config/ngx-smart-modal.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgxSmartModalComponent {
    constructor(_renderer, _changeDetectorRef, _viewContainerRef, elementRef, _document, _platformId) {
        this._renderer = _renderer;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewContainerRef = _viewContainerRef;
        this.elementRef = elementRef;
        this._document = _document;
        this._platformId = _platformId;
        this.closable = true;
        this.escapable = true;
        this.dismissable = true;
        this.identifier = '';
        this.customClass = 'nsm-dialog-animation-fade';
        this.visible = false;
        this.backdrop = true;
        this.force = true;
        this.hideDelay = 500;
        this.autostart = false;
        this.target = '';
        this.ariaLabel = null;
        this.ariaLabelledBy = null;
        this.ariaDescribedBy = null;
        this.refocus = true;
        this.visibleChange = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onCloseFinished = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onDismissFinished = new EventEmitter();
        this.onAnyCloseEvent = new EventEmitter();
        this.onAnyCloseEventFinished = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.onOpenFinished = new EventEmitter();
        this.onEscape = new EventEmitter();
        this.onDataAdded = new EventEmitter();
        this.onDataRemoved = new EventEmitter();
        this.layerPosition = 1041;
        this.overlayVisible = false;
        this.openedClass = false;
        this.createFrom = 'html';
    }
    ngOnInit() {
        if (!this.identifier || !this.identifier.length) {
            throw new Error('identifier field isn’t set. Please set one before calling <ngx-smart-modal> in a template.');
        }
        this._sendEvent('create');
    }
    ngAfterViewChecked() {
        if (this.overlayVisible &&
            this.contentComponent &&
            this.dynamicContentContainer &&
            this.dynamicContentContainer.length === 0) {
            this.createDynamicContent();
        }
    }
    ngOnDestroy() {
        this._sendEvent('delete');
    }
    /**
     * Open the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    open(top) {
        this._sendEvent('open', { top: top });
        return this;
    }
    /**
     * Close the modal instance
     *
     * @returns the modal component
     */
    close() {
        this._sendEvent('close');
        return this;
    }
    /**
     * Dismiss the modal instance
     *
     * @param e the event sent by the browser
     * @returns the modal component
     */
    dismiss(e) {
        if (!this.dismissable || !e?.target?.classList.contains('overlay')) {
            return this;
        }
        this._sendEvent('dismiss');
        return this;
    }
    /**
     * Toggle visibility of the modal instance
     *
     * @param top open the modal top of all other
     * @returns the modal component
     */
    toggle(top) {
        this._sendEvent('toggle', { top: top });
        return this;
    }
    /**
     * Add a custom class to the modal instance
     *
     * @param className the class to add
     * @returns the modal component
     */
    addCustomClass(className) {
        if (!this.customClass.length) {
            this.customClass = className;
        }
        else {
            this.customClass += ' ' + className;
        }
        return this;
    }
    /**
     * Remove a custom class to the modal instance
     *
     * @param className the class to remove
     * @returns the modal component
     */
    removeCustomClass(className) {
        if (className) {
            this.customClass = this.customClass.replace(className, '').trim();
        }
        else {
            this.customClass = '';
        }
        return this;
    }
    /**
     * Returns the visibility state of the modal instance
     */
    isVisible() {
        return this.visible;
    }
    /**
     * Checks if data is attached to the modal instance
     */
    hasData() {
        return this._data !== undefined;
    }
    /**
     * Attach data to the modal instance
     *
     * @param data the data to attach
     * @param force override potentially attached data
     * @returns the modal component
     */
    setData(data, force) {
        if (!this.hasData() || (this.hasData() && force)) {
            this._data = data;
            this.assignModalDataToComponentData(this._componentRef);
            this.onDataAdded.emit(this._data);
            this.markForCheck();
        }
        return this;
    }
    /**
     * Retrieve the data attached to the modal instance
     */
    getData() {
        this.assignComponentDataToModalData(this._componentRef);
        return this._data;
    }
    /**
     * Remove the data attached to the modal instance
     *
     * @returns the modal component
     */
    removeData() {
        this._data = undefined;
        this.onDataRemoved.emit(true);
        this.markForCheck();
        return this;
    }
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    addBodyClass() {
        this._renderer.addClass(this._document.body, NgxSmartModalConfig.bodyClassOpen);
        return this;
    }
    /**
     * Add body class modal opened
     *
     * @returns the modal component
     */
    removeBodyClass() {
        this._renderer.removeClass(this._document.body, NgxSmartModalConfig.bodyClassOpen);
        return this;
    }
    markForCheck() {
        try {
            this._changeDetectorRef.detectChanges();
        }
        catch (e) { /* empty */ }
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Listens for window resize event and recalculates modal instance position if it is element-relative
     */
    targetPlacement() {
        if (!this.isBrowser || !this.nsmDialog.length || !this.nsmContent.length || !this.nsmOverlay.length || !this.target) {
            return false;
        }
        const targetElement = this._document.querySelector(this.target);
        if (!targetElement) {
            return false;
        }
        const targetElementRect = targetElement.getBoundingClientRect();
        const bodyRect = this.nsmOverlay.first.nativeElement.getBoundingClientRect();
        const nsmContentRect = this.nsmContent.first.nativeElement.getBoundingClientRect();
        const nsmDialogRect = this.nsmDialog.first.nativeElement.getBoundingClientRect();
        const marginLeft = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginLeft, 10);
        const marginTop = parseInt(getComputedStyle(this.nsmContent.first.nativeElement).marginTop, 10);
        let offsetTop = targetElementRect.top - nsmDialogRect.top - ((nsmContentRect.height - targetElementRect.height) / 2);
        let offsetLeft = targetElementRect.left - nsmDialogRect.left - ((nsmContentRect.width - targetElementRect.width) / 2);
        if (offsetLeft + nsmDialogRect.left + nsmContentRect.width + (marginLeft * 2) > bodyRect.width) {
            offsetLeft = bodyRect.width - (nsmDialogRect.left + nsmContentRect.width) - (marginLeft * 2);
        }
        else if (offsetLeft + nsmDialogRect.left < 0) {
            offsetLeft = -nsmDialogRect.left;
        }
        if (offsetTop + nsmDialogRect.top + nsmContentRect.height + marginTop > bodyRect.height) {
            offsetTop = bodyRect.height - (nsmDialogRect.top + nsmContentRect.height) - marginTop;
        }
        this._renderer.setStyle(this.nsmContent.first.nativeElement, 'top', (offsetTop < 0 ? 0 : offsetTop) + 'px');
        this._renderer.setStyle(this.nsmContent.first.nativeElement, 'left', offsetLeft + 'px');
    }
    _sendEvent(name, extraData) {
        if (!this.isBrowser) {
            return false;
        }
        const data = {
            extraData: extraData,
            instance: { id: this.identifier, modal: this }
        };
        const event = new CustomEvent(NgxSmartModalConfig.prefixEvent + name, { detail: data });
        return window.dispatchEvent(event);
    }
    /**
     * Is current platform browser
     */
    get isBrowser() {
        return isPlatformBrowser(this._platformId);
    }
    /**
     * Creates content inside provided ViewContainerRef
     */
    createDynamicContent() {
        this.dynamicContentContainer.clear();
        this._componentRef = this.dynamicContentContainer.createComponent(this.contentComponent);
        this.assignModalDataToComponentData(this._componentRef);
        this.markForCheck();
    }
    /**
     * Assigns the modal data to the ComponentRef instance properties
     */
    assignModalDataToComponentData(componentRef) {
        if (componentRef) {
            Object.assign(componentRef.instance, this._data);
        }
    }
    /**
     * Assigns the ComponentRef instance properties to the modal data object
     */
    assignComponentDataToModalData(componentRef) {
        if (componentRef) {
            Object.assign(this._data, componentRef.instance);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalComponent, deps: [{ token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.10", type: NgxSmartModalComponent, selector: "ngx-smart-modal", inputs: { closable: "closable", escapable: "escapable", dismissable: "dismissable", identifier: "identifier", customClass: "customClass", visible: "visible", backdrop: "backdrop", force: "force", hideDelay: "hideDelay", autostart: "autostart", target: "target", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", refocus: "refocus" }, outputs: { visibleChange: "visibleChange", onClose: "onClose", onCloseFinished: "onCloseFinished", onDismiss: "onDismiss", onDismissFinished: "onDismissFinished", onAnyCloseEvent: "onAnyCloseEvent", onAnyCloseEventFinished: "onAnyCloseEventFinished", onOpen: "onOpen", onOpenFinished: "onOpenFinished", onEscape: "onEscape", onDataAdded: "onDataAdded", onDataRemoved: "onDataRemoved" }, host: { listeners: { "window:resize": "targetPlacement()" } }, viewQueries: [{ propertyName: "dynamicContentContainer", first: true, predicate: ["dynamicContent"], descendants: true, read: ViewContainerRef }, { propertyName: "nsmContent", predicate: ["nsmContent"], descendants: true }, { propertyName: "nsmDialog", predicate: ["nsmDialog"], descendants: true }, { propertyName: "nsmOverlay", predicate: ["nsmOverlay"], descendants: true }], ngImport: i0, template: `
  <div *ngIf="overlayVisible"
       [style.z-index]="visible ? layerPosition-1 : -1"
       [ngClass]="{'transparent':!backdrop, 'overlay':true, 'nsm-overlay-open':openedClass}"
       (click)="dismiss($event)" #nsmOverlay>
    <div [style.z-index]="visible ? layerPosition : -1"
         [ngClass]="['nsm-dialog', customClass, openedClass ? 'nsm-dialog-open': 'nsm-dialog-close']" #nsmDialog
         [attr.aria-hidden]="openedClass ? false : true"
         [attr.aria-label]="ariaLabel"
         [attr.aria-labelledby]="ariaLabelledBy"
         [attr.aria-describedby]="ariaDescribedBy">
      <div class="nsm-content" #nsmContent>
        <div class="nsm-body">
          <ng-template #dynamicContent></ng-template>
          <ng-content></ng-content>
        </div>
        <button type="button" *ngIf="closable" (click)="close()" aria-label="Close" class="nsm-dialog-btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"
               xml:space="preserve" width="16px" height="16px" role="img" aria-labelledby="closeIconTitle closeIconDesc">
            <title id="closeIconTitle">Close Icon</title>
            <desc id="closeIconDesc">A light-gray close icon used to close the modal</desc>
            <g>
              <path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249    C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306    C514.019,27.23,514.019,14.135,505.943,6.058z"
                    fill="currentColor"/>
            </g>
            <g>
              <path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636    c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"
                    fill="currentColor"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
`, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-smart-modal', template: `
  <div *ngIf="overlayVisible"
       [style.z-index]="visible ? layerPosition-1 : -1"
       [ngClass]="{'transparent':!backdrop, 'overlay':true, 'nsm-overlay-open':openedClass}"
       (click)="dismiss($event)" #nsmOverlay>
    <div [style.z-index]="visible ? layerPosition : -1"
         [ngClass]="['nsm-dialog', customClass, openedClass ? 'nsm-dialog-open': 'nsm-dialog-close']" #nsmDialog
         [attr.aria-hidden]="openedClass ? false : true"
         [attr.aria-label]="ariaLabel"
         [attr.aria-labelledby]="ariaLabelledBy"
         [attr.aria-describedby]="ariaDescribedBy">
      <div class="nsm-content" #nsmContent>
        <div class="nsm-body">
          <ng-template #dynamicContent></ng-template>
          <ng-content></ng-content>
        </div>
        <button type="button" *ngIf="closable" (click)="close()" aria-label="Close" class="nsm-dialog-btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"
               xml:space="preserve" width="16px" height="16px" role="img" aria-labelledby="closeIconTitle closeIconDesc">
            <title id="closeIconTitle">Close Icon</title>
            <desc id="closeIconDesc">A light-gray close icon used to close the modal</desc>
            <g>
              <path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249    C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306    C514.019,27.23,514.019,14.135,505.943,6.058z"
                    fill="currentColor"/>
            </g>
            <g>
              <path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636    c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"
                    fill="currentColor"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
` }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { closable: [{
                type: Input
            }], escapable: [{
                type: Input
            }], dismissable: [{
                type: Input
            }], identifier: [{
                type: Input
            }], customClass: [{
                type: Input
            }], visible: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], force: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], autostart: [{
                type: Input
            }], target: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], refocus: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onClose: [{
                type: Output
            }], onCloseFinished: [{
                type: Output
            }], onDismiss: [{
                type: Output
            }], onDismissFinished: [{
                type: Output
            }], onAnyCloseEvent: [{
                type: Output
            }], onAnyCloseEventFinished: [{
                type: Output
            }], onOpen: [{
                type: Output
            }], onOpenFinished: [{
                type: Output
            }], onEscape: [{
                type: Output
            }], onDataAdded: [{
                type: Output
            }], onDataRemoved: [{
                type: Output
            }], nsmContent: [{
                type: ViewChildren,
                args: ['nsmContent']
            }], nsmDialog: [{
                type: ViewChildren,
                args: ['nsmDialog']
            }], nsmOverlay: [{
                type: ViewChildren,
                args: ['nsmOverlay']
            }], dynamicContentContainer: [{
                type: ViewChild,
                args: ['dynamicContent', { read: ViewContainerRef }]
            }], targetPlacement: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1zbWFydC1tb2RhbC9zcmMvbGliL2NvbXBvbmVudHMvbmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUQsT0FBTyxFQUdMLFNBQVMsRUFHVCxZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUNOLFdBQVcsRUFJWCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGdCQUFnQixFQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBMEN2RSxNQUFNLE9BQU8sc0JBQXNCO0lBOENqQyxZQUNVLFNBQW9CLEVBQ3BCLGtCQUFxQyxFQUNyQyxpQkFBbUMsRUFDM0IsVUFBc0IsRUFDWixTQUFtQixFQUNoQixXQUFtQjtRQUx4QyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUMzQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ1osY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQWxEbEMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsZ0JBQVcsR0FBRywyQkFBMkIsQ0FBQztRQUMxQyxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsVUFBSyxHQUFH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VSxXQUFXO3NCQUEzQixNQUFNO2dCQUNVLGFBQWE7c0JBQTdCLE1BQU07Z0JBWTZCLFVBQVU7c0JBQTdDLFlBQVk7dUJBQUMsWUFBWTtnQkFDUSxTQUFTO3NCQUExQyxZQUFZO3VCQUFDLFdBQVc7Z0JBQ1csVUFBVTtzQkFBN0MsWUFBWTt1QkFBQyxZQUFZO2dCQUN1Qyx1QkFBdUI7c0JBQXZGLFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBNE1oRCxlQUFlO3NCQURyQixZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxuICBUeXBlLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neFNtYXJ0TW9kYWxDb25maWcgfSBmcm9tICcuLi9jb25maWcvbmd4LXNtYXJ0LW1vZGFsLmNvbmZpZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1zbWFydC1tb2RhbCcsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgKm5nSWY9XCJvdmVybGF5VmlzaWJsZVwiXG4gICAgICAgW3N0eWxlLnotaW5kZXhdPVwidmlzaWJsZSA/IGxheWVyUG9zaXRpb24tMSA6IC0xXCJcbiAgICAgICBbbmdDbGFzc109XCJ7J3RyYW5zcGFyZW50JzohYmFja2Ryb3AsICdvdmVybGF5Jzp0cnVlLCAnbnNtLW92ZXJsYXktb3Blbic6b3BlbmVkQ2xhc3N9XCJcbiAgICAgICAoY2xpY2spPVwiZGlzbWlzcygkZXZlbnQpXCIgI25zbU92ZXJsYXk+XG4gICAgPGRpdiBbc3R5bGUuei1pbmRleF09XCJ2aXNpYmxlID8gbGF5ZXJQb3NpdGlvbiA6IC0xXCJcbiAgICAgICAgIFtuZ0NsYXNzXT1cIlsnbnNtLWRpYWxvZycsIGN1c3RvbUNsYXNzLCBvcGVuZWRDbGFzcyA/ICduc20tZGlhbG9nLW9wZW4nOiAnbnNtLWRpYWxvZy1jbG9zZSddXCIgI25zbURpYWxvZ1xuICAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwib3BlbmVkQ2xhc3MgPyBmYWxzZSA6IHRydWVcIlxuICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiYXJpYURlc2NyaWJlZEJ5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibnNtLWNvbnRlbnRcIiAjbnNtQ29udGVudD5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5zbS1ib2R5XCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNkeW5hbWljQ29udGVudD48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiICpuZ0lmPVwiY2xvc2FibGVcIiAoY2xpY2spPVwiY2xvc2UoKVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiIGNsYXNzPVwibnNtLWRpYWxvZy1idG4tY2xvc2VcIj5cbiAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIlxuICAgICAgICAgICAgICAgeG1sOnNwYWNlPVwicHJlc2VydmVcIiB3aWR0aD1cIjE2cHhcIiBoZWlnaHQ9XCIxNnB4XCIgcm9sZT1cImltZ1wiIGFyaWEtbGFiZWxsZWRieT1cImNsb3NlSWNvblRpdGxlIGNsb3NlSWNvbkRlc2NcIj5cbiAgICAgICAgICAgIDx0aXRsZSBpZD1cImNsb3NlSWNvblRpdGxlXCI+Q2xvc2UgSWNvbjwvdGl0bGU+XG4gICAgICAgICAgICA8ZGVzYyBpZD1cImNsb3NlSWNvbkRlc2NcIj5BIGxpZ2h0LWdyYXkgY2xvc2UgaWNvbiB1c2VkIHRvIGNsb3NlIHRoZSBtb2RhbDwvZGVzYz5cbiAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDkgICAgQzEwLjA5Niw1MDkuOTgyLDE1LjM5LDUxMiwyMC42ODMsNTEyYzUuMjkzLDAsMTAuNTg2LTIuMDE5LDE0LjYyNS02LjA1OUw1MDUuOTQzLDM1LjMwNiAgICBDNTE0LjAxOSwyNy4yMyw1MTQuMDE5LDE0LjEzNSw1MDUuOTQzLDYuMDU4elwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIi8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk01MDUuOTQyLDQ3Ni42OTRMMzUuMzA2LDYuMDU5Yy04LjA3Ni04LjA3Ny0yMS4xNzItOC4wNzctMjkuMjQ4LDBjLTguMDc3LDguMDc2LTguMDc3LDIxLjE3MSwwLDI5LjI0OGw0NzAuNjM2LDQ3MC42MzYgICAgYzQuMDM4LDQuMDM5LDkuMzMyLDYuMDU4LDE0LjYyNSw2LjA1OGM1LjI5MywwLDEwLjU4Ny0yLjAxOSwxNC42MjQtNi4wNTdDNTE0LjAxOCw0OTcuODY2LDUxNC4wMTgsNDg0Ljc3MSw1MDUuOTQyLDQ3Ni42OTR6XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiLz5cbiAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gLFxuICBzdHlsZXM6IFtcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0NoZWNrZWQge1xuXG4gIEBJbnB1dCgpIHB1YmxpYyBjbG9zYWJsZSA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBlc2NhcGFibGUgPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgZGlzbWlzc2FibGUgPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgaWRlbnRpZmllciA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY3VzdG9tQ2xhc3MgPSAnbnNtLWRpYWxvZy1hbmltYXRpb24tZmFkZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyB2aXNpYmxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBiYWNrZHJvcCA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBmb3JjZSA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRlRGVsYXkgPSA1MDA7XG4gIEBJbnB1dCgpIHB1YmxpYyBhdXRvc3RhcnQgPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHRhcmdldCA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcHVibGljIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcHVibGljIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHB1YmxpYyByZWZvY3VzID0gdHJ1ZTtcblxuICBAT3V0cHV0KCkgcHVibGljIHZpc2libGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkNsb3NlRmluaXNoZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uRGlzbWlzczogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25EaXNtaXNzRmluaXNoZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uQW55Q2xvc2VFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25BbnlDbG9zZUV2ZW50RmluaXNoZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uT3BlbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25PcGVuRmluaXNoZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIG9uRXNjYXBlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHB1YmxpYyBvbkRhdGFBZGRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgb25EYXRhUmVtb3ZlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGNvbnRlbnRDb21wb25lbnQhOiBUeXBlPGFueT47XG4gIHB1YmxpYyBsYXllclBvc2l0aW9uID0gMTA0MTtcbiAgcHVibGljIG92ZXJsYXlWaXNpYmxlID0gZmFsc2U7XG4gIHB1YmxpYyBvcGVuZWRDbGFzcyA9IGZhbHNlO1xuXG4gIHB1YmxpYyBjcmVhdGVGcm9tID0gJ2h0bWwnO1xuXG4gIHByaXZhdGUgX2RhdGE6IGFueTtcbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmITogQ29tcG9uZW50UmVmPENvbXBvbmVudD47XG5cbiAgQFZpZXdDaGlsZHJlbignbnNtQ29udGVudCcpIHByaXZhdGUgbnNtQ29udGVudCE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZHJlbignbnNtRGlhbG9nJykgcHVibGljIG5zbURpYWxvZyE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZHJlbignbnNtT3ZlcmxheScpIHByaXZhdGUgbnNtT3ZlcmxheSE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZCgnZHluYW1pY0NvbnRlbnQnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgcHJpdmF0ZSBkeW5hbWljQ29udGVudENvbnRhaW5lciE6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZDogb2JqZWN0LFxuICApIHsgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaWRlbnRpZmllciB8fCAhdGhpcy5pZGVudGlmaWVyLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpZGVudGlmaWVyIGZpZWxkIGlzbuKAmXQgc2V0LiBQbGVhc2Ugc2V0IG9uZSBiZWZvcmUgY2FsbGluZyA8bmd4LXNtYXJ0LW1vZGFsPiBpbiBhIHRlbXBsYXRlLicpO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRFdmVudCgnY3JlYXRlJyk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMub3ZlcmxheVZpc2libGUgJiZcbiAgICAgIHRoaXMuY29udGVudENvbXBvbmVudCAmJlxuICAgICAgdGhpcy5keW5hbWljQ29udGVudENvbnRhaW5lciAmJlxuICAgICAgdGhpcy5keW5hbWljQ29udGVudENvbnRhaW5lci5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHRoaXMuY3JlYXRlRHluYW1pY0NvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VuZEV2ZW50KCdkZWxldGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gdG9wIG9wZW4gdGhlIG1vZGFsIHRvcCBvZiBhbGwgb3RoZXJcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIG9wZW4odG9wPzogYm9vbGVhbik6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHRoaXMuX3NlbmRFdmVudCgnb3BlbicsIHsgdG9wOiB0b3AgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIGNsb3NlKCk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHRoaXMuX3NlbmRFdmVudCgnY2xvc2UnKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3MgdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBlIHRoZSBldmVudCBzZW50IGJ5IHRoZSBicm93c2VyXG4gICAqIEByZXR1cm5zIHRoZSBtb2RhbCBjb21wb25lbnRcbiAgICovXG4gIHB1YmxpYyBkaXNtaXNzKGU6IE1vdXNlRXZlbnQpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICBpZiAoIXRoaXMuZGlzbWlzc2FibGUgfHwgIShlPy50YXJnZXQgYXMgRWxlbWVudCk/LmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmxheScpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9zZW5kRXZlbnQoJ2Rpc21pc3MnKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB2aXNpYmlsaXR5IG9mIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gdG9wIG9wZW4gdGhlIG1vZGFsIHRvcCBvZiBhbGwgb3RoZXJcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIHRvZ2dsZSh0b3A/OiBib29sZWFuKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fc2VuZEV2ZW50KCd0b2dnbGUnLCB7IHRvcDogdG9wIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY3VzdG9tIGNsYXNzIHRvIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyB0byBhZGRcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIGFkZEN1c3RvbUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgaWYgKCF0aGlzLmN1c3RvbUNsYXNzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jdXN0b21DbGFzcyA9IGNsYXNzTmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXN0b21DbGFzcyArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY3VzdG9tIGNsYXNzIHRvIHRoZSBtb2RhbCBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NOYW1lIHRoZSBjbGFzcyB0byByZW1vdmVcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIHJlbW92ZUN1c3RvbUNsYXNzKGNsYXNzTmFtZT86IHN0cmluZyk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgIHRoaXMuY3VzdG9tQ2xhc3MgPSB0aGlzLmN1c3RvbUNsYXNzLnJlcGxhY2UoY2xhc3NOYW1lLCAnJykudHJpbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1c3RvbUNsYXNzID0gJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlzaWJpbGl0eSBzdGF0ZSBvZiB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBpc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgZGF0YSBpcyBhdHRhY2hlZCB0byB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBoYXNEYXRhKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kYXRhICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIGRhdGEgdG8gdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIHRvIGF0dGFjaFxuICAgKiBAcGFyYW0gZm9yY2Ugb3ZlcnJpZGUgcG90ZW50aWFsbHkgYXR0YWNoZWQgZGF0YVxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgc2V0RGF0YShkYXRhOiB1bmtub3duLCBmb3JjZT86IGJvb2xlYW4pOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICBpZiAoIXRoaXMuaGFzRGF0YSgpIHx8ICh0aGlzLmhhc0RhdGEoKSAmJiBmb3JjZSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5hc3NpZ25Nb2RhbERhdGFUb0NvbXBvbmVudERhdGEodGhpcy5fY29tcG9uZW50UmVmKTtcbiAgICAgIHRoaXMub25EYXRhQWRkZWQuZW1pdCh0aGlzLl9kYXRhKTtcbiAgICAgIHRoaXMubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGRhdGEgYXR0YWNoZWQgdG8gdGhlIG1vZGFsIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgZ2V0RGF0YSgpOiB1bmtub3duIHtcbiAgICB0aGlzLmFzc2lnbkNvbXBvbmVudERhdGFUb01vZGFsRGF0YSh0aGlzLl9jb21wb25lbnRSZWYpO1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZGF0YSBhdHRhY2hlZCB0byB0aGUgbW9kYWwgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybnMgdGhlIG1vZGFsIGNvbXBvbmVudFxuICAgKi9cbiAgcHVibGljIHJlbW92ZURhdGEoKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fZGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm9uRGF0YVJlbW92ZWQuZW1pdCh0cnVlKTtcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGJvZHkgY2xhc3MgbW9kYWwgb3BlbmVkXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBtb2RhbCBjb21wb25lbnRcbiAgICovXG4gIHB1YmxpYyBhZGRCb2R5Q2xhc3MoKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZG9jdW1lbnQuYm9keSwgTmd4U21hcnRNb2RhbENvbmZpZy5ib2R5Q2xhc3NPcGVuKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBib2R5IGNsYXNzIG1vZGFsIG9wZW5lZFxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbW9kYWwgY29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlQm9keUNsYXNzKCk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2RvY3VtZW50LmJvZHksIE5neFNtYXJ0TW9kYWxDb25maWcuYm9keUNsYXNzT3Blbik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBtYXJrRm9yQ2hlY2soKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgZm9yIHdpbmRvdyByZXNpemUgZXZlbnQgYW5kIHJlY2FsY3VsYXRlcyBtb2RhbCBpbnN0YW5jZSBwb3NpdGlvbiBpZiBpdCBpcyBlbGVtZW50LXJlbGF0aXZlXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgcHVibGljIHRhcmdldFBsYWNlbWVudCgpOiBib29sZWFuIHwgdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzQnJvd3NlciB8fCAhdGhpcy5uc21EaWFsb2cubGVuZ3RoIHx8ICF0aGlzLm5zbUNvbnRlbnQubGVuZ3RoIHx8ICF0aGlzLm5zbU92ZXJsYXkubGVuZ3RoIHx8ICF0aGlzLnRhcmdldCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnRhcmdldCk7XG5cbiAgICBpZiAoIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRFbGVtZW50UmVjdCA9IHRhcmdldEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgYm9keVJlY3QgPSB0aGlzLm5zbU92ZXJsYXkuZmlyc3QubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGNvbnN0IG5zbUNvbnRlbnRSZWN0ID0gdGhpcy5uc21Db250ZW50LmZpcnN0Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbnNtRGlhbG9nUmVjdCA9IHRoaXMubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBjb25zdCBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm5zbUNvbnRlbnQuZmlyc3QubmF0aXZlRWxlbWVudCkubWFyZ2luTGVmdCwgMTApO1xuICAgIGNvbnN0IG1hcmdpblRvcCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGhpcy5uc21Db250ZW50LmZpcnN0Lm5hdGl2ZUVsZW1lbnQpLm1hcmdpblRvcCwgMTApO1xuXG4gICAgbGV0IG9mZnNldFRvcCA9IHRhcmdldEVsZW1lbnRSZWN0LnRvcCAtIG5zbURpYWxvZ1JlY3QudG9wIC0gKChuc21Db250ZW50UmVjdC5oZWlnaHQgLSB0YXJnZXRFbGVtZW50UmVjdC5oZWlnaHQpIC8gMik7XG4gICAgbGV0IG9mZnNldExlZnQgPSB0YXJnZXRFbGVtZW50UmVjdC5sZWZ0IC0gbnNtRGlhbG9nUmVjdC5sZWZ0IC0gKChuc21Db250ZW50UmVjdC53aWR0aCAtIHRhcmdldEVsZW1lbnRSZWN0LndpZHRoKSAvIDIpO1xuXG4gICAgaWYgKG9mZnNldExlZnQgKyBuc21EaWFsb2dSZWN0LmxlZnQgKyBuc21Db250ZW50UmVjdC53aWR0aCArIChtYXJnaW5MZWZ0ICogMikgPiBib2R5UmVjdC53aWR0aCkge1xuICAgICAgb2Zmc2V0TGVmdCA9IGJvZHlSZWN0LndpZHRoIC0gKG5zbURpYWxvZ1JlY3QubGVmdCArIG5zbUNvbnRlbnRSZWN0LndpZHRoKSAtIChtYXJnaW5MZWZ0ICogMik7XG4gICAgfSBlbHNlIGlmIChvZmZzZXRMZWZ0ICsgbnNtRGlhbG9nUmVjdC5sZWZ0IDwgMCkge1xuICAgICAgb2Zmc2V0TGVmdCA9IC1uc21EaWFsb2dSZWN0LmxlZnQ7XG4gICAgfVxuXG4gICAgaWYgKG9mZnNldFRvcCArIG5zbURpYWxvZ1JlY3QudG9wICsgbnNtQ29udGVudFJlY3QuaGVpZ2h0ICsgbWFyZ2luVG9wID4gYm9keVJlY3QuaGVpZ2h0KSB7XG4gICAgICBvZmZzZXRUb3AgPSBib2R5UmVjdC5oZWlnaHQgLSAobnNtRGlhbG9nUmVjdC50b3AgKyBuc21Db250ZW50UmVjdC5oZWlnaHQpIC0gbWFyZ2luVG9wO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMubnNtQ29udGVudC5maXJzdC5uYXRpdmVFbGVtZW50LCAndG9wJywgKG9mZnNldFRvcCA8IDAgPyAwIDogb2Zmc2V0VG9wKSArICdweCcpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMubnNtQ29udGVudC5maXJzdC5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIG9mZnNldExlZnQgKyAncHgnKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NlbmRFdmVudChuYW1lOiBzdHJpbmcsIGV4dHJhRGF0YT86IHVua25vd24pOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIGV4dHJhRGF0YTogZXh0cmFEYXRhLFxuICAgICAgaW5zdGFuY2U6IHsgaWQ6IHRoaXMuaWRlbnRpZmllciwgbW9kYWw6IHRoaXMgfVxuICAgIH07XG5cbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChOZ3hTbWFydE1vZGFsQ29uZmlnLnByZWZpeEV2ZW50ICsgbmFtZSwgeyBkZXRhaWw6IGRhdGEgfSk7XG5cbiAgICByZXR1cm4gd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElzIGN1cnJlbnQgcGxhdGZvcm0gYnJvd3NlclxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgaXNCcm93c2VyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGNvbnRlbnQgaW5zaWRlIHByb3ZpZGVkIFZpZXdDb250YWluZXJSZWZcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlRHluYW1pY0NvbnRlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5keW5hbWljQ29udGVudENvbnRhaW5lci5jbGVhcigpO1xuICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IHRoaXMuZHluYW1pY0NvbnRlbnRDb250YWluZXIuY3JlYXRlQ29tcG9uZW50KHRoaXMuY29udGVudENvbXBvbmVudCk7XG4gICAgdGhpcy5hc3NpZ25Nb2RhbERhdGFUb0NvbXBvbmVudERhdGEodGhpcy5fY29tcG9uZW50UmVmKTtcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbnMgdGhlIG1vZGFsIGRhdGEgdG8gdGhlIENvbXBvbmVudFJlZiBpbnN0YW5jZSBwcm9wZXJ0aWVzXG4gICAqL1xuICBwcml2YXRlIGFzc2lnbk1vZGFsRGF0YVRvQ29tcG9uZW50RGF0YShjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxDb21wb25lbnQ+KTogdm9pZCB7XG4gICAgaWYgKGNvbXBvbmVudFJlZikge1xuICAgICAgT2JqZWN0LmFzc2lnbihjb21wb25lbnRSZWYuaW5zdGFuY2UsIHRoaXMuX2RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ25zIHRoZSBDb21wb25lbnRSZWYgaW5zdGFuY2UgcHJvcGVydGllcyB0byB0aGUgbW9kYWwgZGF0YSBvYmplY3RcbiAgICovXG4gIHByaXZhdGUgYXNzaWduQ29tcG9uZW50RGF0YVRvTW9kYWxEYXRhKGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPENvbXBvbmVudD4pOiB2b2lkIHtcbiAgICBpZiAoY29tcG9uZW50UmVmKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuX2RhdGEsIGNvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==