import { bind } from 'decko';

import Observer from '../observer/Observer';
import { DomParent, Orientation, ToggleType, UpdateCurrentValue } from '../utils/types/namespace';
import ISliderComponents from '../utils/interfaces/view/ISliderComponents';
import IViewEvents from '../utils/interfaces/view/IViewEvents';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../utils/sliderClassNames';
import Range from './components/range/range';
import Toggle from './components/toggle/toggle';
import Thumb from './components/thumb/thumb';
import Scale from './components/scale/scale';
import Bar from './components/bar/bar';

class View extends Observer {
  private modelOptions: ICorrectOptions;
  private domParent: DomParent;
  private domSlider!: HTMLDivElement;
  private components!: ISliderComponents;
  private draggingToggle!: ToggleType | null;
  private viewEvents: IViewEvents = {
    onSlide: new Observer(),
  };

  get options (): ICorrectOptions {
    return this.modelOptions;
  }

  get events (): IViewEvents {
    return this.viewEvents;
  }

  constructor (domParent: DomParent, modelOptions: ICorrectOptions) {
    super();

    this.domParent = domParent;
    this.modelOptions = modelOptions;
    this.init();
  }

  public updateOptions (newModelOptions: ICorrectOptions): void {
    this.modelOptions = newModelOptions;
    this.render();
  }

  public updateCurrentValue (newValue: UpdateCurrentValue): void {
    this.setToggleValue(newValue);
    this.setRangePosition();
  }

  private init (): void {
    this.createSliderDom();
    this.initComponents();
    this.initComponentsListeners();
    this.render();
  }

  private initComponents () {
    const { options } = this;

    this.components = {
      bar: new Bar(options),
      range: new Range(options),
      from: {
        handle: new Toggle(options),
        thumb: new Thumb(options),
      },
      to: {
        handle: new Toggle(options),
        thumb: new Thumb(options),
      },
      scale: new Scale(options),
    };
  }

  private initComponentsListeners () {
    const { bar, scale } = this.components;

    window.removeEventListener('mousemove', this.handleWindowMouseMove);
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    bar.getDom().addEventListener('mousedown', this.handleBarMouseDown);
    scale.getDom().addEventListener('click', this.handleScaleClick);
  }

  private createSliderDom (): void {
    this.domSlider = document.createElement('div');
    this.domSlider.classList.add(`${sliderClassNames.slider.main}`);
  }

  private render () {
    const { type, withRange, withThumb, withScale } = this.modelOptions;
    const { bar, range, from, to, scale } = this.components;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isSliderHave = this.domParent.contains(this.domSlider);
    const isBarHave = this.domSlider.contains(bar.getDom());
    const isFromHave = bar.getDom().contains(from.handle.getDom());
    const isToHave = bar.getDom().contains(to.handle.getDom());
    const isFromThumbHave = from.handle.getDom().contains(from.thumb.getDom());
    const isToThumbHave = to.handle.getDom().contains(to.thumb.getDom());
    const isThumbHave = isFromThumbHave && isToThumbHave;
    const isRangeHave = bar.getDom().contains(range.getDom());
    const isScaleHave = this.domSlider.contains(scale.getDom());

    this.updateSliderState(this.modelOptions);

    /* Bar */
    if (!isBarHave) {
      this.domSlider.appendChild(bar.getDom());
    }

    /* From-start || From-end */
    if (isFromStart || isFromEnd) {
      if (!isFromHave) {
        bar.getDom().appendChild(from.handle.getDom());
      }
      if (isToHave) {
        bar.getDom().removeChild(to.handle.getDom());
      }
    }

    /* Range */
    if (isRange) {
      if (!isFromHave) {
        bar.getDom().appendChild(from.handle.getDom());
      }
      if (!isToHave) {
        bar.getDom().appendChild(to.handle.getDom());
      }
    }

    /* withRange */
    if (withRange && !isRangeHave) {
      bar.getDom().appendChild(range.getDom());
    }

    if (!withRange && isRangeHave) {
      bar.getDom().removeChild(range.getDom());
    }

    /* withScale */
    if (withScale) {
      if (!isScaleHave) {
        this.domSlider.appendChild(scale.getDom());
      }
    }

    if (!withScale && isScaleHave) {
      this.domSlider.removeChild(scale.getDom());
    }

    /* withThumb */
    if (withThumb && !isThumbHave) {
      from.handle.getDom().appendChild(from.thumb.getDom());
      to.handle.getDom().appendChild(to.thumb.getDom());
    }

    if (!withThumb && isThumbHave) {
      from.handle.getDom().removeChild(from.thumb.getDom());
      to.handle.getDom().removeChild(to.thumb.getDom());
    }

    this.setCurrentValue();
    this.setRangePosition();

    /* Slider */
    if (!isSliderHave) {
      this.domParent.appendChild(this.domSlider);
    }
  }

