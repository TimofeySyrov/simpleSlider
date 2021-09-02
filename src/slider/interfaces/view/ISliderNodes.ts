interface ISliderNodes {
  domParent: TDomParent,
  slider: HTMLDivElement,
  bar: HTMLDivElement,
  range: HTMLDivElement,
  from: TToggle,
  to: TToggle,
  scale: HTMLDivElement
}

type TToggle = { handle: HTMLDivElement, thumb: HTMLDivElement };
export type TDomParent = HTMLDivElement | HTMLSpanElement;
export default ISliderNodes;