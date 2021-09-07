import { bind } from 'decko';
import Observer from "../observer/Observer";

import IModelOptions from "../interfaces/IModelOptions";
import ISliderNodes from "../interfaces/view/ISliderNodes";
import sliderClassNames from "./components/utils/sliderClassNames";
import { TDomParent, TToggle } from "../interfaces/view/namespace";

import Range from "./components/range/range";
import Toggle from "./components/toggle/toggle";
import Thumb from "./components/thumb/thumb";
import Scale from "./components/scale/scale";
import Bar from "./components/bar/bar";

class View extends Observer {

  private modelOptions: IModelOptions;
  private nodes: ISliderNodes;
  private draggingToggle: TToggle | null;

  constructor (domParent: TDomParent, modelOptions: IModelOptions) {
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
    this.initTogglesListeners();
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

    this.setModelOptions();
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

  private initTogglesListeners () {
    const nodes = this.nodes;

    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    nodes.bar.addEventListener('mousedown', this.startDragging);
  }

  @bind
  private startDragging(event: MouseEvent) {
    const nodes = this.nodes;
    this.draggingToggle = this.chooseToggleByCoords(event);

    if(this.draggingToggle) {
      this.setLastToggle(this.draggingToggle);
      this.drag(event);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.finishDragging);
    }
  }

  @bind
  private drag(event: MouseEvent) {
    if (this.draggingToggle) {
      const coords = this.getRelativeCoords(event);
      const value = this.convertCoordsToValue(coords);
      
      this.setToggleValue(this.draggingToggle, value);
    }
  }

  @bind
  private finishDragging() {
    if (this.draggingToggle) {
      window.removeEventListener('mousemove', this.drag);
      window.removeEventListener('mouseup', this.finishDragging);
      this.draggingToggle = null;
    }
  }

  private setModelOptions () {
    const { currentValue, type } = this.modelOptions;
    const isRange = type === 'range';

    if(typeof currentValue == 'object') {
      this.setToggleValue('from', currentValue.min);
      if(isRange) {
        this.setToggleValue('to', currentValue.max);
      }
    }

    if(typeof currentValue == 'number') {
      this.setToggleValue('from', currentValue);
      if(isRange) {
        this.setToggleValue('to', currentValue);
      }
    }
  }

  private setLastToggle (toggle: TToggle) {
    const nodes = this.nodes;
    const lastActiveClassName = `${sliderClassNames.toggle.main}` + `_last-active`;

    if(!nodes[toggle].handle.classList.contains(`${lastActiveClassName}`)) {
      nodes.from.handle.classList.remove(`${lastActiveClassName}`);
      nodes.to.handle.classList.remove(`${lastActiveClassName}`);
    
      nodes[toggle].handle.classList.add(`${lastActiveClassName}`)
    }
  }

  private getBarLength ():number {
    const { orientation } = this.modelOptions;
    const nodes = this.nodes;
    const isVertical = orientation === 'vertical';
    const lengthType = isVertical ? `offsetHeight` : `offsetWidth`;
    const length = nodes.bar[lengthType];

    return length;
  }

  private getBarOffset():number {
    const { orientation, type } = this.modelOptions;
    const nodes = this.nodes;
    const isVertical = orientation === 'vertical';
    const offsetSide = isVertical ? `top` : `left`;
    const offset = nodes.bar.getBoundingClientRect()[offsetSide];

    return offset;
  }

  private convertCoordsToValue (coords: number): number {
    const { orientation, type, max, min } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const barLength = this.getBarLength();

    const value = (coords / barLength) * max;
    const confirmedValue = isVertical ? isFromEnd ? value : max-value : isFromEnd ? max-value : value;

    return confirmedValue;
  }

  private convertValueToPercent (value: number): number {
    const { orientation, max, type } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';

    const percent = (value / max) * 100;
    const confirmedPercent = isVertical ? isFromEnd ? 100-percent : percent : isFromEnd ? 100-percent : percent;

    return confirmedPercent;
  }

  private getToggleCoords (toggle: TToggle): number {
    const { orientation, type, max } = this.modelOptions;
    const nodes = this.nodes;

    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const offsetType = isVertical ? 'offsetTop' : 'offsetLeft';
    const toggleSize = isVertical ? 'offsetHeight' : 'offsetWidth';
    const barLength = this.getBarLength();

    const pixelPosition = nodes[toggle].handle[offsetType] + (nodes[toggle].handle[toggleSize] / 2);
    // const value = (pixelPosition / barLength) * max;
    // const confirmedValue = isVertical ? isFromEnd ? value : max-value : isFromEnd ? max-value : value;

    return pixelPosition;
  }

  private setRangePosition () {
    const { orientation, type, withRange } = this.modelOptions;

    if(withRange) {
      const nodes = this.nodes;
      const isVertical = orientation === 'vertical';
      const isFromEnd = type === 'from-end';
      const isFromStart = type === 'from-start';
      const isRange = type === 'range';

      const sideStart = isVertical ? `bottom` : `left`;
      const sideEnd = isVertical ? `top` : `right`;

      const fromPercent = parseFloat(nodes.from.handle.style[sideStart].replace(/[^0-9,.]/g, ' '));
      const toPercent = 100 - parseFloat(nodes.to.handle.style[sideStart].replace(/[^0-9,.]/g, ' '));


      if(isFromStart) {
        nodes.range.style[sideStart] = '0';
        nodes.range.style[sideEnd] = `${100-fromPercent}%`;
      }

      if(isFromEnd) {
        nodes.range.style[sideStart] = `${fromPercent}%`;
        nodes.range.style[sideEnd] = '0';
      }

      if(isRange){
        nodes.range.style[sideStart] = `${fromPercent}%`;
        nodes.range.style[sideEnd] = `${toPercent}%`;
      }
    }
  }

  private setThumbValue (toggle: TToggle, value: number) {
    const { withThumb } = this.modelOptions;

    if(withThumb) {
      const nodes = this.nodes;
      nodes[toggle].thumb.innerHTML = value.toFixed(2);
    }
  }

  private setToggleValue (toggle: TToggle, value: number) {
    const { orientation, type } = this.modelOptions;
    const nodes = this.nodes;
    const isVertical = orientation === 'vertical';
    const typeStyleSide = isVertical ? `bottom` : `left`;
    const percent = this.convertValueToPercent(value);

    nodes[toggle].handle.style[typeStyleSide] = `${percent}%`;
    this.setThumbValue(toggle, value);
    this.setLastToggle(toggle);
    this.setRangePosition();
  }

  private getRelativeCoords(event: MouseEvent): number {
    const { orientation } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const axis = isVertical ? 'pageY' : 'pageX';
    const barOffset = this.getBarOffset();
    return event[axis] - barOffset;
  }

  private chooseToggleByCoords (event: MouseEvent): TToggle | null {
    const { type } = this.modelOptions;
    const isRange = type === 'range';
    const fromToggleValue = this.getToggleCoords('from');
    const mouseCoords = this.getRelativeCoords(event);

    if(isRange) {
      const toToggleValue = this.getToggleCoords('to');
      const rangeMiddle = (toToggleValue - fromToggleValue) / 2;
      const valueFromRangeMiddle = (mouseCoords - fromToggleValue);

      if(mouseCoords <= fromToggleValue) return 'from';
      if(mouseCoords >= toToggleValue) return 'to';
      if(valueFromRangeMiddle <= rangeMiddle) return 'from';
      if(valueFromRangeMiddle > rangeMiddle) return 'to';
    }
    
    return 'from';
  }
}

export default View;