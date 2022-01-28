import { bind } from 'decko';

import ISliderComponents from '../utils/interfaces/view/ISliderComponents';
import Options from '../utils/interfaces/options';
import { DomParent, Orientation, ToggleType, UpdateValues } from '../utils/types/namespace';
import sliderClassNames from '../utils/sliderClassNames';
import Observer from '../observer/Observer';
import Range from './components/range/range';
import Toggle from './components/toggle/toggle';
import Thumb from './components/thumb/thumb';
import Scale from './components/scale/scale';
import Bar from './components/bar/bar';

class View extends Observer {
  private options: Options;
  private domParent: DomParent;
  private domSlider!: HTMLDivElement;
  private components!: ISliderComponents;
  private draggingToggle!: ToggleType | null;

  constructor (domParent: DomParent, options: Options) {
    super();

    this.domParent = domParent;
    this.options = options;
    this.init();
  }

  public updateOptions (options: Options): void {
    this.options = options;
    this.render();
  }

  public updateValues ({ option, value }: UpdateValues): void {
    this.options = { ...this.options, ...{ [option]: value } };
    this.setValues();
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
    const { withRange, withThumb, withScale } = this.options;
    const { bar, range, from, to, scale } = this.components;
    const isRange = this.options.to !== undefined && !Number.isNaN(this.options.to);
    const hasSlider = this.domParent.contains(this.domSlider);
    const hasBar = this.domSlider.contains(bar.getDom());
    const hasFrom = bar.getDom().contains(from.handle.getDom());
    const hasTo = bar.getDom().contains(to.handle.getDom());
    const hasFromThumb = from.handle.getDom().contains(from.thumb.getDom());
    const hasToThumb = to.handle.getDom().contains(to.thumb.getDom());
    const hasThumbs = hasFromThumb && hasToThumb;
    const hasRange = bar.getDom().contains(range.getDom());
    const hasScale = this.domSlider.contains(scale.getDom());

    this.updateSliderState(this.options);

    /* Bar */
    if (!hasBar) {
      this.domSlider.appendChild(bar.getDom());
    }

    /* From и To ползунки */
    if (!hasFrom) {
      bar.getDom().appendChild(from.handle.getDom());
    }

    if (!isRange) {
      if (hasTo) {
        bar.getDom().removeChild(to.handle.getDom());
      }
    }

    if (isRange) {
      if (!hasTo) {
        bar.getDom().appendChild(to.handle.getDom());
      }
    }

    /* withRange */
    if (withRange) {
      if (!hasRange) {
        bar.getDom().appendChild(range.getDom());
      }
    }

    if (!withRange) {
      if (hasRange) {
        bar.getDom().removeChild(range.getDom());
      }
    }

    /* withScale */
    if (withScale) {
      if (!hasScale) {
        this.domSlider.appendChild(scale.getDom());
      }
    }

    if (!withScale) {
      if (hasScale) {
        this.domSlider.removeChild(scale.getDom());
      }
    }

    /* withThumb */
    if (withThumb) {
      if (!hasThumbs) {
        from.handle.getDom().appendChild(from.thumb.getDom());
        to.handle.getDom().appendChild(to.thumb.getDom());
      }
    }

    if (!withThumb) {
      if (hasThumbs) {
        from.handle.getDom().removeChild(from.thumb.getDom());
        to.handle.getDom().removeChild(to.thumb.getDom());
      }
    }

    this.setValues();
    this.setRangePosition();

    /* Slider */
    if (!hasSlider) {
      this.domParent.appendChild(this.domSlider);
    }
  }

  private updateSliderState (options: Options): void {
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

      this.notify('onSlide', { option: this.draggingToggle, value });
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

        this.notify('onSlide', { option: toggle, value });
      }
    });
  }

  private chooseToggleByCoords (event: MouseEvent): ToggleType {
    const { bar, from, to } = this.components;
    const isRange = this.options.to !== undefined && !Number.isNaN(this.options.to);
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

  private setToggleValue (toggle: ToggleType, value: number): void {
    this.components[toggle].handle.setValue(value);
    this.components[toggle].thumb.setValue(value);
    this.setRangePosition();
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

    range.setLength(fromIndent, toIndent);
  }

  private setValues (): void {
    const { from, to } = this.options;
    const isRange = to !== undefined && !Number.isNaN(to);

    this.setToggleValue('from', from);
    if (isRange) this.setToggleValue('to', to);
  }
}

export default View;
