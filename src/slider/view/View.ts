import Observer from "../observer/Observer";

import IModelOptions from "../interfaces/IModelOptions";
import sliderClassNames from "./components/utils/sliderClassNames";

import Range from "./components/range/range";
import Toggle from "./components/toggle/toggle";
import Thumb from "./components/thumb/thumb";
import Scale from "./components/scale/scale";
import Bar from "./components/bar/bar";
import ISliderNodes, { TDomParent } from "../interfaces/view/ISliderNodes";

class View extends Observer {

  private modelOptions: IModelOptions;
  private domParent: HTMLDivElement;
  private nodes: ISliderNodes;

  constructor (domParent: HTMLDivElement, modelOptions: IModelOptions) {
    super();

    this.modelOptions = modelOptions;
    this.initSubView(domParent);
  }

  public updateModelOptions (newModelOptions: IModelOptions) {
    this.modelOptions = newModelOptions;
    this.render();
  }

  private initSubView (newDomParent: TDomParent) {

    this.nodes = {
      domParent: newDomParent,
      slider: document.createElement('div'),
      bar: new Bar().getDom(),
      range: new Range().getDom(),
      from: {
        handle: new Toggle().createDom(),
        thumb: new Thumb().createDom()
      },
      to: {
        handle: new Toggle().createDom(),
        thumb: new Thumb().createDom()
      },
      scale: new Scale().getDom()
    }

    this.render();
    this.setModelOptions();
    this.initSubViewListeners();
  }

  private render () {
    const { type, withRange, withThumb, withScale } = this.modelOptions;
    const nodes = this.nodes;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';

    this.renderSubViewStyles();

    nodes.domParent.appendChild(nodes.slider);
    nodes.slider.appendChild(nodes.bar);

    if(withRange) {
      nodes.bar.appendChild(nodes.range);
    }

    if(withScale) {
      nodes.slider.appendChild(nodes.scale)
    }

    if(withThumb) {
      nodes.from.handle.appendChild(nodes.from.thumb);

      if(isRange) {
        nodes.to.handle.appendChild(nodes.to.thumb);
      }
    }

    if(isFromStart || isFromEnd) {
      nodes.bar.appendChild(nodes.from.handle)
    }

    if(isRange) {
      nodes.bar.appendChild(nodes.from.handle)
      nodes.bar.appendChild(nodes.to.handle)
    }
  }

  private renderSubViewStyles () {
    const { orientation } = this.modelOptions;
    const nodes = this.nodes;

    nodes.slider.setAttribute('class', `${sliderClassNames.slider}`);
    nodes.from.handle.setAttribute('data-index', `0`);
    nodes.to.handle.setAttribute('data-index', `1`);
    
    nodes.bar.classList.add(`${sliderClassNames.bar[orientation]}`);
    nodes.range.classList.add(`${sliderClassNames.range[orientation]}`);
    nodes.from.handle.classList.add(`${sliderClassNames.toggle[orientation]}`);
    nodes.from.thumb.classList.add(`${sliderClassNames.thumb[orientation]}`);
    nodes.to.handle.classList.add(`${sliderClassNames.toggle[orientation]}`);
    nodes.to.thumb.classList.add(`${sliderClassNames.thumb[orientation]}`);
    nodes.scale.classList.add(`${sliderClassNames.scale[orientation]}`);
  }

  private initSubViewListeners () {
    const nodes = this.nodes;
    nodes.bar.addEventListener("click", this.eventMouseClick.bind(this));
  }

  private setModelOptions () {
    const { currentValue, type } = this.modelOptions;
    const nodes = this.nodes;

    if(typeof currentValue == 'object') {
      this.setTogglePosition(nodes.from.handle, this.getPercentFromValue(currentValue.min));
      if(type === 'range') {
        this.setTogglePosition(nodes.to.handle, this.getPercentFromValue(currentValue.max));
      }
      this.setRangePosition();
    }
    if(typeof currentValue == 'number') {
      this.setTogglePosition(nodes.from.handle, this.getPercentFromValue(currentValue));
      if(type === 'range') {
        this.setTogglePosition(nodes.to.handle, this.getPercentFromValue(currentValue));
      }
      this.setRangePosition();
    }
  }

  private eventMouseClick (event: MouseEvent) {
    const percent = this.getClickPercentPosition(event);
    this.setClickPosition(percent);
  }

  private setLastToggle (toggle: HTMLElement) {
    const { type } = this.modelOptions;
    const nodes = this.nodes;
    const isRange = type === 'range';
    const lastActiveClassName = `${sliderClassNames.toggle.main}` + `_last-active`;

    if(!toggle.classList.contains(`${lastActiveClassName}`)) {
      nodes.from.handle.classList.remove(`${lastActiveClassName}`);

      if(isRange) {
        nodes.to.handle.classList.remove(`${lastActiveClassName}`);
      }

      toggle.classList.add(`${lastActiveClassName}`)
    }
  }

  private getBarLength ():number {
    const { orientation } = this.modelOptions;
    const nodes = this.nodes;
    const lengthType = orientation === 'vertical' ? `offsetHeight` : `offsetWidth`;
    const length = nodes.bar[lengthType];

    return length;
  }

  private getBarOffset():number {
    const { orientation, type } = this.modelOptions;
    const nodes = this.nodes;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const offsetSide = horizontal ? fromEnd ? `right` : `left` : fromStart ? `top` : `bottom`;
    const offset = nodes.bar.getBoundingClientRect()[offsetSide];

    return offset;
  }

