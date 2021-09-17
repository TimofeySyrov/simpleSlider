import IModelOptions, { API } from "./interfaces/IModelOptions";
import Controller from "./controller/Controller";
import './view/styles/view.scss';
import { TDomParent } from "./interfaces/namespace";

class SimpleSlider implements API {

  private options: IModelOptions;
  private domParent: TDomParent;
  private controller: Controller;

  constructor (domParent: TDomParent, options: IModelOptions) {
    this.controller = new Controller(domParent, options);
    this.initUserCallbackEvents(options);
  }

  public updateOptions (options: Partial<IModelOptions>): void {
    this.controller.updateOptions(options);
    this.initUserCallbackEvents(options);
  }

  private initUserCallbackEvents(options: IModelOptions) {
    const { onSlide } = options;

    if(onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide)
    }
  }
}

export default SimpleSlider;