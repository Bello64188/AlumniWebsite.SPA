import { Inject, Injectable, SecurityContext } from '@angular/core';
import { ComponentPortal } from '../portal/portal';
import { ToastInjector, ToastRef } from './toast-injector';
import { ToastPackage, TOAST_CONFIG, } from './toastr-config';
import * as i0 from "@angular/core";
import * as i1 from "../overlay/overlay";
import * as i2 from "@angular/platform-browser";
export class ToastrService {
    constructor(token, overlay, _injector, sanitizer, ngZone) {
        this.overlay = overlay;
        this._injector = _injector;
        this.sanitizer = sanitizer;
        this.ngZone = ngZone;
        this.currentlyActive = 0;
        this.toasts = [];
        this.index = 0;
        this.toastrConfig = {
            ...token.default,
            ...token.config,
        };
        if (token.config.iconClasses) {
            this.toastrConfig.iconClasses = {
                ...token.default.iconClasses,
                ...token.config.iconClasses,
            };
        }
    }
    /** show toast */
    show(message, title, override = {}, type = '') {
        return this._preBuildNotification(type, message, title, this.applyConfig(override));
    }
    /** show successful toast */
    success(message, title, override = {}) {
        const type = this.toastrConfig.iconClasses.success || '';
        return this._preBuildNotification(type, message, title, this.applyConfig(override));
    }
    /** show error toast */
    error(message, title, override = {}) {
        const type = this.toastrConfig.iconClasses.error || '';
        return this._preBuildNotification(type, message, title, this.applyConfig(override));
    }
    /** show info toast */
    info(message, title, override = {}) {
        const type = this.toastrConfig.iconClasses.info || '';
        return this._preBuildNotification(type, message, title, this.applyConfig(override));
    }
    /** show warning toast */
    warning(message, title, override = {}) {
        const type = this.toastrConfig.iconClasses.warning || '';
        return this._preBuildNotification(type, message, title, this.applyConfig(override));
    }
    /**
     * Remove all or a single toast by id
     */
    clear(toastId) {
        // Call every toastRef manualClose function
        for (const toast of this.toasts) {
            if (toastId !== undefined) {
                if (toast.toastId === toastId) {
                    toast.toastRef.manualClose();
                    return;
                }
            }
            else {
                toast.toastRef.manualClose();
            }
        }
    }
    /**
     * Remove and destroy a single toast by id
     */
    remove(toastId) {
        const found = this._findToast(toastId);
        if (!found) {
            return false;
        }
        found.activeToast.toastRef.close();
        this.toasts.splice(found.index, 1);
        this.currentlyActive = this.currentlyActive - 1;
        if (!this.toastrConfig.maxOpened || !this.toasts.length) {
            return false;
        }
        if (this.currentlyActive < this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
            const p = this.toasts[this.currentlyActive].toastRef;
            if (!p.isInactive()) {
                this.currentlyActive = this.currentlyActive + 1;
                p.activate();
            }
        }
        return true;
    }
    /**
     * Determines if toast message is already shown
     */
    findDuplicate(title = '', message = '', resetOnDuplicate, countDuplicates) {
        const { includeTitleDuplicates } = this.toastrConfig;
        for (const toast of this.toasts) {
            const hasDuplicateTitle = includeTitleDuplicates && toast.title === title;
            if ((!includeTitleDuplicates || hasDuplicateTitle) && toast.message === message) {
                toast.toastRef.onDuplicate(resetOnDuplicate, countDuplicates);
                return toast;
            }
        }
        return null;
    }
    /** create a clone of global config and apply individual settings */
    applyConfig(override = {}) {
        return { ...this.toastrConfig, ...override };
    }
    /**
     * Find toast object by id
     */
    _findToast(toastId) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].toastId === toastId) {
                return { index: i, activeToast: this.toasts[i] };
            }
        }
        return null;
    }
    /**
     * Determines the need to run inside angular's zone then builds the toast
     */
    _preBuildNotification(toastType, message, title, config) {
        if (config.onActivateTick) {
            return this.ngZone.run(() => this._buildNotification(toastType, message, title, config));
        }
        return this._buildNotification(toastType, message, title, config);
    }
    /**
     * Creates and attaches toast data to component
     * returns the active toast, or in case preventDuplicates is enabled the original/non-duplicate active toast.
     */
    _buildNotification(toastType, message, title, config) {
        if (!config.toastComponent) {
            throw new Error('toastComponent required');
        }
        // max opened and auto dismiss = true
        // if timeout = 0 resetting it would result in setting this.hideTime = Date.now(). Hence, we only want to reset timeout if there is
        // a timeout at all
        const duplicate = this.findDuplicate(title, message, this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0, this.toastrConfig.countDuplicates);
        if (((this.toastrConfig.includeTitleDuplicates && title) || message) &&
            this.toastrConfig.preventDuplicates &&
            duplicate !== null) {
            return duplicate;
        }
        this.previousToastMessage = message;
        let keepInactive = false;
        if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
            keepInactive = true;
            if (this.toastrConfig.autoDismiss) {
                this.clear(this.toasts[0].toastId);
            }
        }
        const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
        this.index = this.index + 1;
        let sanitizedMessage = message;
        if (message && config.enableHtml) {
            sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
        }
        const toastRef = new ToastRef(overlayRef);
        const toastPackage = new ToastPackage(this.index, config, sanitizedMessage, title, toastType, toastRef);
        const toastInjector = new ToastInjector(toastPackage, this._injector);
        const component = new ComponentPortal(config.toastComponent, toastInjector);
        const portal = overlayRef.attach(component, this.toastrConfig.newestOnTop);
        toastRef.componentInstance = portal.instance;
        const ins = {
            toastId: this.index,
            title: title || '',
            message: message || '',
            toastRef,
            onShown: toastRef.afterActivate(),
            onHidden: toastRef.afterClosed(),
            onTap: toastPackage.onTap(),
            onAction: toastPackage.onAction(),
            portal,
        };
        if (!keepInactive) {
            this.currentlyActive = this.currentlyActive + 1;
            setTimeout(() => {
                ins.toastRef.activate();
            });
        }
        this.toasts.push(ins);
        return ins;
    }
}
ToastrService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ToastrService, deps: [{ token: TOAST_CONFIG }, { token: i1.Overlay }, { token: i0.Injector }, { token: i2.DomSanitizer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
ToastrService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ToastrService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ToastrService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [TOAST_CONFIG]
                }] }, { type: i1.Overlay }, { type: i0.Injector }, { type: i2.DomSanitizer }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3RyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3RvYXN0ci90b2FzdHIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWdCLE1BQU0sRUFBRSxVQUFVLEVBQW9CLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU1wRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUUzRCxPQUFPLEVBR0wsWUFBWSxFQUVaLFlBQVksR0FDYixNQUFNLGlCQUFpQixDQUFDOzs7O0FBd0J6QixNQUFNLE9BQU8sYUFBYTtJQVF4QixZQUN3QixLQUFpQixFQUMvQixPQUFnQixFQUNoQixTQUFtQixFQUNuQixTQUF1QixFQUN2QixNQUFjO1FBSGQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDdkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVh4QixvQkFBZSxHQUFHLENBQUMsQ0FBQztRQUNwQixXQUFNLEdBQXVCLEVBQUUsQ0FBQztRQUd4QixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBU2hCLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsR0FBRyxLQUFLLENBQUMsT0FBTztZQUNoQixHQUFHLEtBQUssQ0FBQyxNQUFNO1NBQ2hCLENBQUM7UUFDRixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHO2dCQUM5QixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDNUIsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVc7YUFDNUIsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUNELGlCQUFpQjtJQUNq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VUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7OzBHQTNOVSxhQUFhLGtCQVNkLFlBQVk7OEdBVFgsYUFBYSxjQURBLE1BQU07MkZBQ25CLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFVN0IsTUFBTTsyQkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBJbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBOZ1pvbmUsIFNlY3VyaXR5Q29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJy4uL292ZXJsYXkvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICcuLi9wb3J0YWwvcG9ydGFsJztcbmltcG9ydCB7IFRvYXN0SW5qZWN0b3IsIFRvYXN0UmVmIH0gZnJvbSAnLi90b2FzdC1pbmplY3Rvcic7XG5pbXBvcnQgeyBUb2FzdENvbnRhaW5lckRpcmVjdGl2ZSB9IGZyb20gJy4vdG9hc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7XG4gIEdsb2JhbENvbmZpZyxcbiAgSW5kaXZpZHVhbENvbmZpZyxcbiAgVG9hc3RQYWNrYWdlLFxuICBUb2FzdFRva2VuLFxuICBUT0FTVF9DT05GSUcsXG59IGZyb20gJy4vdG9hc3RyLWNvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aXZlVG9hc3Q8Qz4ge1xuICAvKiogWW91ciBUb2FzdCBJRC4gVXNlIHRoaXMgdG8gY2xvc2UgaXQgaW5kaXZpZHVhbGx5ICovXG4gIHRvYXN0SWQ6IG51bWJlcjtcbiAgLyoqIHRoZSB0aXRsZSBvZiB5b3VyIHRvYXN0LiBTdG9yZWQgdG8gcHJldmVudCBkdXBsaWNhdGVzICovXG4gIHRpdGxlOiBzdHJpbmc7XG4gIC8qKiB0aGUgbWVzc2FnZSBvZiB5b3VyIHRvYXN0LiBTdG9yZWQgdG8gcHJldmVudCBkdXBsaWNhdGVzICovXG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgLyoqIGEgcmVmZXJlbmNlIHRvIHRoZSBjb21wb25lbnQgc2VlIHBvcnRhbC50cyAqL1xuICBwb3J0YWw6IENvbXBvbmVudFJlZjxDPjtcbiAgLyoqIGEgcmVmZXJlbmNlIHRvIHlvdXIgdG9hc3QgKi9cbiAgdG9hc3RSZWY6IFRvYXN0UmVmPEM+O1xuICAvKiogdHJpZ2dlcmVkIHdoZW4gdG9hc3QgaXMgYWN0aXZlICovXG4gIG9uU2hvd246IE9ic2VydmFibGU8dm9pZD47XG4gIC8qKiB0cmlnZ2VyZWQgd2hlbiB0b2FzdCBpcyBkZXN0cm95ZWQgKi9cbiAgb25IaWRkZW46IE9ic2VydmFibGU8dm9pZD47XG4gIC8qKiB0cmlnZ2VyZWQgb24gdG9hc3QgY2xpY2sgKi9cbiAgb25UYXA6IE9ic2VydmFibGU8dm9pZD47XG4gIC8qKiBhdmFpbGFibGUgZm9yIHlvdXIgdXNlIGluIGN1c3RvbSB0b2FzdCAqL1xuICBvbkFjdGlvbjogT2JzZXJ2YWJsZTxhbnk+O1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFRvYXN0clNlcnZpY2Uge1xuICB0b2FzdHJDb25maWc6IEdsb2JhbENvbmZpZztcbiAgY3VycmVudGx5QWN0aXZlID0gMDtcbiAgdG9hc3RzOiBBY3RpdmVUb2FzdDxhbnk+W10gPSBbXTtcbiAgb3ZlcmxheUNvbnRhaW5lcj86IFRvYXN0Q29udGFpbmVyRGlyZWN0aXZlO1xuICBwcmV2aW91c1RvYXN0TWVzc2FnZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGluZGV4ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFRPQVNUX0NPTkZJRykgdG9rZW46IFRvYXN0VG9rZW4sXG4gICAgcHJpdmF0ZSBvdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICkge1xuICAgIHRoaXMudG9hc3RyQ29uZmlnID0ge1xuICAgICAgLi4udG9rZW4uZGVmYXVsdCxcbiAgICAgIC4uLnRva2VuLmNvbmZpZyxcbiAgICB9O1xuICAgIGlmICh0b2tlbi5jb25maWcuaWNvbkNsYXNzZXMpIHtcbiAgICAgIHRoaXMudG9hc3RyQ29uZmlnLmljb25DbGFzc2VzID0ge1xuICAgICAgICAuLi50b2tlbi5kZWZhdWx0Lmljb25DbGFzc2VzLFxuICAgICAgICAuLi50b2tlbi5jb25maWcuaWNvbkNsYXNzZXMsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICAvKiogc2hvdyB0b2FzdCAqL1xuICBzaG93KG1lc3NhZ2U/OiBzdHJpbmcsIHRpdGxlPzogc3RyaW5nLCBvdmVycmlkZTogUGFydGlhbDxJbmRpdmlkdWFsQ29uZmlnPiA9IHt9LCB0eXBlID0gJycpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJlQnVpbGROb3RpZmljYXRpb24odHlwZSwgbWVzc2FnZSwgdGl0bGUsIHRoaXMuYXBwbHlDb25maWcob3ZlcnJpZGUpKTtcbiAgfVxuICAvKiogc2hvdyBzdWNjZXNzZnVsIHRvYXN0ICovXG4gIHN1Y2Nlc3MobWVzc2FnZT86IHN0cmluZywgdGl0bGU/OiBzdHJpbmcsIG92ZXJyaWRlOiBQYXJ0aWFsPEluZGl2aWR1YWxDb25maWc+ID0ge30pIHtcbiAgICBjb25zdCB0eXBlID0gdGhpcy50b2FzdHJDb25maWcuaWNvbkNsYXNzZXMuc3VjY2VzcyB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5fcHJlQnVpbGROb3RpZmljYXRpb24odHlwZSwgbWVzc2FnZSwgdGl0bGUsIHRoaXMuYXBwbHlDb25maWcob3ZlcnJpZGUpKTtcbiAgfVxuICAvKiogc2hvdyBlcnJvciB0b2FzdCAqL1xuICBlcnJvcihtZXNzYWdlPzogc3RyaW5nLCB0aXRsZT86IHN0cmluZywgb3ZlcnJpZGU6IFBhcnRpYWw8SW5kaXZpZHVhbENvbmZpZz4gPSB7fSkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnRvYXN0ckNvbmZpZy5pY29uQ2xhc3Nlcy5lcnJvciB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5fcHJlQnVpbGROb3RpZmljYXRpb24odHlwZSwgbWVzc2FnZSwgdGl0bGUsIHRoaXMuYXBwbHlDb25maWcob3ZlcnJpZGUpKTtcbiAgfVxuICAvKiogc2hvdyBpbmZvIHRvYXN0ICovXG4gIGluZm8obWVzc2FnZT86IHN0cmluZywgdGl0bGU/OiBzdHJpbmcsIG92ZXJyaWRlOiBQYXJ0aWFsPEluZGl2aWR1YWxDb25maWc+ID0ge30pIHtcbiAgICBjb25zdCB0eXBlID0gdGhpcy50b2FzdHJDb25maWcuaWNvbkNsYXNzZXMuaW5mbyB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5fcHJlQnVpbGROb3RpZmljYXRpb24odHlwZSwgbWVzc2FnZSwgdGl0bGUsIHRoaXMuYXBwbHlDb25maWcob3ZlcnJpZGUpKTtcbiAgfVxuICAvKiogc2hvdyB3YXJuaW5nIHRvYXN0ICovXG4gIHdhcm5pbmcobWVzc2FnZT86IHN0cmluZywgdGl0bGU/OiBzdHJpbmcsIG92ZXJyaWRlOiBQYXJ0aWFsPEluZGl2aWR1YWxDb25maWc+ID0ge30pIHtcbiAgICBjb25zdCB0eXBlID0gdGhpcy50b2FzdHJDb25maWcuaWNvbkNsYXNzZXMud2FybmluZyB8fCAnJztcbiAgICByZXR1cm4gdGhpcy5fcHJlQnVpbGROb3RpZmljYXRpb24odHlwZSwgbWVzc2FnZSwgdGl0bGUsIHRoaXMuYXBwbHlDb25maWcob3ZlcnJpZGUpKTtcbiAgfVxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBvciBhIHNpbmdsZSB0b2FzdCBieSBpZFxuICAgKi9cbiAgY2xlYXIodG9hc3RJZD86IG51bWJlcikge1xuICAgIC8vIENhbGwgZXZlcnkgdG9hc3RSZWYgbWFudWFsQ2xvc2UgZnVuY3Rpb25cbiAgICBmb3IgKGNvbnN0IHRvYXN0IG9mIHRoaXMudG9hc3RzKSB7XG4gICAgICBpZiAodG9hc3RJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0b2FzdC50b2FzdElkID09PSB0b2FzdElkKSB7XG4gICAgICAgICAgdG9hc3QudG9hc3RSZWYubWFudWFsQ2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvYXN0LnRvYXN0UmVmLm1hbnVhbENsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZW1vdmUgYW5kIGRlc3Ryb3kgYSBzaW5nbGUgdG9hc3QgYnkgaWRcbiAgICovXG4gIHJlbW92ZSh0b2FzdElkOiBudW1iZXIpIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuX2ZpbmRUb2FzdCh0b2FzdElkKTtcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvdW5kLmFjdGl2ZVRvYXN0LnRvYXN0UmVmLmNsb3NlKCk7XG4gICAgdGhpcy50b2FzdHMuc3BsaWNlKGZvdW5kLmluZGV4LCAxKTtcbiAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZSA9IHRoaXMuY3VycmVudGx5QWN0aXZlIC0gMTtcbiAgICBpZiAoIXRoaXMudG9hc3RyQ29uZmlnLm1heE9wZW5lZCB8fCAhdGhpcy50b2FzdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLmN1cnJlbnRseUFjdGl2ZSA8IHRoaXMudG9hc3RyQ29uZmlnLm1heE9wZW5lZCAmJiB0aGlzLnRvYXN0c1t0aGlzLmN1cnJlbnRseUFjdGl2ZV0pIHtcbiAgICAgIGNvbnN0IHAgPSB0aGlzLnRvYXN0c1t0aGlzLmN1cnJlbnRseUFjdGl2ZV0udG9hc3RSZWY7XG4gICAgICBpZiAoIXAuaXNJbmFjdGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudGx5QWN0aXZlID0gdGhpcy5jdXJyZW50bHlBY3RpdmUgKyAxO1xuICAgICAgICBwLmFjdGl2YXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdG9hc3QgbWVzc2FnZSBpcyBhbHJlYWR5IHNob3duXG4gICAqL1xuICBmaW5kRHVwbGljYXRlKHRpdGxlID0gJycsIG1lc3NhZ2UgPSAnJywgcmVzZXRPbkR1cGxpY2F0ZTogYm9vbGVhbiwgY291bnREdXBsaWNhdGVzOiBib29sZWFuKSB7XG4gICAgY29uc3QgeyBpbmNsdWRlVGl0bGVEdXBsaWNhdGVzIH0gPSB0aGlzLnRvYXN0ckNvbmZpZztcblxuICAgIGZvciAoY29uc3QgdG9hc3Qgb2YgdGhpcy50b2FzdHMpIHtcbiAgICAgIGNvbnN0IGhhc0R1cGxpY2F0ZVRpdGxlID0gaW5jbHVkZVRpdGxlRHVwbGljYXRlcyAmJiB0b2FzdC50aXRsZSA9PT0gdGl0bGU7XG4gICAgICBpZiAoKCFpbmNsdWRlVGl0bGVEdXBsaWNhdGVzIHx8IGhhc0R1cGxpY2F0ZVRpdGxlKSAmJiB0b2FzdC5tZXNzYWdlID09PSBtZXNzYWdlKSB7XG4gICAgICAgIHRvYXN0LnRvYXN0UmVmLm9uRHVwbGljYXRlKHJlc2V0T25EdXBsaWNhdGUsIGNvdW50RHVwbGljYXRlcyk7XG4gICAgICAgIHJldHVybiB0b2FzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBjcmVhdGUgYSBjbG9uZSBvZiBnbG9iYWwgY29uZmlnIGFuZCBhcHBseSBpbmRpdmlkdWFsIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXBwbHlDb25maWcob3ZlcnJpZGU6IFBhcnRpYWw8SW5kaXZpZHVhbENvbmZpZz4gPSB7fSk6IEdsb2JhbENvbmZpZyB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy50b2FzdHJDb25maWcsIC4uLm92ZXJyaWRlIH07XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0b2FzdCBvYmplY3QgYnkgaWRcbiAgICovXG4gIHByaXZhdGUgX2ZpbmRUb2FzdCh0b2FzdElkOiBudW1iZXIpOiB7IGluZGV4OiBudW1iZXI7IGFjdGl2ZVRvYXN0OiBBY3RpdmVUb2FzdDxhbnk+IH0gfCBudWxsIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9hc3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy50b2FzdHNbaV0udG9hc3RJZCA9PT0gdG9hc3RJZCkge1xuICAgICAgICByZXR1cm4geyBpbmRleDogaSwgYWN0aXZlVG9hc3Q6IHRoaXMudG9hc3RzW2ldIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIG5lZWQgdG8gcnVuIGluc2lkZSBhbmd1bGFyJ3Mgem9uZSB0aGVuIGJ1aWxkcyB0aGUgdG9hc3RcbiAgICovXG4gIHByaXZhdGUgX3ByZUJ1aWxkTm90aWZpY2F0aW9uKFxuICAgIHRvYXN0VHlwZTogc3RyaW5nLFxuICAgIG1lc3NhZ2U6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIGNvbmZpZzogR2xvYmFsQ29uZmlnLFxuICApOiBBY3RpdmVUb2FzdDxhbnk+IHwgbnVsbCB7XG4gICAgaWYgKGNvbmZpZy5vbkFjdGl2YXRlVGljaykge1xuICAgICAgcmV0dXJuIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLl9idWlsZE5vdGlmaWNhdGlvbih0b2FzdFR5cGUsIG1lc3NhZ2UsIHRpdGxlLCBjb25maWcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2J1aWxkTm90aWZpY2F0aW9uKHRvYXN0VHlwZSwgbWVzc2FnZSwgdGl0bGUsIGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbmQgYXR0YWNoZXMgdG9hc3QgZGF0YSB0byBjb21wb25lbnRcbiAgICogcmV0dXJucyB0aGUgYWN0aXZlIHRvYXN0LCBvciBpbiBjYXNlIHByZXZlbnREdXBsaWNhdGVzIGlzIGVuYWJsZWQgdGhlIG9yaWdpbmFsL25vbi1kdXBsaWNhdGUgYWN0aXZlIHRvYXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfYnVpbGROb3RpZmljYXRpb24oXG4gICAgdG9hc3RUeXBlOiBzdHJpbmcsXG4gICAgbWVzc2FnZTogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHRpdGxlOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgY29uZmlnOiBHbG9iYWxDb25maWcsXG4gICk6IEFjdGl2ZVRvYXN0PGFueT4gfCBudWxsIHtcbiAgICBpZiAoIWNvbmZpZy50b2FzdENvbXBvbmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0b2FzdENvbXBvbmVudCByZXF1aXJlZCcpO1xuICAgIH1cbiAgICAvLyBtYXggb3BlbmVkIGFuZCBhdXRvIGRpc21pc3MgPSB0cnVlXG4gICAgLy8gaWYgdGltZW91dCA9IDAgcmVzZXR0aW5nIGl0IHdvdWxkIHJlc3VsdCBpbiBzZXR0aW5nIHRoaXMuaGlkZVRpbWUgPSBEYXRlLm5vdygpLiBIZW5jZSwgd2Ugb25seSB3YW50IHRvIHJlc2V0IHRpbWVvdXQgaWYgdGhlcmUgaXNcbiAgICAvLyBhIHRpbWVvdXQgYXQgYWxsXG4gICAgY29uc3QgZHVwbGljYXRlID0gdGhpcy5maW5kRHVwbGljYXRlKFxuICAgICAgdGl0bGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgdGhpcy50b2FzdHJDb25maWcucmVzZXRUaW1lb3V0T25EdXBsaWNhdGUgJiYgY29uZmlnLnRpbWVPdXQgPiAwLFxuICAgICAgdGhpcy50b2FzdHJDb25maWcuY291bnREdXBsaWNhdGVzLFxuICAgICk7XG4gICAgaWYgKFxuICAgICAgKCh0aGlzLnRvYXN0ckNvbmZpZy5pbmNsdWRlVGl0bGVEdXBsaWNhdGVzICYmIHRpdGxlKSB8fCBtZXNzYWdlKSAmJlxuICAgICAgdGhpcy50b2FzdHJDb25maWcucHJldmVudER1cGxpY2F0ZXMgJiZcbiAgICAgIGR1cGxpY2F0ZSAhPT0gbnVsbFxuICAgICkge1xuICAgICAgcmV0dXJuIGR1cGxpY2F0ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpb3VzVG9hc3RNZXNzYWdlID0gbWVzc2FnZTtcbiAgICBsZXQga2VlcEluYWN0aXZlID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudG9hc3RyQ29uZmlnLm1heE9wZW5lZCAmJiB0aGlzLmN1cnJlbnRseUFjdGl2ZSA+PSB0aGlzLnRvYXN0ckNvbmZpZy5tYXhPcGVuZWQpIHtcbiAgICAgIGtlZXBJbmFjdGl2ZSA9IHRydWU7XG4gICAgICBpZiAodGhpcy50b2FzdHJDb25maWcuYXV0b0Rpc21pc3MpIHtcbiAgICAgICAgdGhpcy5jbGVhcih0aGlzLnRvYXN0c1swXS50b2FzdElkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5vdmVybGF5LmNyZWF0ZShjb25maWcucG9zaXRpb25DbGFzcywgdGhpcy5vdmVybGF5Q29udGFpbmVyKTtcbiAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgbGV0IHNhbml0aXplZE1lc3NhZ2U6IHN0cmluZyB8IHVuZGVmaW5lZCB8IG51bGwgPSBtZXNzYWdlO1xuICAgIGlmIChtZXNzYWdlICYmIGNvbmZpZy5lbmFibGVIdG1sKSB7XG4gICAgICBzYW5pdGl6ZWRNZXNzYWdlID0gdGhpcy5zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvYXN0UmVmID0gbmV3IFRvYXN0UmVmKG92ZXJsYXlSZWYpO1xuICAgIGNvbnN0IHRvYXN0UGFja2FnZSA9IG5ldyBUb2FzdFBhY2thZ2UoXG4gICAgICB0aGlzLmluZGV4LFxuICAgICAgY29uZmlnLFxuICAgICAgc2FuaXRpemVkTWVzc2FnZSxcbiAgICAgIHRpdGxlLFxuICAgICAgdG9hc3RUeXBlLFxuICAgICAgdG9hc3RSZWYsXG4gICAgKTtcbiAgICBjb25zdCB0b2FzdEluamVjdG9yID0gbmV3IFRvYXN0SW5qZWN0b3IodG9hc3RQYWNrYWdlLCB0aGlzLl9pbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudFBvcnRhbChjb25maWcudG9hc3RDb21wb25lbnQsIHRvYXN0SW5qZWN0b3IpO1xuICAgIGNvbnN0IHBvcnRhbCA9IG92ZXJsYXlSZWYuYXR0YWNoKGNvbXBvbmVudCwgdGhpcy50b2FzdHJDb25maWcubmV3ZXN0T25Ub3ApO1xuICAgIHRvYXN0UmVmLmNvbXBvbmVudEluc3RhbmNlID0gcG9ydGFsLmluc3RhbmNlO1xuICAgIGNvbnN0IGluczogQWN0aXZlVG9hc3Q8YW55PiA9IHtcbiAgICAgIHRvYXN0SWQ6IHRoaXMuaW5kZXgsXG4gICAgICB0aXRsZTogdGl0bGUgfHwgJycsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlIHx8ICcnLFxuICAgICAgdG9hc3RSZWYsXG4gICAgICBvblNob3duOiB0b2FzdFJlZi5hZnRlckFjdGl2YXRlKCksXG4gICAgICBvbkhpZGRlbjogdG9hc3RSZWYuYWZ0ZXJDbG9zZWQoKSxcbiAgICAgIG9uVGFwOiB0b2FzdFBhY2thZ2Uub25UYXAoKSxcbiAgICAgIG9uQWN0aW9uOiB0b2FzdFBhY2thZ2Uub25BY3Rpb24oKSxcbiAgICAgIHBvcnRhbCxcbiAgICB9O1xuXG4gICAgaWYgKCFrZWVwSW5hY3RpdmUpIHtcbiAgICAgIHRoaXMuY3VycmVudGx5QWN0aXZlID0gdGhpcy5jdXJyZW50bHlBY3RpdmUgKyAxO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlucy50b2FzdFJlZi5hY3RpdmF0ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50b2FzdHMucHVzaChpbnMpO1xuICAgIHJldHVybiBpbnM7XG4gIH1cbn1cbiJdfQ==