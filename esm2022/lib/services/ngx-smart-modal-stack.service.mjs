import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxSmartModalStackService {
    constructor() {
        this._modalStack = [];
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
        if (force) {
            const i = this._modalStack.findIndex((o) => o.id === modalInstance.id);
            if (i > -1) {
                this._modalStack[i].modal = modalInstance.modal;
            }
            else {
                this._modalStack.push(modalInstance);
            }
            return;
        }
        this._modalStack.push(modalInstance);
    }
    /**
     * Retrieve a modal instance by its identifier.
     *
     * @param id The modal identifier used at creation time.
     */
    getModal(id) {
        const i = this._modalStack.find((o) => o.id === id);
        if (i !== undefined) {
            return i.modal;
        }
        else {
            throw new Error(`Cannot find modal with identifier ${id}`);
        }
    }
    /**
     * Retrieve all the created modals.
     *
     * @returns an array that contains all modal instances.
     */
    getModalStack() {
        return this._modalStack;
    }
    /**
     * Retrieve all the opened modals. It looks for all modal instances with their `visible` property set to `true`.
     *
     * @returns an array that contains all the opened modals.
     */
    getOpenedModals() {
        return this._modalStack.filter((o) => o.modal.visible);
    }
    /**
     * Retrieve the opened modal with highest z-index.
     *
     * @returns the opened modal with highest z-index.
     */
    getTopOpenedModal() {
        if (!this.getOpenedModals().length) {
            throw new Error('No modal is opened');
        }
        return this.getOpenedModals()
            .map((o) => o.modal)
            .reduce((highest, item) => item.layerPosition > highest.layerPosition ? item : highest, this.getOpenedModals()[0].modal);
    }
    /**
     * Get the higher `z-index` value between all the modal instances. It iterates over the `ModalStack` array and
     * calculates a higher value (it takes the highest index value between all the modal instances and adds 1).
     * Use it to make a modal appear foreground.
     *
     * @returns a higher index from all the existing modal instances.
     */
    getHigherIndex() {
        return Math.max(...this._modalStack.map((o) => o.modal.layerPosition), 1041) + 1;
    }
    /**
     * It gives the number of modal instances. It's helpful to know if the modal stack is empty or not.
     *
     * @returns the number of modal instances.
     */
    getModalStackCount() {
        return this._modalStack.length;
    }
    /**
     * Remove a modal instance from the modal stack.
     * Returns the removed modal instance or undefined if no modal was found
     *
     * @param id The modal identifier.
     * @returns the removed modal instance.
     */
    removeModal(id) {
        const i = this._modalStack.findIndex((o) => o.id === id);
        if (i < 0) {
            return;
        }
        const modalInstance = this._modalStack.splice(i, 1)[0];
        return modalInstance;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: NgxSmartModalStackService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNtYXJ0LW1vZGFsLXN0YWNrLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc21hcnQtbW9kYWwvc3JjL2xpYi9zZXJ2aWNlcy9uZ3gtc21hcnQtbW9kYWwtc3RhY2suc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU0zQyxNQUFNLE9BQU8seUJBQXlCO0lBR3BDO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxRQUFRLENBQUMsYUFBNEIsRUFBRSxLQUFlO1FBQzNELElBQUksS0FBSyxFQUFFO1lBQ1QsTUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDVixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO2FBQ2pEO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxRQUFRLENBQUMsRUFBVTtRQUN4QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksYUFBYTtRQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxlQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksaUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2QztRQUVELE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRTthQUMxQixHQUFHLENBQUMsQ0FBQyxDQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGtCQUFrQjtRQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsRUFBVTtRQUMzQixNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQzsrR0EvR1UseUJBQXlCO21IQUF6Qix5QkFBeUI7OzRGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1vZGFsSW5zdGFuY2UgfSBmcm9tICcuL21vZGFsLWluc3RhbmNlJztcbmltcG9ydCB7IE5neFNtYXJ0TW9kYWxDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL25neC1zbWFydC1tb2RhbC5jb21wb25lbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmd4U21hcnRNb2RhbFN0YWNrU2VydmljZSB7XG4gIHByaXZhdGUgX21vZGFsU3RhY2s6IE1vZGFsSW5zdGFuY2VbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9tb2RhbFN0YWNrID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IG1vZGFsIGluc3RhbmNlLiBUaGlzIHN0ZXAgaXMgZXNzZW50aWFsIGFuZCBhbGxvd3MgdG8gcmV0cmlldmUgYW55IG1vZGFsIGF0IGFueSB0aW1lLlxuICAgKiBJdCBzdG9yZXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGdpdmVuIG1vZGFsIGlkZW50aWZpZXIgYW5kIHRoZSBtb2RhbCBpdHNlbGYgZGlyZWN0bHkgaW4gdGhlIGBtb2RhbFN0YWNrYC5cbiAgICpcbiAgICogQHBhcmFtIG1vZGFsSW5zdGFuY2UgVGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBnaXZlbiBtb2RhbCBpZGVudGlmaWVyIGFuZCB0aGUgbW9kYWwgaXRzZWxmLlxuICAgKiBAcGFyYW0gZm9yY2UgT3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgZm9yY2VzIHRoZSBvdmVycmlkaW5nIG9mIG1vZGFsIGluc3RhbmNlIGlmIGl0IGFscmVhZHkgZXhpc3RzLlxuICAgKiBAcmV0dXJucyBub3RoaW5nIHNwZWNpYWwuXG4gICAqL1xuICBwdWJsaWMgYWRkTW9kYWwobW9kYWxJbnN0YW5jZTogTW9kYWxJbnN0YW5jZSwgZm9yY2U/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGZvcmNlKSB7XG4gICAgICBjb25zdCBpOiBudW1iZXIgPSB0aGlzLl9tb2RhbFN0YWNrLmZpbmRJbmRleCgobzogTW9kYWxJbnN0YW5jZSkgPT4gby5pZCA9PT0gbW9kYWxJbnN0YW5jZS5pZCk7XG4gICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgIHRoaXMuX21vZGFsU3RhY2tbaV0ubW9kYWwgPSBtb2RhbEluc3RhbmNlLm1vZGFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kYWxTdGFjay5wdXNoKG1vZGFsSW5zdGFuY2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9tb2RhbFN0YWNrLnB1c2gobW9kYWxJbnN0YW5jZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBtb2RhbCBpbnN0YW5jZSBieSBpdHMgaWRlbnRpZmllci5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyIHVzZWQgYXQgY3JlYXRpb24gdGltZS5cbiAgICovXG4gIHB1YmxpYyBnZXRNb2RhbChpZDogc3RyaW5nKTogTmd4U21hcnRNb2RhbENvbXBvbmVudCB7XG4gICAgY29uc3QgaSA9IHRoaXMuX21vZGFsU3RhY2suZmluZCgobzogTW9kYWxJbnN0YW5jZSkgPT4gby5pZCA9PT0gaWQpO1xuXG4gICAgaWYgKGkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGkubW9kYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbW9kYWwgd2l0aCBpZGVudGlmaWVyICR7aWR9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFsbCB0aGUgY3JlYXRlZCBtb2RhbHMuXG4gICAqXG4gICAqIEByZXR1cm5zIGFuIGFycmF5IHRoYXQgY29udGFpbnMgYWxsIG1vZGFsIGluc3RhbmNlcy5cbiAgICovXG4gIHB1YmxpYyBnZXRNb2RhbFN0YWNrKCk6IE1vZGFsSW5zdGFuY2VbXSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBvcGVuZWQgbW9kYWxzLiBJdCBsb29rcyBmb3IgYWxsIG1vZGFsIGluc3RhbmNlcyB3aXRoIHRoZWlyIGB2aXNpYmxlYCBwcm9wZXJ0eSBzZXQgdG8gYHRydWVgLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgb3BlbmVkIG1vZGFscy5cbiAgICovXG4gIHB1YmxpYyBnZXRPcGVuZWRNb2RhbHMoKTogTW9kYWxJbnN0YW5jZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5maWx0ZXIoKG86IE1vZGFsSW5zdGFuY2UpID0+IG8ubW9kYWwudmlzaWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIG9wZW5lZCBtb2RhbCB3aXRoIGhpZ2hlc3Qgei1pbmRleC5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIG9wZW5lZCBtb2RhbCB3aXRoIGhpZ2hlc3Qgei1pbmRleC5cbiAgICovXG4gIHB1YmxpYyBnZXRUb3BPcGVuZWRNb2RhbCgpOiBOZ3hTbWFydE1vZGFsQ29tcG9uZW50IHtcbiAgICBpZiAoIXRoaXMuZ2V0T3BlbmVkTW9kYWxzKCkubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vZGFsIGlzIG9wZW5lZCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldE9wZW5lZE1vZGFscygpXG4gICAgICAubWFwKChvOiBNb2RhbEluc3RhbmNlKSA9PiBvLm1vZGFsKVxuICAgICAgLnJlZHVjZSgoaGlnaGVzdCwgaXRlbSkgPT4gaXRlbS5sYXllclBvc2l0aW9uID4gaGlnaGVzdC5sYXllclBvc2l0aW9uID8gaXRlbSA6IGhpZ2hlc3QsIHRoaXMuZ2V0T3BlbmVkTW9kYWxzKClbMF0ubW9kYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaGlnaGVyIGB6LWluZGV4YCB2YWx1ZSBiZXR3ZWVuIGFsbCB0aGUgbW9kYWwgaW5zdGFuY2VzLiBJdCBpdGVyYXRlcyBvdmVyIHRoZSBgTW9kYWxTdGFja2AgYXJyYXkgYW5kXG4gICAqIGNhbGN1bGF0ZXMgYSBoaWdoZXIgdmFsdWUgKGl0IHRha2VzIHRoZSBoaWdoZXN0IGluZGV4IHZhbHVlIGJldHdlZW4gYWxsIHRoZSBtb2RhbCBpbnN0YW5jZXMgYW5kIGFkZHMgMSkuXG4gICAqIFVzZSBpdCB0byBtYWtlIGEgbW9kYWwgYXBwZWFyIGZvcmVncm91bmQuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgaGlnaGVyIGluZGV4IGZyb20gYWxsIHRoZSBleGlzdGluZyBtb2RhbCBpbnN0YW5jZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0SGlnaGVySW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGhpcy5fbW9kYWxTdGFjay5tYXAoKG8pID0+IG8ubW9kYWwubGF5ZXJQb3NpdGlvbiksIDEwNDEpICsgMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBnaXZlcyB0aGUgbnVtYmVyIG9mIG1vZGFsIGluc3RhbmNlcy4gSXQncyBoZWxwZnVsIHRvIGtub3cgaWYgdGhlIG1vZGFsIHN0YWNrIGlzIGVtcHR5IG9yIG5vdC5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiBtb2RhbCBpbnN0YW5jZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0TW9kYWxTdGFja0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2subGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIG1vZGFsIGluc3RhbmNlIGZyb20gdGhlIG1vZGFsIHN0YWNrLlxuICAgKiBSZXR1cm5zIHRoZSByZW1vdmVkIG1vZGFsIGluc3RhbmNlIG9yIHVuZGVmaW5lZCBpZiBubyBtb2RhbCB3YXMgZm91bmRcbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBtb2RhbCBpZGVudGlmaWVyLlxuICAgKiBAcmV0dXJucyB0aGUgcmVtb3ZlZCBtb2RhbCBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyByZW1vdmVNb2RhbChpZDogc3RyaW5nKTogdW5kZWZpbmVkIHwgTW9kYWxJbnN0YW5jZSB7XG4gICAgY29uc3QgaTogbnVtYmVyID0gdGhpcy5fbW9kYWxTdGFjay5maW5kSW5kZXgoKG86IGFueSkgPT4gby5pZCA9PT0gaWQpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGFsSW5zdGFuY2UgPSB0aGlzLl9tb2RhbFN0YWNrLnNwbGljZShpLCAxKVswXTtcbiAgICByZXR1cm4gbW9kYWxJbnN0YW5jZTtcbiAgfVxufVxuIl19