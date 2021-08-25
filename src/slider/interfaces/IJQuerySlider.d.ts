import IModelOptions from './IModelOptions';
import SimpleSlider from '../simpleSlider';

declare global {
  interface JQuery {
    simpleSlider(options: IModelOptions): SimpleSlider;
  }
}