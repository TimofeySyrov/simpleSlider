import Scale from "../../view/components/scale/scale";
import { TDomParent } from "../namespace";

interface ISliderNodes {
  domParent: TDomParent,
  slider: HTMLDivElement,
  bar: HTMLDivElement,
  range: HTMLDivElement,
  from: IToggle,
  to: IToggle,
  scale: Scale
};

interface IToggle {
  handle: HTMLDivElement,
  thumb: HTMLDivElement
};
export default ISliderNodes;