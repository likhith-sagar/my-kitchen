import {getUniqueGlobalId} from '../../../../utils';

export abstract class UIBinder<T> {
  private listeners: {id: number; listener: (data: T) => void}[] = [];
  private isNotifyPending: boolean = false;

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
    if (this.isNotifyPending) return;
    this.isNotifyPending = true;
    // done this way to combine multiple calls to notifyChange in a synchronous block into single update
    Promise.resolve().then(() => {
      this.listeners.forEach(listener => listener.listener(this.getData()));
      this.isNotifyPending = false;
    });
  }
}
