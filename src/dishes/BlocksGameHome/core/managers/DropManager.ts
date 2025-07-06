import {makeMutable, SharedValue} from 'react-native-reanimated';
import {UIBinder} from '../base/UIBinder';
import {SelectedShapeMeta, SelectedShapeMetaSV} from '../types';

type IDropManagerData = {
  selectedShapeMetaSV: SelectedShapeMetaSV;
  currentDropCellSV: SharedValue<[number, number] | null>;
};

export class DropManager extends UIBinder<IDropManagerData> {
  private data: IDropManagerData;

  constructor() {
    super();
    this.data = {
      selectedShapeMetaSV: makeMutable<SelectedShapeMeta>(null),
      currentDropCellSV: makeMutable<[number, number] | null>(null),
    };
  }

  getData() {
    return this.data;
  }
}

const dropManager = new DropManager();

export default dropManager;
