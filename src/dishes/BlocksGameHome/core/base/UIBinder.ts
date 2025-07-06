import {getUniqueGlobalId} from '../../../../utils';

export abstract class UIBinder<T> {
  private listeners: {id: number; listener: (data: T) => void}[] = [];

  abstract getData(): T;

  addChangeListener(listener: (data: T) => void): number {
    const id = getUniqueGlobalId();
    this.listeners.push({id, listener});
    return id;
  }

  removeChangeListener(id: number): void {
    this.listeners = this.listeners.filter(listener => listener.id !== id);
  }

  protected notifyChange(): void {
    this.listeners.forEach(listener => listener.listener(this.getData()));
  }
}
