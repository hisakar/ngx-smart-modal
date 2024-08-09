import { Inject, Injectable, PLATFORM_ID, TemplateRef, Type } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NgxSmartModalComponent } from '../components/ngx-smart-modal.component';
import { NgxSmartModalConfig } from '../config/ngx-smart-modal.config';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-smart-modal-stack.service";
export class NgxSmartModalService {
    constructor(_appRef, _injector, _modalStack, applicationRef, _document, _platformId) {
        this._appRef = _appRef;
        this._injector = _injector;
        this._modalStack = _modalStack;
        this.applicationRef = applicationRef;
        this._document = _document;
        this._platformId = _platformId;
        /**
         * Close the latest opened modal if escape key event is emitted
         * @param event The Keyboard Event
         */
        this._escapeKeyboardEvent = (event) => {
            if (event.key === 'Escape') {
                try {
                    const modal = this.getTopOpenedModal();
                    if (!modal.escapable) {
                        return false;
                    }
                    modal.onEscape.emit(modal);
                    this.closeLatestModal();
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        };
        /**
         * While modal is open, the focus stay on it
         * @param event The Keyboar dEvent
         */
        this._trapFocusModal = (event) => {
            if (event.key === 'Tab') {
                try {
                    const modal = this.getTopOpenedModal();
                    if (!modal.nsmDialog.first.nativeElement.contains(document.activeElement)) {
                        event.preventDefault();
                        event.stopPropagation();
                        modal.nsmDialog.first.nativeElement.focus();
                    }
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        };
        this._addEvents();
    }
    /**
     * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
     * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
     *
     * @param modalInstance The object that contains the given modal identifier and the modal itself.
     * @param force Optional parameter that forces the overriding of modal instance if it already exists.
     * @returns nothing special.
     */
    addModal(modalInstance, force) {
        this._modalStack.addModal(modalInstance, force);
    }
    /**
     * Retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    getModal(id) {
        return this._modalStack.getModal(id);
    }
    /**
     * Alias of `getModal` to retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    get(id) {
        return this.getModal(id);
    }
    /**
     * Open a given modal
     *
     * @param id The modal identifier used at creation time.
     * @param force Tell the modal to open top of all other opened modals
     */
    open(id, force = false) {
        return this._openModal(this.get(id), force);
    }
    /**
     * Close a given modal
     *
     * @param id The modal identifier used at creation time.
     */
    close(id) {
        return this._closeModal(this.get(id));
    }
    /**
     * Close all opened modals
     */
    closeAll() {
        this.getOpenedModals().forEach((instance) => {
            this._closeModal(instance.modal);
        });
    }
    /**
     * Toggles a given modal
     * If the retrieved modal is opened it closes it, else it opens it.
     *
     * @param id The modal identifier used at creation time.
     * @param force Tell the modal to open top of all other opened modals
     */
    toggle(id, force = false) {
        return this._toggleModal(this.get(id), force);
    }
    /**
     * Retrieve all the created modals.
     *
     * @returns an array that contains all modal instances.
     */
    getModalStack() {
        return this._modalStack.getModalStack();
    }
    /**
     * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
     *
     * @returns an array that contains all the opened modals.
     */
    getOpenedModals() {
        return this._modalStack.getOpenedModals();
    }
    /**
     * Retrieve the opened modal with highest z-index.
     *
     * @returns the opened modal with highest z-index.
     */
    getTopOpenedModal() {
        return this._modalStack.getTopOpenedModal();
    }
    /**
     * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
     * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
     * Use it to make a modal appear foreground.
     *
     * @returns a higher index from all the existing modal instances.
     */
    getHigherIndex() {
        return this._modalStack.getHigherIndex();
    }
    /**
     * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
     *
     * @returns the number of modal instances.
     */
    getModalStackCount() {
        return this._modalStack.getModalStackCount();
    }
    /**
     * Remove a modal instance from the modal stack.
     *
     * @param id The modal identifier.
     * @returns the removed modal instance.
     */
    removeModal(id) {
        const modalInstance = this._modalStack.removeModal(id);
        if (modalInstance) {
            this._destroyModal(modalInstance.modal);
        }
    }
    /**
     * Associate data to an identified modal. If the modal isn't already associated to some data, it creates a new
     * entry in the `modalData` array with its `id` and the given `data`. If the modal already has data, it rewrites
     * them with the new ones. Finally if no modal found it returns an error message in the console and false value
     * as method output.
     *
     * @param data The data you want to associate to the modal.
     * @param id The modal identifier.
     * @param force If true, overrides the previous stored data if there was.
     * @returns true if the given modal exists and the process has been tried, either false.
     */
    setModalData(data, id, force) {
        const modal = this.get(id);
        if (modal) {
            modal.setData(data, force);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Retrieve modal data by its identifier.
     *
     * @param id The modal identifier used at creation time.
     * @returns the associated modal data.
     */
    getModalData(id) {
        const modal = this.get(id);
        if (modal) {
            return modal.getData();
        }
        return null;
    }
    /**
     * Reset the data attached to a given modal.
     *
     * @param id The modal identifier used at creation time.
     * @returns the removed data or false if modal doesn't exist.
     */
    resetModalData(id) {
        if (this._modalStack.getModalStack().find((o) => o.id === id)) {
            const removed = this.getModal(id).getData();
            this.getModal(id).removeData();
            return removed;
        }
        else {
            return false;
        }
    }
    /**
     * Close the latest opened modal
     */
    closeLatestModal() {
        this.getTopOpenedModal().close();
    }
    /**
     * Create dynamic NgxSmartModalComponent
     * @param vcr A ViewContainerRef reference
     * @param id The modal identifier used at creation time
     * @param content The modal content (string, templateRef or Component)
     * @param options Any NgxSmartModalComponent available options
     */
    create(id, content, vcr, options = {}) {
        try {
            return this.getModal(id);
        }
        catch (e) {
            const ngContent = this._resolveNgContent(content);
            const componentRef = vcr.createComponent(NgxSmartModalComponent, { injector: this._injector, projectableNodes: ngContent });
            if (content instanceof Type) {
                componentRef.instance.contentComponent = content;
            }
            componentRef.instance.identifier = id;
            componentRef.instance.createFrom = 'service';
            if (typeof options.closable === 'boolean') {
                componentRef.instance.closable = options.closable;
            }
            if (typeof options.escapable === 'boolean') {
                componentRef.instance.escapable = options.escapable;
            }
            if (typeof options.dismissable === 'boolean') {
                componentRef.instance.dismissable = options.dismissable;
            }
            if (typeof options.customClass === 'string') {
                componentRef.instance.customClass = options.customClass;
            }
            if (typeof options.backdrop === 'boolean') {
                componentRef.instance.backdrop = options.backdrop;
            }
            if (typeof options.force === 'boolean') {
                componentRef.instance.force = options.force;
            }
            if (typeof options.hideDelay === 'number') {
                componentRef.instance.hideDelay = options.hideDelay;
            }
            if (typeof options.autostart === 'boolean') {
                componentRef.instance.autostart = options.autostart;
            }
            if (typeof options.target === 'string') {
                componentRef.instance.target = options.target;
            }
            if (typeof options.ariaLabel === 'string') {
                componentRef.instance.ariaLabel = options.ariaLabel;
            }
            if (typeof options.ariaLabelledBy === 'string') {
                componentRef.instance.ariaLabelledBy = options.ariaLabelledBy;
            }
            if (typeof options.ariaDescribedBy === 'string') {
                componentRef.instance.ariaDescribedBy = options.ariaDescribedBy;
            }
            if (typeof options.refocus === 'boolean') {
                componentRef.instance.refocus = options.refocus;
            }
            const domElem = componentRef.hostView.rootNodes[0];
            this._document.body.appendChild(domElem);
            return componentRef.instance;
        }
    }
    _addEvents() {
        if (!this.isBrowser) {
            return false;
        }
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'create', ((e) => {
            this._initModal(e.detail.instance);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'delete', ((e) => {
            this._deleteModal(e.detail.instance);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'open', ((e) => {
            this._openModal(e.detail.instance.modal, e.detail.extraData.top);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'toggle', ((e) => {
            this._toggleModal(e.detail.instance.modal, e.detail.extraData.top);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'close', ((e) => {
            this._closeModal(e.detail.instance.modal);
        }));
        window.addEventListener(NgxSmartModalConfig.prefixEvent + 'dismiss', ((e) => {
            this._dismissModal(e.detail.instance.modal);
        }));
        window.addEventListener('keyup', this._escapeKeyboardEvent);
        return true;
    }
    _initModal(modalInstance) {
        modalInstance.modal.layerPosition += this.getModalStackCount();
        this.addModal(modalInstance, modalInstance.modal.force);
        if (modalInstance.modal.autostart) {
            this.open(modalInstance.id);
        }
    }
    _openModal(modal, top) {
        if (modal.visible) {
            return false;
        }
        this.lastElementFocused = document.activeElement;
        if (modal.escapable) {
            window.addEventListener('keyup', this._escapeKeyboardEvent);
        }
        if (modal.backdrop) {
            window.addEventListener('keydown', this._trapFocusModal);
        }
        if (top) {
            modal.layerPosition = this.getHigherIndex();
        }
        modal.addBodyClass();
        modal.overlayVisible = true;
        modal.visible = true;
        modal.onOpen.emit(modal);
        modal.markForCheck();
        setTimeout(() => {
            modal.openedClass = true;
            if (modal.target) {
                modal.targetPlacement();
            }
            modal.nsmDialog.first.nativeElement.setAttribute('role', 'dialog');
            modal.nsmDialog.first.nativeElement.setAttribute('tabIndex', '-1');
            modal.nsmDialog.first.nativeElement.setAttribute('aria-modal', 'true');
            modal.nsmDialog.first.nativeElement.focus();
            modal.markForCheck();
            modal.onOpenFinished.emit(modal);
        });
        return true;
    }
    _toggleModal(modal, top) {
        if (modal.visible) {
            return this._closeModal(modal);
        }
        else {
            return this._openModal(modal, top);
        }
    }
    _closeModal(modal) {
        if (!modal.openedClass) {
            return false;
        }
        modal.openedClass = false;
        modal.onClose.emit(modal);
        modal.onAnyCloseEvent.emit(modal);
        if (this.getOpenedModals().length < 2) {
            modal.removeBodyClass();
            window.removeEventListener('keyup', this._escapeKeyboardEvent);
            window.removeEventListener('keydown', this._trapFocusModal);
        }
        setTimeout(() => {
            modal.visibleChange.emit(modal.visible);
            modal.visible = false;
            modal.overlayVisible = false;
            modal.nsmDialog.first.nativeElement.removeAttribute('tabIndex');
            modal.markForCheck();
            modal.onCloseFinished.emit(modal);
            modal.onAnyCloseEventFinished.emit(modal);
            if (modal.refocus) {
                this.lastElementFocused.focus();
            }
        }, modal.hideDelay);
        return true;
    }
    _dismissModal(modal) {
        if (!modal.openedClass) {
            return false;
        }
        modal.openedClass = false;
        modal.onDismiss.emit(modal);
        modal.onAnyCloseEvent.emit(modal);
        if (this.getOpenedModals().length < 2) {
            modal.removeBodyClass();
        }
        setTimeout(() => {
            modal.visible = false;
            modal.visibleChange.emit(modal.visible);
            modal.overlayVisible = false;
            modal.markForCheck();
            modal.onDismissFinished.emit(modal);
            modal.onAnyCloseEventFinished.emit(modal);
        }, modal.hideDelay);
        return true;
    }
    _deleteModal(modalInstance) {
        this.removeModal(modalInstance.id);
        if (!this.getModalStack().length) {
            modalInstance.modal.removeBodyClass();
        }
    }
    /**
     * Resolve content according to the types
     * @param content The modal content (string, templateRef or Component)
     */
    _resolveNgContent(content) {
        if (typeof content === 'string') {
            const element = this._document.createTextNode(content);
            return [[element]];
        }
        if (content instanceof TemplateRef) {
            const viewRef = content.createEmbeddedView(null);
            this.applicationRef.attachView(viewRef);
            return [viewRef.rootNodes];
        }
        return [];
    }
    /**
     * Is current platform browser
     */
    get isBrowser() {
        return isPlatformBrowser(this._platformId);
    }
    /**
     * Remove dynamically created modal from DOM
     */
    _destroyModal(modal) {
        // Prevent destruction of the inline modals
        if (modal.createFrom !== 'service') {
            return;
        }
        this._document.body.removeChild(modal.elementRef.nativeElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: i1.NgxSmartModalStackService }, { token: i0.ApplicationRef }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: i1.NgxSmartModalStackService }, { type: i0.ApplicationRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc21hcnQtbW9kYWwvc3JjL2xpYi9zZXJ2aWNlcy9uZ3gtc21hcnQtbW9kYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW1DLE1BQU0sRUFBRSxVQUFVLEVBQVksV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ2hKLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRixPQUFPLEVBQXlCLG1CQUFtQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7OztBQVM5RixNQUFNLE9BQU8sb0JBQW9CO0lBRy9CLFlBQ1UsT0FBdUIsRUFDdkIsU0FBbUIsRUFDbkIsV0FBc0MsRUFDdEMsY0FBOEIsRUFDWixTQUFjLEVBQ1gsV0FBZ0I7UUFMckMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBMkI7UUFDdEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQ1osY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNYLGdCQUFXLEdBQVgsV0FBVyxDQUFLO1FBOFovQzs7O1dBR0c7UUFDSyx5QkFBb0IsR0FBRyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtZQUN0RCxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUFFO2dCQUMxQixJQUFJO29CQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUV2QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTt3QkFDcEIsT0FBTyxLQUFLLENBQUM7cUJBQ2Q7b0JBRUQsS0FB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ZiwgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3RvciwgUExBVEZPUk1fSUQsIFRlbXBsYXRlUmVmLCBUeXBlLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmd4U21hcnRNb2RhbENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvbmd4LXNtYXJ0LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJTmd4U21hcnRNb2RhbE9wdGlvbnMsIE5neFNtYXJ0TW9kYWxDb25maWcgfSBmcm9tICcuLi9jb25maWcvbmd4LXNtYXJ0LW1vZGFsLmNvbmZpZyc7XG5pbXBvcnQgeyBOZ3hTbWFydE1vZGFsU3RhY2tTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtc21hcnQtbW9kYWwtc3RhY2suc2VydmljZSc7XG5pbXBvcnQgeyBNb2RhbEluc3RhbmNlIH0gZnJvbSAnLi9tb2RhbC1pbnN0YW5jZSc7XG5cbmV4cG9ydCB0eXBlIENvbnRlbnQ8VD4gPSBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxUPiB8IFR5cGU8VD47XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neFNtYXJ0TW9kYWxTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsYXN0RWxlbWVudEZvY3VzZWQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9tb2RhbFN0YWNrOiBOZ3hTbWFydE1vZGFsU3RhY2tTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZDogYW55XG4gICkge1xuICAgIHRoaXMuX2FkZEV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBtb2RhbCBpbnN0YW5jZS4gVGhpcyBzdGVwIGlzIGVzc2VudGlhbCBhbmQgYWxsb3dzIHRvIHJldHJpZXZlIGFueSBtb2RhbCBhdCBhbnkgdGltZS5cbiAgICogSXQgc3RvcmVzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBnaXZlbiBtb2RhbCBpZGVudGlmaWVyIGFuZCB0aGUgbW9kYWwgaXRzZWxmIGRpcmVjdGx5IGluIHRoZSBgbW9kYWxTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBtb2RhbEluc3RhbmNlIFRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZ2l2ZW4gbW9kYWwgaWRlbnRpZmllciBhbmQgdGhlIG1vZGFsIGl0c2VsZi5cbiAgICogQHBhcmFtIGZvcmNlIE9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IGZvcmNlcyB0aGUgb3ZlcnJpZGluZyBvZiBtb2RhbCBpbnN0YW5jZSBpZiBpdCBhbHJlYWR5IGV4aXN0cy5cbiAgICogQHJldHVybnMgbm90aGluZyBzcGVjaWFsLlxuICAgKi9cbiAgcHVibGljIGFkZE1vZGFsKG1vZGFsSW5zdGFuY2U6IE1vZGFsSW5zdGFuY2UsIGZvcmNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX21vZGFsU3RhY2suYWRkTW9kYWwobW9kYWxJbnN0YW5jZSwgZm9yY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgbW9kYWwgaW5zdGFuY2UgYnkgaXRzIGlkZW50aWZpZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0TW9kYWwoaWQ6IHN0cmluZyk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldE1vZGFsKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGlhcyBvZiBgZ2V0TW9kYWxgIHRvIHJldHJpZXZlIGEgbW9kYWwgaW5zdGFuY2UgYnkgaXRzIGlkZW50aWZpZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0KGlkOiBzdHJpbmcpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RhbChpZCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbiBhIGdpdmVuIG1vZGFsXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWUuXG4gICAqIEBwYXJhbSBmb3JjZSBUZWxsIHRoZSBtb2RhbCB0byBvcGVuIHRvcCBvZiBhbGwgb3RoZXIgb3BlbmVkIG1vZGFsc1xuICAgKi9cbiAgcHVibGljIG9wZW4oaWQ6IHN0cmluZywgZm9yY2UgPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuTW9kYWwodGhpcy5nZXQoaWQpLCBmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgYSBnaXZlbiBtb2RhbFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIgdXNlZCBhdCBjcmVhdGlvbiB0aW1lLlxuICAgKi9cbiAgcHVibGljIGNsb3NlKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvc2VNb2RhbCh0aGlzLmdldChpZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIGFsbCBvcGVuZWQgbW9kYWxzXG4gICAqL1xuICBwdWJsaWMgY2xvc2VBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5nZXRPcGVuZWRNb2RhbHMoKS5mb3JFYWNoKChpbnN0YW5jZTogTW9kYWxJbnN0YW5jZSkgPT4ge1xuICAgICAgdGhpcy5fY2xvc2VNb2RhbChpbnN0YW5jZS5tb2RhbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyBhIGdpdmVuIG1vZGFsXG4gICAqIElmIHRoZSByZXRyaWV2ZWQgbW9kYWwgaXMgb3BlbmVkIGl0IGNsb3NlcyBpdCwgZWxzZSBpdCBvcGVucyBpdC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICogQHBhcmFtIGZvcmNlIFRlbGwgdGhlIG1vZGFsIHRvIG9wZW4gdG9wIG9mIGFsbCBvdGhlciBvcGVuZWQgbW9kYWxzXG4gICAqL1xuICBwdWJsaWMgdG9nZ2xlKGlkOiBzdHJpbmcsIGZvcmNlID0gZmFsc2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdG9nZ2xlTW9kYWwodGhpcy5nZXQoaWQpLCBmb3JjZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBjcmVhdGVkIG1vZGFscy5cbiAgICpcbiAgICogQHJldHVybnMgYW4gYXJyYXkgdGhhdCBjb250YWlucyBhbGwgbW9kYWwgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGFsU3RhY2soKTogTW9kYWxJbnN0YW5jZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5nZXRNb2RhbFN0YWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBvcGVuZWQgbW9kYWxzLiBJdCBsb29rcyBmb3IgYWxsIG1vZGFsIGluc3RhbmNlcyB3aXRoIHRoZWlyIGB2aXNpYmxlYCBwcm9wZXJ0eSBzZXQgdG8gYHRydWVgLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgb3BlbmVkIG1vZGFscy5cbiAgICovXG4gIHB1YmxpYyBnZXRPcGVuZWRNb2RhbHMoKTogTW9kYWxJbnN0YW5jZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5nZXRPcGVuZWRNb2RhbHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSB0aGUgb3BlbmVkIG1vZGFsIHdpdGggaGlnaGVzdCB6LWluZGV4LlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgb3BlbmVkIG1vZGFsIHdpdGggaGlnaGVzdCB6LWluZGV4LlxuICAgKi9cbiAgcHVibGljIGdldFRvcE9wZW5lZE1vZGFsKCk6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldFRvcE9wZW5lZE1vZGFsKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBoaWdoZXIgYHotaW5kZXhgIHZhbHVlIGJldHdlZW4gYWxsIHRoZSBtb2RhbCBpbnN0YW5jZXMuIEl0IGl0ZXJhdGVzIG92ZXIgdGhlIGBNb2RhbFN0YWNrYCBhcnJheSBhbmRcbiAgICogY2FsY3VsYXRlcyBhIGhpZ2hlciB2YWx1ZSAoaXQgdGFrZXMgdGhlIGhpZ2hlc3QgaW5kZXggdmFsdWUgYmV0d2VlbiBhbGwgdGhlIG1vZGFsIGluc3RhbmNlcyBhbmQgYWRkcyAxKS5cbiAgICogVXNlIGl0IHRvIG1ha2UgYSBtb2RhbCBhcHBlYXIgZm9yZWdyb3VuZC5cbiAgICpcbiAgICogQHJldHVybnMgYSBoaWdoZXIgaW5kZXggZnJvbSBhbGwgdGhlIGV4aXN0aW5nIG1vZGFsIGluc3RhbmNlcy5cbiAgICovXG4gIHB1YmxpYyBnZXRIaWdoZXJJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldEhpZ2hlckluZGV4KCk7XG4gIH1cblxuICAvKipcbiAgICogSXQgZ2l2ZXMgdGhlIG51bWJlciBvZiBtb2RhbCBpbnN0YW5jZXMuIEl0J3MgaGVscGZ1bCB0byBrbm93IGlmIHRoZSBtb2RhbCBzdGFjayBpcyBlbXB0eSBvciBub3QuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2YgbW9kYWwgaW5zdGFuY2VzLlxuICAgKi9cbiAgcHVibGljIGdldE1vZGFsU3RhY2tDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tb2RhbFN0YWNrLmdldE1vZGFsU3RhY2tDb3VudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIG1vZGFsIGluc3RhbmNlIGZyb20gdGhlIG1vZGFsIHN0YWNrLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIuXG4gICAqIEByZXR1cm5zIHRoZSByZW1vdmVkIG1vZGFsIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIHJlbW92ZU1vZGFsKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtb2RhbEluc3RhbmNlID0gdGhpcy5fbW9kYWxTdGFjay5yZW1vdmVNb2RhbChpZCk7XG4gICAgaWYgKG1vZGFsSW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lNb2RhbChtb2RhbEluc3RhbmNlLm1vZGFsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzb2NpYXRlIGRhdGEgdG8gYW4gaWRlbnRpZmllZCBtb2RhbC4gSWYgdGhlIG1vZGFsIGlzbid0IGFscmVhZHkgYXNzb2NpYXRlZCB0byBzb21lIGRhdGEsIGl0IGNyZWF0ZXMgYSBuZXdcbiAgICogZW50cnkgaW4gdGhlIGBtb2RhbERhdGFgIGFycmF5IHdpdGggaXRzIGBpZGAgYW5kIHRoZSBnaXZlbiBgZGF0YWAuIElmIHRoZSBtb2RhbCBhbHJlYWR5IGhhcyBkYXRhLCBpdCByZXdyaXRlc1xuICAgKiB0aGVtIHdpdGggdGhlIG5ldyBvbmVzLiBGaW5hbGx5IGlmIG5vIG1vZGFsIGZvdW5kIGl0IHJldHVybnMgYW4gZXJyb3IgbWVzc2FnZSBpbiB0aGUgY29uc29sZSBhbmQgZmFsc2UgdmFsdWVcbiAgICogYXMgbWV0aG9kIG91dHB1dC5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgeW91IHdhbnQgdG8gYXNzb2NpYXRlIHRvIHRoZSBtb2RhbC5cbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyLlxuICAgKiBAcGFyYW0gZm9yY2UgSWYgdHJ1ZSwgb3ZlcnJpZGVzIHRoZSBwcmV2aW91cyBzdG9yZWQgZGF0YSBpZiB0aGVyZSB3YXMuXG4gICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGFsIGV4aXN0cyBhbmQgdGhlIHByb2Nlc3MgaGFzIGJlZW4gdHJpZWQsIGVpdGhlciBmYWxzZS5cbiAgICovXG4gIHB1YmxpYyBzZXRNb2RhbERhdGEoZGF0YTogYW55LCBpZDogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBtb2RhbCA9IHRoaXMuZ2V0KGlkKTtcbiAgICBpZiAobW9kYWwpIHtcbiAgICAgIG1vZGFsLnNldERhdGEoZGF0YSwgZm9yY2UpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgbW9kYWwgZGF0YSBieSBpdHMgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICogQHJldHVybnMgdGhlIGFzc29jaWF0ZWQgbW9kYWwgZGF0YS5cbiAgICovXG4gIHB1YmxpYyBnZXRNb2RhbERhdGEoaWQ6IHN0cmluZyk6IHVua25vd24ge1xuICAgIGNvbnN0IG1vZGFsID0gdGhpcy5nZXQoaWQpO1xuICAgIGlmIChtb2RhbCkge1xuICAgICAgcmV0dXJuIG1vZGFsLmdldERhdGEoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgZGF0YSBhdHRhY2hlZCB0byBhIGdpdmVuIG1vZGFsLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG1vZGFsIGlkZW50aWZpZXIgdXNlZCBhdCBjcmVhdGlvbiB0aW1lLlxuICAgKiBAcmV0dXJucyB0aGUgcmVtb3ZlZCBkYXRhIG9yIGZhbHNlIGlmIG1vZGFsIGRvZXNuJ3QgZXhpc3QuXG4gICAqL1xuICBwdWJsaWMgcmVzZXRNb2RhbERhdGEoaWQ6IHN0cmluZyk6IHVua25vd24gfCBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fbW9kYWxTdGFjay5nZXRNb2RhbFN0YWNrKCkuZmluZCgobzogTW9kYWxJbnN0YW5jZSkgPT4gby5pZCA9PT0gaWQpKSB7XG4gICAgICBjb25zdCByZW1vdmVkOiB1bmtub3duID0gdGhpcy5nZXRNb2RhbChpZCkuZ2V0RGF0YSgpO1xuICAgICAgdGhpcy5nZXRNb2RhbChpZCkucmVtb3ZlRGF0YSgpO1xuICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgdGhlIGxhdGVzdCBvcGVuZWQgbW9kYWxcbiAgICovXG4gIHB1YmxpYyBjbG9zZUxhdGVzdE1vZGFsKCk6IHZvaWQge1xuICAgIHRoaXMuZ2V0VG9wT3BlbmVkTW9kYWwoKS5jbG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBkeW5hbWljIE5neFNtYXJ0TW9kYWxDb21wb25lbnRcbiAgICogQHBhcmFtIHZjciBBIFZpZXdDb250YWluZXJSZWYgcmVmZXJlbmNlXG4gICAqIEBwYXJhbSBpZCBUaGUgbW9kYWwgaWRlbnRpZmllciB1c2VkIGF0IGNyZWF0aW9uIHRpbWVcbiAgICogQHBhcmFtIGNvbnRlbnQgVGhlIG1vZGFsIGNvbnRlbnQgKHN0cmluZywgdGVtcGxhdGVSZWYgb3IgQ29tcG9uZW50KVxuICAgKiBAcGFyYW0gb3B0aW9ucyBBbnkgTmd4U21hcnRNb2RhbENvbXBvbmVudCBhdmFpbGFibGUgb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIGNyZWF0ZTxUPihpZDogc3RyaW5nLCBjb250ZW50OiBDb250ZW50PFQ+LCB2Y3I6IFZpZXdDb250YWluZXJSZWYsIG9wdGlvbnM6IElOZ3hTbWFydE1vZGFsT3B0aW9ucyA9IHt9KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1vZGFsKGlkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCBuZ0NvbnRlbnQgPSB0aGlzLl9yZXNvbHZlTmdDb250ZW50KGNvbnRlbnQpO1xuXG4gICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB2Y3IuY3JlYXRlQ29tcG9uZW50KE5neFNtYXJ0TW9kYWxDb21wb25lbnQsIHsgaW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLCBwcm9qZWN0YWJsZU5vZGVzOiBuZ0NvbnRlbnQgfSk7XG5cbiAgICAgIGlmIChjb250ZW50IGluc3RhbmNlb2YgVHlwZSkge1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuY29udGVudENvbXBvbmVudCA9IGNvbnRlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pZGVudGlmaWVyID0gaWQ7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuY3JlYXRlRnJvbSA9ICdzZXJ2aWNlJztcblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NhYmxlID09PSAnYm9vbGVhbicpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmNsb3NhYmxlID0gb3B0aW9ucy5jbG9zYWJsZTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmVzY2FwYWJsZSA9PT0gJ2Jvb2xlYW4nKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5lc2NhcGFibGUgPSBvcHRpb25zLmVzY2FwYWJsZTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmRpc21pc3NhYmxlID09PSAnYm9vbGVhbicpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmRpc21pc3NhYmxlID0gb3B0aW9ucy5kaXNtaXNzYWJsZTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmN1c3RvbUNsYXNzID09PSAnc3RyaW5nJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuY3VzdG9tQ2xhc3MgPSBvcHRpb25zLmN1c3RvbUNsYXNzOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYmFja2Ryb3AgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuYmFja2Ryb3AgPSBvcHRpb25zLmJhY2tkcm9wOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZm9yY2UgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuZm9yY2UgPSBvcHRpb25zLmZvcmNlOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuaGlkZURlbGF5ID09PSAnbnVtYmVyJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuaGlkZURlbGF5ID0gb3B0aW9ucy5oaWRlRGVsYXk7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdXRvc3RhcnQgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UuYXV0b3N0YXJ0ID0gb3B0aW9ucy5hdXRvc3RhcnQ7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy50YXJnZXQgPT09ICdzdHJpbmcnKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS50YXJnZXQgPSBvcHRpb25zLnRhcmdldDsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmFyaWFMYWJlbCA9PT0gJ3N0cmluZycpIHsgY29tcG9uZW50UmVmLmluc3RhbmNlLmFyaWFMYWJlbCA9IG9wdGlvbnMuYXJpYUxhYmVsOyB9XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXJpYUxhYmVsbGVkQnkgPT09ICdzdHJpbmcnKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5hcmlhTGFiZWxsZWRCeSA9IG9wdGlvbnMuYXJpYUxhYmVsbGVkQnk7IH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hcmlhRGVzY3JpYmVkQnkgPT09ICdzdHJpbmcnKSB7IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5hcmlhRGVzY3JpYmVkQnkgPSBvcHRpb25zLmFyaWFEZXNjcmliZWRCeTsgfVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlZm9jdXMgPT09ICdib29sZWFuJykgeyBjb21wb25lbnRSZWYuaW5zdGFuY2UucmVmb2N1cyA9IG9wdGlvbnMucmVmb2N1czsgfVxuXG4gICAgICBjb25zdCBkb21FbGVtID0gKGNvbXBvbmVudFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb21FbGVtKTtcblxuICAgICAgcmV0dXJuIGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRFdmVudHMoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKE5neFNtYXJ0TW9kYWxDb25maWcucHJlZml4RXZlbnQgKyAnY3JlYXRlJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5faW5pdE1vZGFsKGUuZGV0YWlsLmluc3RhbmNlKTtcbiAgICB9KSBhcyBFdmVudExpc3RlbmVyKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKE5neFNtYXJ0TW9kYWxDb25maWcucHJlZml4RXZlbnQgKyAnZGVsZXRlJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5fZGVsZXRlTW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UpO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICdvcGVuJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5fb3Blbk1vZGFsKGUuZGV0YWlsLmluc3RhbmNlLm1vZGFsLCBlLmRldGFpbC5leHRyYURhdGEudG9wKTtcbiAgICB9KSBhcyBFdmVudExpc3RlbmVyKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKE5neFNtYXJ0TW9kYWxDb25maWcucHJlZml4RXZlbnQgKyAndG9nZ2xlJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5fdG9nZ2xlTW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UubW9kYWwsIGUuZGV0YWlsLmV4dHJhRGF0YS50b3ApO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICdjbG9zZScsICgoZTogQ3VzdG9tRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoZS5kZXRhaWwuaW5zdGFuY2UubW9kYWwpO1xuICAgIH0pIGFzIEV2ZW50TGlzdGVuZXIpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoTmd4U21hcnRNb2RhbENvbmZpZy5wcmVmaXhFdmVudCArICdkaXNtaXNzJywgKChlOiBDdXN0b21FdmVudCkgPT4ge1xuICAgICAgdGhpcy5fZGlzbWlzc01vZGFsKGUuZGV0YWlsLmluc3RhbmNlLm1vZGFsKTtcbiAgICB9KSBhcyBFdmVudExpc3RlbmVyKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2VzY2FwZUtleWJvYXJkRXZlbnQpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIF9pbml0TW9kYWwobW9kYWxJbnN0YW5jZTogTW9kYWxJbnN0YW5jZSkge1xuICAgIG1vZGFsSW5zdGFuY2UubW9kYWwubGF5ZXJQb3NpdGlvbiArPSB0aGlzLmdldE1vZGFsU3RhY2tDb3VudCgpO1xuICAgIHRoaXMuYWRkTW9kYWwobW9kYWxJbnN0YW5jZSwgbW9kYWxJbnN0YW5jZS5tb2RhbC5mb3JjZSk7XG5cbiAgICBpZiAobW9kYWxJbnN0YW5jZS5tb2RhbC5hdXRvc3RhcnQpIHtcbiAgICAgIHRoaXMub3Blbihtb2RhbEluc3RhbmNlLmlkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9vcGVuTW9kYWwobW9kYWw6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQsIHRvcD86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBpZiAobW9kYWwudmlzaWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMubGFzdEVsZW1lbnRGb2N1c2VkID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgIGlmIChtb2RhbC5lc2NhcGFibGUpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2VzY2FwZUtleWJvYXJkRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChtb2RhbC5iYWNrZHJvcCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl90cmFwRm9jdXNNb2RhbCk7XG4gICAgfVxuXG4gICAgaWYgKHRvcCkge1xuICAgICAgbW9kYWwubGF5ZXJQb3NpdGlvbiA9IHRoaXMuZ2V0SGlnaGVySW5kZXgoKTtcbiAgICB9XG5cbiAgICBtb2RhbC5hZGRCb2R5Q2xhc3MoKTtcbiAgICBtb2RhbC5vdmVybGF5VmlzaWJsZSA9IHRydWU7XG4gICAgbW9kYWwudmlzaWJsZSA9IHRydWU7XG4gICAgbW9kYWwub25PcGVuLmVtaXQobW9kYWwpO1xuICAgIG1vZGFsLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBtb2RhbC5vcGVuZWRDbGFzcyA9IHRydWU7XG5cbiAgICAgIGlmIChtb2RhbC50YXJnZXQpIHtcbiAgICAgICAgbW9kYWwudGFyZ2V0UGxhY2VtZW50KCk7XG4gICAgICB9XG5cbiAgICAgIG1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcbiAgICAgIG1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiSW5kZXgnLCAnLTEnKTtcbiAgICAgIG1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgICBtb2RhbC5uc21EaWFsb2cuZmlyc3QubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgICBtb2RhbC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIG1vZGFsLm9uT3BlbkZpbmlzaGVkLmVtaXQobW9kYWwpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIF90b2dnbGVNb2RhbChtb2RhbDogTmd4U21hcnRNb2RhbENvbXBvbmVudCwgdG9wPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmIChtb2RhbC52aXNpYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcGVuTW9kYWwobW9kYWwsIHRvcCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xvc2VNb2RhbChtb2RhbDogTmd4U21hcnRNb2RhbENvbXBvbmVudCk6IGJvb2xlYW4ge1xuICAgIGlmICghbW9kYWwub3BlbmVkQ2xhc3MpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2RhbC5vcGVuZWRDbGFzcyA9IGZhbHNlO1xuICAgIG1vZGFsLm9uQ2xvc2UuZW1pdChtb2RhbCk7XG4gICAgbW9kYWwub25BbnlDbG9zZUV2ZW50LmVtaXQobW9kYWwpO1xuXG4gICAgaWYgKHRoaXMuZ2V0T3BlbmVkTW9kYWxzKCkubGVuZ3RoIDwgMikge1xuICAgICAgbW9kYWwucmVtb3ZlQm9keUNsYXNzKCk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9lc2NhcGVLZXlib2FyZEV2ZW50KTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fdHJhcEZvY3VzTW9kYWwpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbW9kYWwudmlzaWJsZUNoYW5nZS5lbWl0KG1vZGFsLnZpc2libGUpO1xuICAgICAgbW9kYWwudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgbW9kYWwub3ZlcmxheVZpc2libGUgPSBmYWxzZTtcbiAgICAgIG1vZGFsLm5zbURpYWxvZy5maXJzdC5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiSW5kZXgnKTtcbiAgICAgIG1vZGFsLm1hcmtGb3JDaGVjaygpO1xuICAgICAgbW9kYWwub25DbG9zZUZpbmlzaGVkLmVtaXQobW9kYWwpO1xuICAgICAgbW9kYWwub25BbnlDbG9zZUV2ZW50RmluaXNoZWQuZW1pdChtb2RhbCk7XG4gICAgICBpZiAobW9kYWwucmVmb2N1cykge1xuICAgICAgICB0aGlzLmxhc3RFbGVtZW50Rm9jdXNlZC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sIG1vZGFsLmhpZGVEZWxheSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc21pc3NNb2RhbChtb2RhbDogTmd4U21hcnRNb2RhbENvbXBvbmVudCk6IGJvb2xlYW4ge1xuICAgIGlmICghbW9kYWwub3BlbmVkQ2xhc3MpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb2RhbC5vcGVuZWRDbGFzcyA9IGZhbHNlO1xuICAgIG1vZGFsLm9uRGlzbWlzcy5lbWl0KG1vZGFsKTtcbiAgICBtb2RhbC5vbkFueUNsb3NlRXZlbnQuZW1pdChtb2RhbCk7XG5cbiAgICBpZiAodGhpcy5nZXRPcGVuZWRNb2RhbHMoKS5sZW5ndGggPCAyKSB7XG4gICAgICBtb2RhbC5yZW1vdmVCb2R5Q2xhc3MoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIG1vZGFsLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIG1vZGFsLnZpc2libGVDaGFuZ2UuZW1pdChtb2RhbC52aXNpYmxlKTtcbiAgICAgIG1vZGFsLm92ZXJsYXlWaXNpYmxlID0gZmFsc2U7XG4gICAgICBtb2RhbC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIG1vZGFsLm9uRGlzbWlzc0ZpbmlzaGVkLmVtaXQobW9kYWwpO1xuICAgICAgbW9kYWwub25BbnlDbG9zZUV2ZW50RmluaXNoZWQuZW1pdChtb2RhbCk7XG4gICAgfSwgbW9kYWwuaGlkZURlbGF5KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVsZXRlTW9kYWwobW9kYWxJbnN0YW5jZTogTW9kYWxJbnN0YW5jZSkge1xuICAgIHRoaXMucmVtb3ZlTW9kYWwobW9kYWxJbnN0YW5jZS5pZCk7XG5cbiAgICBpZiAoIXRoaXMuZ2V0TW9kYWxTdGFjaygpLmxlbmd0aCkge1xuICAgICAgbW9kYWxJbnN0YW5jZS5tb2RhbC5yZW1vdmVCb2R5Q2xhc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZSBjb250ZW50IGFjY29yZGluZyB0byB0aGUgdHlwZXNcbiAgICogQHBhcmFtIGNvbnRlbnQgVGhlIG1vZGFsIGNvbnRlbnQgKHN0cmluZywgdGVtcGxhdGVSZWYgb3IgQ29tcG9uZW50KVxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzb2x2ZU5nQ29udGVudDxUPihjb250ZW50OiBDb250ZW50PFQ+KTogYW55W11bXSB8IFRleHRbXVtdIHtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY29udGVudCk7XG4gICAgICByZXR1cm4gW1tlbGVtZW50XV07XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgY29uc3Qgdmlld1JlZiA9IGNvbnRlbnQuY3JlYXRlRW1iZWRkZWRWaWV3KG51bGwgYXMgYW55KTtcbiAgICAgIHRoaXMuYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyh2aWV3UmVmKTtcbiAgICAgIHJldHVybiBbdmlld1JlZi5yb290Tm9kZXNdO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgbGF0ZXN0IG9wZW5lZCBtb2RhbCBpZiBlc2NhcGUga2V5IGV2ZW50IGlzIGVtaXR0ZWRcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBLZXlib2FyZCBFdmVudFxuICAgKi9cbiAgcHJpdmF0ZSBfZXNjYXBlS2V5Ym9hcmRFdmVudCA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtb2RhbCA9IHRoaXMuZ2V0VG9wT3BlbmVkTW9kYWwoKTtcblxuICAgICAgICBpZiAoIW1vZGFsLmVzY2FwYWJsZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsLm9uRXNjYXBlLmVtaXQobW9kYWwpO1xuICAgICAgICB0aGlzLmNsb3NlTGF0ZXN0TW9kYWwoKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyBjdXJyZW50IHBsYXRmb3JtIGJyb3dzZXJcbiAgICovXG4gIHByaXZhdGUgZ2V0IGlzQnJvd3NlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCk7XG4gIH1cblxuICAvKipcbiAgICogV2hpbGUgbW9kYWwgaXMgb3BlbiwgdGhlIGZvY3VzIHN0YXkgb24gaXRcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBLZXlib2FyIGRFdmVudFxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzTW9kYWwgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnVGFiJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSB0aGlzLmdldFRvcE9wZW5lZE1vZGFsKCk7XG5cbiAgICAgICAgaWYgKCFtb2RhbC5uc21EaWFsb2cuZmlyc3QubmF0aXZlRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgbW9kYWwubnNtRGlhbG9nLmZpcnN0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBkeW5hbWljYWxseSBjcmVhdGVkIG1vZGFsIGZyb20gRE9NXG4gICAqL1xuICBwcml2YXRlIF9kZXN0cm95TW9kYWwobW9kYWw6IE5neFNtYXJ0TW9kYWxDb21wb25lbnQpOiB2b2lkIHtcbiAgICAvLyBQcmV2ZW50IGRlc3RydWN0aW9uIG9mIHRoZSBpbmxpbmUgbW9kYWxzXG4gICAgaWYgKG1vZGFsLmNyZWF0ZUZyb20gIT09ICdzZXJ2aWNlJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2RvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobW9kYWwuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxufVxuIl19