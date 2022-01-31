import Bar from '../../../View/components/Bar/Bar';
import Range from '../../../View/components/Range/Range';
import Scale from '../../../View/components/Scale/Scale';
import Thumb from '../../../View/components/Thumb/Thumb';
import Toggle from '../../../View/components/Toggle/Toggle';

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
