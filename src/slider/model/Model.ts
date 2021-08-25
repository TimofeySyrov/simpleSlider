import IModelOptions from "../interfaces/IModelOptions";
import Observer from "../observer/Observer";


class Model extends Observer {
  
  private modelOptions: IModelOptions;

  constructor(modelOptions: IModelOptions) {
    super();

    this.modelOptions = this.checkModelOptions(modelOptions);
  }

  public updateModelOptions(newModelOptions: IModelOptions) {
    this.modelOptions = this.checkModelOptions(newModelOptions);
    this.notify(this.modelOptions);
  }

  public getModelOptions () {
    return this.modelOptions;
  }

  private checkModelOptions (checkModelOptions: IModelOptions): IModelOptions {
    const checkedModelOptions = checkModelOptions;

    return checkedModelOptions;
  }
}

export default Model