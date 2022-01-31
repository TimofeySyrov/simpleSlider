import Bar from '../../../view/components/bar/bar';
import Range from '../../../view/components/range/range';
import Scale from '../../../view/components/scale/scale';
import Thumb from '../../../view/components/thumb/thumb';
import Toggle from '../../../view/components/toggle/toggle';

interface ISliderComponents {
  bar: Bar;
  range: Range;
  from: IToggle;
  to: IToggle;
  scale: Scale;
}

interface IToggle {
  handle: Toggle;
  thumb: Thumb;
}

export default ISliderComponents;
