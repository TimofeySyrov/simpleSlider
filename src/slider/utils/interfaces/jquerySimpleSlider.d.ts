import { DomParent } from '../types/namespace';
import Options from './options';

declare global {
  interface JQuery {
    simpleSlider(options?: Partial<Options>): DomParent;
  }
}
