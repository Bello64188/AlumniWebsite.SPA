import { ModuleWithProviders } from '@angular/core';
import { ApplicationRef, OnDestroy } from '@angular/core';
import { GlobalConfig, IndividualConfig, ToastPackage } from './toastr-config';
import { ToastrService } from './toastr.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class ToastNoAnimation implements OnDestroy {
    protected toastrService: ToastrService;
    toastPackage: ToastPackage;
    protected appRef: ApplicationRef;
    message?: string | null;
    title?: string;
    options: IndividualConfig;
    duplicatesCount: number;
    originalTimeout: number;
    /** width of progress bar */
    width: number;
    /** a combination of toast type and options.toastClass */
    toastClasses: string;
    /** hides component when waiting to be displayed */
    get displayStyle(): string;
    /** controls animation */
    state: string;
    private timeout;
    private intervalId;
    private hideTime;
    private sub;
    private sub1;
    private sub2;
    private sub3;
    constructor(toastrService: ToastrService, toastPackage: ToastPackage, appRef: ApplicationRef);
    ngOnDestroy(): void;
    /**
     * activates toast and sets timeout
     */
    activateToast(): void;
    /**
     * updates progress bar width
     */
    updateProgress(): void;
    resetTimeout(): void;
    /**
     * tells toastrService to remove this toast after animation time
     */
    remove(): void;
    tapToast(): void;
    stickAround(): void;
    delayedHideToast(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastNoAnimation, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToastNoAnimation, "[toast-component]", never, {}, {}, never, never, false>;
}
export declare const DefaultNoAnimationsGlobalConfig: GlobalConfig;
export declare class ToastNoAnimationModule {
    static forRoot(config?: Partial<GlobalConfig>): ModuleWithProviders<ToastNoAnimationModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastNoAnimationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ToastNoAnimationModule, [typeof ToastNoAnimation], [typeof i1.CommonModule], [typeof ToastNoAnimation]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ToastNoAnimationModule>;
}
