import Observer from "../observer/Observer";

import IModelOptions from "../interfaces/IModelOptions";
import sliderClassNames from "./components/utils/sliderClassNames";

import Bar from "./components/bar/bar";
import Ruler from "./components/ruler/ruler";
import Thumb from "./components/thumb/thumb";
import Toggle from "./components/toggle/toggle";

class View extends Observer {
  private modelOptions: IModelOptions;
  private domParent: HTMLDivElement;

  private bar: Bar;
  private toggle: Toggle;
  private thumb: Thumb;
  private ruler: Ruler;

  constructor (domParent: HTMLDivElement, modelOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.modelOptions = modelOptions;
    this.render();
  }

  public updateModelOptions (newModelOptions: IModelOptions) {
    this.modelOptions = newModelOptions;
  }

  private render () {
    this.initViewComponents();
    this.createDOMSlider();
  }

  private initViewComponents () {
    const { withThumb, withRuler } = this.modelOptions;

    this.bar = new Bar();
    this.toggle = new Toggle();

    if(withThumb) {
      this.thumb = new Thumb();
    }
    if(withRuler) {
      this.ruler = new Ruler();
    }
  }

  private createDOMSlider () {
    const templateHtmlSlider = document.createElement('div');
    templateHtmlSlider.classList.add(`${sliderClassNames.slider}`);

    const templateBar = templateHtmlSlider.appendChild(this.bar.getHtml());
    const templateToggle = templateHtmlSlider.appendChild(this.toggle.getHtml());

    if(this.thumb) {
      templateToggle.appendChild(this.thumb.getHtml());
    }

    if(this.ruler) {
      templateHtmlSlider.appendChild(this.ruler.getHtml());
    }
    
    this.domParent.appendChild(templateHtmlSlider);
  }
}

export default View;