  private getClickPercentPosition (event: MouseEvent) {
    const { orientation, type, max } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const clickPosition = horizontal ? event.pageX : event.pageY;
    const barLength = this.getBarLength();
    const barOffset = this.getBarOffset();
    let pixelPosition: number;

    if(horizontal) {
      pixelPosition = fromEnd ? (barOffset - clickPosition) : (clickPosition - barOffset);
    }
    if(!horizontal) {
      pixelPosition = fromStart ? (clickPosition - barOffset) : (barOffset - clickPosition);
    }
    
    const percentPosition = (pixelPosition / barLength) * 100;

    return percentPosition;
  }

  private getPercentFromValue (value: number): number {
    const { orientation, max, type } = this.modelOptions;
    const valuePercent = (value / max) * 100;
    const final = orientation === 'horizontal' ? valuePercent : type === 'from-end' ? 100 - valuePercent : valuePercent;

    return final;
  }

  private getTogglePosition (toggle: HTMLElement): number {
    const { orientation, type, max } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const offsetType = horizontal ? 'offsetLeft' : 'offsetTop';
    const toggleSize = horizontal ? 'offsetWidth' : 'offsetHeight';
    const barLength = this.getBarLength();
    const pixelPosition = toggle[offsetType] + (toggle[toggleSize] / 2);
    const percentPosition = (pixelPosition / barLength) * 100;
    const final = horizontal ? percentPosition : type === 'from-end' ? percentPosition : 100 - percentPosition;

    return final;
  }

  private setRangePosition () {
    const { orientation, type } = this.modelOptions;
    const nodes = this.nodes;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const range = type === 'range';
    
    const typeFromStyle = horizontal ? `left` : `bottom`;
    const typeToStyle = horizontal ? `right` : `top`;

    const fromPercent = nodes.from.handle.style[typeFromStyle];
    const percent = 100 - parseFloat(fromPercent.replace(/[^0-9,.]/g, ' '));

    if(fromStart) {
      nodes.range.style[typeFromStyle] = '0';
      nodes.range.style[typeToStyle] = `${percent}%`;
    }

    if(fromEnd) {
      nodes.range.style[typeToStyle] = '0';
      nodes.range.style[typeFromStyle] = fromPercent;
    }

    if(range){
      const toPercent = 100 - parseFloat(nodes.to.handle.style[typeFromStyle].replace(/[^0-9,.]/g, ' '));
      nodes.range.style[typeFromStyle] = fromPercent;
      nodes.range.style[typeToStyle] = `${toPercent}%`;
    }
  }

  private setThumbValue (toggle: HTMLElement, percent: number) {
    const { orientation, type, max } = this.modelOptions;
    const final = orientation === 'horizontal' ? percent : type === 'from-end' ? 100 - percent : percent;
    const currentValue = max * (final/100);

    toggle.querySelector(`.${sliderClassNames.thumb[orientation]}`).innerHTML = currentValue.toFixed(2);
  }

  private setTogglePosition (toggle: HTMLDivElement, percent: number) {
    const { orientation, type } = this.modelOptions;
    const typeStyle = orientation === 'horizontal' ? `left` : `bottom`;

    toggle.style[typeStyle] = `${percent}%`;
    this.setThumbValue(toggle, percent);
  }

  private setClickPosition (percent: number) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isRange = type === 'range';
    const finalToggle = this.checkClickPosition(percent);

    if(isFromStart) {
      const stylePercent = horizontal ? percent : 100 - percent;
      this.setTogglePosition(finalToggle, stylePercent);
      this.setThumbValue(finalToggle, stylePercent);
      this.setRangePosition();
    }
    if(isFromEnd) {
      const stylePercent = horizontal ? 100 - percent : percent;
      this.setTogglePosition(finalToggle, stylePercent);
      this.setThumbValue(finalToggle, percent);
      this.setRangePosition();
    }
    if(isRange) {
      const stylePercent = horizontal ? 100 - percent : percent;
      this.setTogglePosition(finalToggle, percent);
      this.setThumbValue(finalToggle, percent);
      this.setRangePosition();
    }
  }

  private checkClickPosition (percent: number): HTMLDivElement {
    const { type } = this.modelOptions;
    const nodes = this.nodes;
    const fromToggle = nodes.from.handle;
    const fromTogglePercent = this.getTogglePosition(fromToggle);

    if(type === 'range') {

      const toToggle = nodes.to.handle;
      const toTogglePercent = this.getTogglePosition(toToggle);
      const toggleRangeMiddle = (toTogglePercent - fromTogglePercent) / 2;
      const percentFromToggleRange = (percent - fromTogglePercent);

      if(percent <= fromTogglePercent) {
        this.setLastToggle(fromToggle)
        return fromToggle;
      }
      if(percent >= toTogglePercent) {
        this.setLastToggle(toToggle)
        return toToggle;
      }
      if(percentFromToggleRange <= toggleRangeMiddle) {
        console.log('from ret')
        this.setLastToggle(fromToggle)
        return fromToggle;
      }
      if(percentFromToggleRange > toggleRangeMiddle) {
        console.log('to ret')
        this.setLastToggle(toToggle)
        return toToggle;
      }
    }
    
    return fromToggle;
  }
}

export default View;