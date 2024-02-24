export default class NonLinearCreative {
    constructor(rmpVast: any);
    _rmpVast: any;
    _params: any;
    _adContainer: any;
    _container: any;
    _nonLinearMinSuggestedDuration: number;
    _firstContentPlayerPlayRequest: boolean;
    _nonLinearCloseElement: HTMLDivElement;
    _nonLinearAElement: HTMLAnchorElement;
    _nonLinearInnerElement: HTMLImageElement | HTMLIFrameElement;
    _nonLinearContainerElement: HTMLDivElement;
    _onNonLinearLoadSuccessFn: any;
    _onNonLinearLoadErrorFn: any;
    _onNonLinearClickThroughFn: any;
    _onClickCloseNonLinearFn: any;
    get nonLinearContainerElement(): HTMLDivElement;
    _onNonLinearLoadError(): void;
    _onNonLinearLoadSuccess(): void;
    _onNonLinearClickThrough(event: any): void;
    _onClickCloseNonLinear(event: any): void;
    _appendCloseButton(): void;
    destroy(): void;
    update(): void;
    parse(variations: any): void;
}
//# sourceMappingURL=non-linear.d.ts.map