  private updateSliderState (options: ICorrectOptions): void {
    const { orientation } = options;
    const oldOrientation: Orientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
    const { bar, range, scale, to, from } = this.components;

    this.domSlider.classList.remove(`${sliderClassNames.slider[oldOrientation]}`);
    this.domSlider.classList.add(`${sliderClassNames.slider[orientation]}`);
    bar.updateState(options);
    range.updateState(options);
    scale.updateState(options);
    to.handle.updateState(options);
    to.thumb.updateState(options);
    from.handle.updateState(options);
    from.thumb.updateState(options);
  }

  @bind
  private handleBarMouseDown (event: MouseEvent) {
    this.draggingToggle = this.chooseToggleByCoords(event);

    if (this.draggingToggle) {
      this.setActiveToggle(this.draggingToggle);
      this.handleWindowMouseMove(event);
      window.addEventListener('mousemove', this.handleWindowMouseMove);
      window.addEventListener('mouseup', this.handleWindowMouseUp);
    }
  }

  @bind
  private handleWindowMouseMove (event: MouseEvent) {
    const { bar } = this.components;

    if (this.draggingToggle) {
      const coords = bar.getRelativeCoords(event);
      const value = bar.getValueByCoords(coords);
      const toggleToUpdate: UpdateCurrentValue = { option: this.draggingToggle, value };

      this.viewEvents.onSlide.notify(toggleToUpdate);
    }
  }

  @bind
  private handleWindowMouseUp () {
    if (this.draggingToggle) {
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
      window.removeEventListener('mouseup', this.handleWindowMouseUp);
      this.draggingToggle = null;
    }
  }

  @bind
  private handleScaleClick (event: MouseEvent) {
    const { target } = event;
    const { scale } = this.components;

    scale.getItems().forEach((item) => {
      if (target === item) {
        const value = Number(item.getAttribute('data-value'));
        const toggle = this.chooseToggleByCoords(event);
        const toggleToUpdate: UpdateCurrentValue = { option: toggle, value };

        this.viewEvents.onSlide.notify(toggleToUpdate);
      }
    });
  }

  private chooseToggleByCoords (event: MouseEvent): ToggleType {
    const { type } = this.modelOptions;
    const { bar, from, to } = this.components;
    const isRange = type === 'range';
    const barLenght = bar.getLength();
    const fromValue = from.handle.getCoords(barLenght);
    const mouseCoords = bar.getRelativeCoords(event);

    if (isRange) {
      const toValue = to.handle.getCoords(barLenght);
      const rangeMiddle = (toValue - fromValue) / 2;
      const valueFromRangeMiddle = (mouseCoords - fromValue);

      if (mouseCoords <= fromValue) return 'from';
      if (mouseCoords >= toValue) return 'to';
      if (valueFromRangeMiddle <= rangeMiddle) return 'from';
      if (valueFromRangeMiddle > rangeMiddle) return 'to';
    }

    return 'from';
  }

  private setToggleValue (newValue: UpdateCurrentValue): void {
    const { option, value } = newValue;

    this.components[option].handle.setValue(value);
    this.components[option].thumb.setValue(value);
  }

  private setActiveToggle (toggle: ToggleType): void {
    const isFromToggle = toggle === 'from';
    const old: ToggleType = isFromToggle ? 'to' : 'from';

    this.components[old].handle.removeActive();
    this.components[toggle].handle.setActive();
  }

  private setRangePosition (): void {
    const { range, from, to } = this.components;
    const { orientation } = this.options;
    const fromToggle = from.handle.getDom();
    const toToggle = to.handle.getDom();
    const isVertical = orientation === 'vertical';
    const sideStart = isVertical ? 'bottom' : 'left';
    const fromIndent = parseFloat(fromToggle.style[sideStart].replace(/[^0-9,.]/g, ' '));
    const toIndent = parseFloat(toToggle.style[sideStart].replace(/[^0-9,.]/g, ' '));

    range.setLenght(fromIndent, toIndent);
  }

  private setCurrentValue () {
    const { currentValue, type } = this.modelOptions;
    const isRange = type === 'range';

    if (typeof currentValue === 'object') {
      this.setToggleValue({ option: 'from', value: currentValue.from });
      if (isRange) {
        this.setToggleValue({ option: 'to', value: currentValue.to });
      }
    }

    if (typeof currentValue === 'number') {
      this.setToggleValue({ option: 'from', value: currentValue });
      if (isRange) {
        this.setToggleValue({ option: 'to', value: currentValue });
      }
    }
  }
}

export default View;
