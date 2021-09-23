import IUserOptions from './IUserOptions';
import SimpleSlider from '../../simpleSlider';

declare global {
  interface JQuery {
    simpleSlider(options?: IUserOptions): SimpleSlider;
  }
}