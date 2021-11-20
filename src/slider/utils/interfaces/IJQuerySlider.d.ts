import SimpleSlider from '../../simpleSlider';
import IUserOptions from './IUserOptions';

declare global {
  interface JQuery {
    simpleSlider(options?: IUserOptions): SimpleSlider;
  }
}
