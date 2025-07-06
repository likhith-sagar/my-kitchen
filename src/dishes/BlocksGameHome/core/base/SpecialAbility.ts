import {IContextForUpdateAbilities} from '../types';

export abstract class SpecialAbility<T extends {isUsable: boolean}> {
  abstract data: T;

  abstract activate(): void;

  abstract update(context: IContextForUpdateAbilities): void;
}
