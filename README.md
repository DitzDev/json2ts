<p align="center">json2ts</p>
<div align="center">
  
[![Node version](https://img.shields.io/node/v/json2ts.svg?style=flat)](https://nodejs.org/download)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/DitzDev/json2ts/issues)

</div>

<div align="center">
  
`json2ts` is an npm library that makes it easy for users to convert JSON schema to TypeScript interface.

</div>

### Installation 
Type to your CMD and make sure you installed [Node.js](https://nodejs.org)
```sh
npm install jsonts-flash
```

### How to use?
There are several option hooks in this module, Below is an example of basic usage.

```typescript
import { json2ts } from "json2ts";

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  inlineGeneration: true
});
```
Since we are using the `inlineGeneration` option hook, The interface will be written in your own code file, It will be written automatically under the keyword `import`. This is the output:
```typescript
import { json2ts } from "json2ts";

interface RootObjectStatus {
  maried: boolean;
  isWorking: boolean;
}

interface RootObjectFriendNameItem {
  name: string;
  age: number;
}

interface RootObject {
  name: string;
  age: number;
  status: RootObjectStatus;
  friendName: RootObjectFriendNameItem[];
}

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  inlineGeneration: true
});
```
> [!WARNING]
> Hook `inlineGeneration` only works for files with extension 'ts' or 'tsx', otherwise it won't work

Is that all? Yes. But if you want to change the interface name, then just use the `rootObjectName` option hook. this is example:
```typescript
import { json2ts } from "json2ts";

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  inlineGeneration: true,
  rootObjectName: "JohnDoeData"
});
```
Output:
```typescript
import { json2ts } from "json2ts";

interface JohnDoeDataStatus {
  maried: boolean;
  isWorking: boolean;
}

interface JohnDoeDataFriendNameItem {
  name: string;
  age: number;
}

interface JohnDoeData {
  name: string;
  age: number;
  status: JohnDoeDataStatus;
  friendName: JohnDoeDataFriendNameItem[];
}

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  inlineGeneration: true,
  rootObjectName: "JohnDoeData"
});
```
But, can we save the interface output outside our code file? The answer is `yes`. You can use the `saveToFile` option hook and then include it with `outputPath`. Here is an example:
```typescript
import { json2ts } from "json2ts";

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  // No need inlineGeneration
  // You need to create folder types or based on the output path you wrote
  rootObjectName: "JohnDoeData",
  saveToFile: true, // boolean
  outputPath: './types/JohnDoe.ts', // Specify path
});
```
Output in `JohnDoe.ts`:
```typescript
interface JohnDoeDataStatus {
  maried: boolean;
  isWorking: boolean;
}

interface JohnDoeDataFriendNameItem {
  name: string;
  age: number;
}

interface JohnDoeData {
  name: string;
  age: number;
  status: JohnDoeDataStatus;
  friendName: JohnDoeDataFriendNameItem[];
}
```
Can I add export word without having to write export in every interface? The answer is yes. You can use the `exportWord` option hook. Here is an example:
```typescript
import { json2ts } from "json2ts";

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  // No need inlineGeneration
  // You need to create folder types or based on the output path you wrote
  rootObjectName: "JohnDoeData",
  saveToFile: true, // boolean
  outputPath: './types/JohnDoe.ts', // Specify path
  exportWord: true
});
```
Output: 
```typescript
export interface JohnDoeDataStatus {
  maried: boolean;
  isWorking: boolean;
}

export interface JohnDoeDataFriendNameItem {
  name: string;
  age: number;
}

export interface JohnDoeData {
  name: string;
  age: number;
  status: JohnDoeDataStatus;
  friendName: JohnDoeDataFriendNameItem[];
}
```
If you just want to add the export word in rootObjectName, you can use the `exportWordAtRoot` option hook. Here an Example:
```typescript
import { json2ts } from "json2ts";

const json = {
  name: "John Doe",
  age: 18,
  status: {
    maried: false,
    isWorking: true
  },
  friendName: [
  {
    name: "Ditz",
    age: 18
  },
  {
    name: "Alex",
    age: 7
  }]
};

const result = json2ts(json, {
  // No need inlineGeneration
  // You need to create folder types or based on the output path you wrote
  rootObjectName: "JohnDoeData",
  saveToFile: true, // boolean
  outputPath: './types/JohnDoe.ts', // Specify path
  exportWordAtRoot: true
});
```
Output: 
```typescript
interface JohnDoeDataStatus {
  maried: boolean;
  isWorking: boolean;
}

interface JohnDoeDataFriendNameItem {
  name: string;
  age: number;
}

export interface JohnDoeData {
  name: string;
  age: number;
  status: JohnDoeDataStatus;
  friendName: JohnDoeDataFriendNameItem[];
}
```
### Contribution
Give ideas, And I hope this project will be very helpful to many people, Contributing helps us a lot. Create a fork and make a PR, We will be very happy to review it

### License
This project is licensed under [MIT License](LICENSE).