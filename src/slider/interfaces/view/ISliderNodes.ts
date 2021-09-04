import { TDomParent } from "./namespace";

interface ISliderNodes {
  domParent: TDomParent,
  slider: HTMLDivElement,
  bar: HTMLDivElement,
  range: HTMLDivElement,
  from: IToggle,
  to: IToggle,
  scale: HTMLDivElement
};

interface IToggle {
  handle: HTMLDivElement,
  thumb: HTMLDivElement
};
export default ISliderNodes;