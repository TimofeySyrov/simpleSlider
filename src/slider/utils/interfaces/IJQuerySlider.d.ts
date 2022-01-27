import { DomParent } from '../types/namespace';
import IUserOptions from './IUserOptions';

declare global {
  interface JQuery {
    simpleSlider(options?: IUserOptions): DomParent;
  }
}
