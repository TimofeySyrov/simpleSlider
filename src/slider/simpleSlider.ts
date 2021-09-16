import IModelOptions from "./interfaces/IModelOptions";
import Controller from "./controller/Controller";
import './view/styles/view.scss';
import { TDomParent } from "./interfaces/namespace";

class SimpleSlider {

  private options: IModelOptions;
  private domParent: TDomParent;
  private controller: Controller;

  constructor (domParent: TDomParent, options: IModelOptions) {
    this.domParent = domParent
    this.options = options;
    this.controller = new Controller(this.domParent, this.options);
    this.initUserCallbackEvents();
  }

  private initUserCallbackEvents() {
    const onSlide = this.options.onSlide;

    if(onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide)
    }
  }
  
}

export default SimpleSlider;