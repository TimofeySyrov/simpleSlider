import Scale from '../../../view/components/scale/scale';
import { DomParent } from '../../types/namespace';

interface ISliderNodes {
  domParent: DomParent,
  slider: HTMLDivElement,
  bar: HTMLDivElement,
  range: HTMLDivElement,
  from: IToggle,
  to: IToggle,
  scale: Scale
}

interface IToggle {
  handle: HTMLDivElement,
  thumb: HTMLDivElement
}
export default ISliderNodes;
