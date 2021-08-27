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

  private getToggles () {
    const { currentValue, withThumb } = this.modelOptions;

    if(typeof currentValue === 'object') {

    }
  }

  private createDOMSlider () {
    const { orientation, withDoubleHandle } = this.modelOptions;
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

    if(orientation === 'vertical') {
      this.bar.getDom().classList.add(`${sliderClassNames.barVertical}`);
      this.toggle.getDom().classList.add(`${sliderClassNames.toggleVertical}`);
      this.thumb.getDom().classList.add(`${sliderClassNames.thumbVertical}`);
    }

    this.domParent.appendChild(templateHtmlSlider);
    this.bar.getDom().addEventListener("click", this.setClickPosition.bind(this));
  }

  private getCurrentValuePosition (currentValue: number): number {
    const { min, max } = this.modelOptions;
    const percentPosition = (currentValue - min) / (max - min);
    return percentPosition;
  }

  private getBarLength (): number {
    const { orientation } = this.modelOptions;

    if(orientation == 'horizontal') {
      return this.bar.getDom().offsetWidth;
    }
    if(orientation == 'vertical') {
      return this.bar.getDom().offsetHeight;
    }
  }

  private getBarPositionStart (): number {
    const { orientation } = this.modelOptions;

    if(orientation == 'horizontal') {
      return this.bar.getDom().getBoundingClientRect().x;
    }
    if(orientation == 'vertical') {
      return this.bar.getDom().getBoundingClientRect().y;
    }
  }

  private getClickCurrentValue (percent: number) {
    const { min, max, step } = this.modelOptions;
    const currentValue = step * Math.round(percent * (max - min) / step) + min;

    return currentValue;
  }

  private getClickPercentPosition (event: MouseEvent): number {
    const { orientation } = this.modelOptions;
    const barLength = this.getBarLength();
    const barPositionStart = this.getBarPositionStart();
    const clickPosition = orientation == 'horizontal' ? event.pageX : event.pageY;
    const pixelPosition = clickPosition - barPositionStart;
    const percentPosition = pixelPosition / barLength;

    return percentPosition;
  }

  private setScalePercentPosition (percent: number) {
    const { orientation } = this.modelOptions; 
    const scale = this.bar.getDom().querySelector(`.${sliderClassNames.barScale}`);

    if(orientation === 'horizontal') {
      scale.setAttribute("style", `transform: scale(${percent}, 1);`);
    }
    if(orientation === 'vertical') {
      scale.setAttribute("style", `transform: scale(1, ${percent});`);
    }
    
  }

  private setTogglePercentPosition (percent: number) {
    const { orientation } = this.modelOptions;
    const transformOrientation = orientation == 'horizontal' ? 'X' : 'Y';
    const transformPercent = percent * 1000;
    const toggle = this.toggle.getDom();
    
    toggle.setAttribute("style", `transform: translate${transformOrientation}(${transformPercent}%);`);
  }

  private setThumbCurrentValue (currentValue: number) {
    const thumb = this.thumb.getDom().innerHTML = `${currentValue}`;
  }

  private setClickPosition (event: MouseEvent) {
    const percentPosition = this.getClickPercentPosition(event);
    const currentValue = this.getClickCurrentValue(percentPosition);

    this.setTogglePercentPosition(percentPosition);
    this.setScalePercentPosition(percentPosition);
    this.setThumbCurrentValue(currentValue);
  }
  
}

export default View;