export abstract class SpecialAbility<T extends {isUsable: boolean}> {
  abstract data: T;

  abstract process(): void;

  abstract update(): void;
}
