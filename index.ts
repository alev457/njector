import * as events from "events";

export interface IInjector {
  add(service: IService): void;
  get<T extends IService>(key: string): T;
  remove(key: string): boolean;
}

export interface IService {
  key: string;
}

export class Njector extends events.EventEmitter implements IInjector {
  constructor() {
    super();

    this._services = new Map<string, IService>();
  }

  private _services: Map<string, IService>;
  public add(service: IService) {
    if(this._services.has(service.key)) throw new Error("attmpted to add a service that has already been registered: " + service.key);

    this._services.set(service.key, service);
    this.emit("serviceAdded", service);
  }
  public get<T extends IService>(key: string) {
    const service = this._services.get(key);

    if(typeof service === "undefined") throw new Error("attempted to get a service that has not been registered: " + key);

    return service as T;
  }
  public remove(key: string) {
    const removed = this._services.delete(key);

    if(!removed) throw new Error("attempted to remove a service that has not been registered: " + key);

    this.emit("serviceRemoved", key);
    return removed;
  }
}