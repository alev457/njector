# njector

njector is a lightweight dependency injection module.

___

## What's included?

```Typescript
interface IInjector {
  add(service: IService): void;
  get<T extends IService>(key: string): T;
  remove(key: string): boolean;
}

interface IService {
  key: string;
}

class Njector extends EventEmitter implements IInjector {
  constructor();
  add(service: IService): void;
  get<T extends Iservice>(key: string): T;
  remove(key: string): boolean;
}
```

___

## How do I use it?

Simple! Create an "Njector" and start adding stuff to it! Below is an example 
of anexpress api for managing users.

index.ts
```Typescript
import * as express from "express";
const application = express();

import * as bodyParser from "body-parser";
application.use(bodyParser.json());

// Create the njector
import {Njector,IInjector,IService} from "njector";
const njector = new Njector();

// Services
const router = express.Router() as express.Router & IService;
application.use("/api/v1", router);
router.key = "router";
njector.add(router);

import {UserStore} from "./stores/user";
njector.add(UserStore);

// Controlers
function injectController(path: string) {
  const factory = require(path) as { create: (njector: IInjector) => any };
  factory.create(njector);
}

injectController("./controllers/user");
````

./interfaces/i-store.d.ts
```Typescript
import {IService} from "njector";

export interface IStore<T> extends IService {
  add(o: T): string;
  remove(id: string): void;
  update(o: T): void;
  find(id: string): T;
}
```

./models/user.ts
```Typescript
export class User {
  constructor() { }

  id: string;
  username: string;
  password: string;
  email: string;
}
```

./stores/user.ts
```Typescript
import {User} from "../models/user";
import {IStore} from "../interfaces/i-store";

class UserStore implements IStore<User> {
  constructor() {
    this.key = "userStore";
  }

  key: string;

  // details, details...
}

```

./controllers/user.ts
```Typescript
import {Router} from "express";
import {IInjector} from "njector";
import {User} from "../models/user";
import {IStore} from "../interfaces/i-store";

class UserController {
  constructor(injector: IInjector) {
    this.injector = injector;

    this.users = this.injector.get<IStore<User>>("userStore");

    const router = this.injector.get<Router>("router");

    router.post("/users", (request, response) => {
      const user = this.createOne(request.body);
      response.status(201).end(user);
    });
    router.get("/users", (request, response) => {
      const users = this.findAll(request, response);
      response.status(200).json({ users });
    });
    router.get("/users/:id", (request, response) => {
      const user = this.findOne(request, response, request.params["id"]);
      if(user === null) {
        response.status(404).end();
        return;
      }

      response.status(200).json(user);
    });
    router.put("/users/:id", (request, response) => {
      const user = this.updateOne(request.params["id"], request.body);
      if(user === null) {
        response.status(404).end();
        return;
      }

      response.status(200).json(user);
    });
    router.del("/users/:id", (request, response) => {
      this.removeOne(request.params["id"]);
      response.status(204).end();
    });
  }

  injector: IInjector;
  users: IStore<User>;

  findAll() {
    // details, details...
  }

  findOne(id) {
    // details, details...
  }

  updateOne(id, user) {
    // details, details...
  }

  removeOne(id) {
    // details, details...
  }

  createOne(user) {
    // details, details...
  }
}
export function create(injector: IInjector) {
  return new UserController(injector);
}

```

___

## Have a question or found a bug? Maybe you have an idea to make this project better? Open an issue on github!

___

## LICENSE

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.