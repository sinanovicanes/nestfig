# Nestfig

**Nestfig** is a flexible configuration management library for [NestJS](https://nestjs.com/) that allows you to extract environment variables directly into your class-based configuration providers. With decorators and easy-to-use services, Nestfig keeps your configuration clean, organized, and validated without cluttering your classes with unnecessary logic.

## Features

- **Class-based configuration**: Define configuration using clean, class-based design patterns.
- **Custom decorators**: Easily bind environment variables to class fields using `@ConfigField`.
- **Automatic validation**: Integrate `class-validator` to validate configuration values before they are used.
- **Clean and modular**: No need to clutter your config classes with environment-loading logic.
- **Reusable loader**: Use a single service to manage environment variables across multiple config classes.

## Installation

```bash
npm install nestfig
```

or

```bash
yarn add nestfig
```

## Usage

### 1. Define Your Config Class

Use the `@ConfigField()` decorator to mark which fields should be populated from environment variables:

```typescript
import { ConfigField } from "nestfig";

export class MyDatabaseConfig {
  @ConfigField("DB_HOST")
  host: string;

  @ConfigField("DB_PORT")
  port: number;
}
```

### 2. Setup the Config Module

In your module, set up Nestfig to load your configuration class using the `ConfigLoaderService`. This service handles loading environment variables and validation (optional).

```typescript
import { Module } from "@nestjs/common";
import { MyDatabaseConfig } from "./config/my-database-config";
import { ConfigLoaderService } from "nestfig";

@Module({
  providers: [
    ConfigLoaderService,
    {
      provide: MyDatabaseConfig,
      useFactory: async (configLoader: ConfigLoaderService) => {
        return await configLoader.loadConfig(MyDatabaseConfig);
      },
      inject: [ConfigLoaderService]
    }
  ],
  exports: [MyDatabaseConfig]
})
export class ConfigModule {}
```

### 3. Inject Your Config Class

You can now inject your config class into any service or controller in your NestJS app:

```typescript
import { Injectable } from "@nestjs/common";
import { MyDatabaseConfig } from "./config/my-database-config";

@Injectable()
export class SomeService {
  constructor(private readonly dbConfig: MyDatabaseConfig) {}

  getDatabaseHost() {
    return this.dbConfig.host;
  }
}
```

### 4. (Optional) Add Validation

Nestfig integrates seamlessly with `class-validator` to ensure the environment variables meet certain requirements:

```typescript
import { IsPort } from "class-validator";
import { ConfigField } from "nestfig";

export class MyDatabaseConfig {
  @ConfigField("DB_HOST")
  host: string;

  @ConfigField("DB_PORT")
  @IsPort()
  port: number;
}
```

The `ConfigLoaderService` will automatically validate the fields before they are injected into your application.

## Example

Here’s a complete example of using **Nestfig** to load and validate configuration in a NestJS app:

```typescript
// config/my-database-config.ts
import { IsPort } from "class-validator";
import { ConfigField } from "nestfig";

export class MyDatabaseConfig {
  @ConfigField("DB_HOST")
  host: string;

  @ConfigField("DB_PORT")
  @IsPort()
  port: number;
}

// config/config.module.ts
import { Module } from "@nestjs/common";
import { MyDatabaseConfig } from "./my-database-config";
import { ConfigLoaderService } from "nestfig";

@Module({
  providers: [
    ConfigLoaderService,
    {
      provide: MyDatabaseConfig,
      useFactory: async (configLoader: ConfigLoaderService) => {
        return await configLoader.loadConfig(MyDatabaseConfig);
      },
      inject: [ConfigLoaderService]
    }
  ],
  exports: [MyDatabaseConfig]
})
export class ConfigModule {}

// some.service.ts
import { Injectable } from "@nestjs/common";
import { MyDatabaseConfig } from "./config/my-database-config";

@Injectable()
export class SomeService {
  constructor(private readonly dbConfig: MyDatabaseConfig) {}

  getDatabaseHost() {
    return this.dbConfig.host;
  }
}
```

## API Reference

### `@ConfigField(envVarName: string)`

- **Description**: Marks a class property as being populated from an environment variable.
- **Parameter**: `envVarName` - The name of the environment variable to load.

### `ConfigLoaderService`

- **Method**: `loadConfig<T>(configClass: new () => T): Promise<T>`
  - **Description**: Dynamically loads and validates environment variables into the provided config class.

## License

Nestfig is [MIT licensed](LICENSE).
