# Nestfig

Nestfig is a configuration management library for NestJS, allowing you to easily extract and manage configuration values from environment variables, JSON or YAML files. It provides decorators for marking configuration fields and supports loading multiple configuration sources.

## Installation

Install the package via npm:

```bash
npm install nestfig
```

## Features

- **Supports Multiple Config Sources:** You can load multiple JSON or YAML configuration files by specifying paths in the `@Config` decorator.
- **Validation:** Integrates with `class-validator` to validate the configuration values.
- **Global Configuration:** Easily make configuration available globally across your NestJS app.
- **Child Config Classes:** You can nest configuration classes within each other for easy access to related settings.

## Usage

### Defining Configuration Classes

You can define a configuration class by using the `@Config` and `@Field` decorators. The `@Config` decorator specifies the source(s) of the configuration, such as environment variables, JSON or YAML files. The `@Field` decorator extracts individual fields from these sources.

Here's an example:

```ts
// config/app.config.ts
import { Config, Field } from "nestfig";
import { DatabaseConfig } from "./database.config";
import { CacheConfig } from "./cache.config";

@Config()
export class AppConfig {
  @Field("PORT")
  port: number;

  @Field(() => DatabaseConfig)
  database: DatabaseConfig;

  @Field(() => CacheConfig)
  cache: CacheConfig;
}
```

```ts
// config/database.config.ts
import { Config, Field } from "nestfig";

@Config()
export class DatabaseConfig {
  @Field("DATABASE_URL")
  url: string;
}
```

```ts
// config/cache.config.ts
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Config, Field } from "nestfig";

@Config({ paths: ["CacheOptions.yml"], ignoreEnv: true })
export class CacheConfig {
  @Field("TTL")
  @IsPositive()
  @IsInt()
  ttl: number = 15 * 1000;

  @Field("HOST")
  @IsString()
  @IsNotEmpty()
  host: string = "localhost";

  @Field("PORT")
  @IsPositive()
  @IsInt()
  port: number = 6379;
}
```

### Loading Configuration

To load and register the configuration in your NestJS app, use the `NestfigModule` and pass the configuration classes you defined.

Here's how you can load the configuration:

```ts
import { Module } from "@nestjs/common";
import { NestfigModule } from "nestfig";
import { MailerConfig } from "./mailer-config";
import { CacheConfig } from "./cache-config";

@Module({
  imports: [
    NestfigModule.forRoot({
      global: true, // Makes the configuration available globally
      envFilePaths: [".env", ".env.development"], // Env file paths to load them to the process.env using dotenv
      configs: [AppConfig] // Register multiple config classes (Child classes are registered automatically)
    })
  ]
})
export class AppModule {}
```

### Using Configuration

After loading configurations, you can use dependency injection to access them.

Here's an example:

```ts
import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-yet";
import { CacheConfig } from "./config/cache-config";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly config: CacheConfig) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      isGlobal: true,
      store: await redisStore({
        ttl: this.config.ttl,
        socket: {
          host: this.config.host,
          port: this.config.port
        }
      })
    };
  }
}
```

### License

This project is licensed under the MIT License.
