import {UIBinder} from '../base/UIBinder';
import {BlockSet} from '../entities/BlockSet';
import {BlockSetManagerConfig} from '../types';

type IBlockSetManagerData = {
  maxBlockSets: number;
  blockSets: BlockSet[];
};

export class BlockSetManager extends UIBinder<IBlockSetManagerData> {
  private config: BlockSetManagerConfig;

  private data: IBlockSetManagerData;

  constructor(config: BlockSetManagerConfig) {
    super();
    this.config = config;

    this.data = {
      maxBlockSets: config.maxBlockSets,
      blockSets: [],
    };
    this.addNewBlockSet(config.maxBlockSets);
  }

  getData() {
    return this.data;
  }

  public addNewBlockSet(count: number = 1) {
    if (this.data.blockSets.length + count > this.data.maxBlockSets) {
      return;
    }
    const newBlockSets = [];
    for (let i = 0; i < count; i++) {
      const newBlockSet = new BlockSet('auto', 'auto', this.config.blockSize);
      newBlockSets.push(newBlockSet);
    }
    this.data = {
      ...this.data,
      blockSets: [...this.data.blockSets, ...newBlockSets],
    };
    this.notifyChange();
  }

  public removeBlockSet(id: string) {
    const updatedBlockSets = this.data.blockSets.filter(
      bs => bs.getData().id !== id,
    );
    this.data = {
      ...this.data,
      blockSets: updatedBlockSets,
    };
    this.notifyChange();
  }
}
