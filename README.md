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

## Usage

### Defining Configuration Classes

You can define a configuration class by using the `@Config` and `@Field` decorators. The `@Config` decorator specifies the source(s) of the configuration, such as environment variables, JSON or YAML files. The `@Field` decorator extracts individual fields from these sources.

Here's an example:

```typescript
import { IsString } from "class-validator";
import { Config, Field } from "nestfig";

@Config()
export class MailerConfig {
  @Field("MAILER_HOST")
  @IsString()
  host: string;

  @Field("MAILER_PORT")
  @IsPort()
  port: string;

  @Field("MAILER_USER")
  @IsString()
  user: string;

  @Field("MAILER_PASS")
  @IsString()
  password: string;
}
```

### Loading Configuration

To load and register the configuration in your NestJS app, you need to use the `NestfigModule` and pass the configuration classes you defined.

Here's how you can load the configuration:

```typescript
import { Module } from "@nestjs/common";
import { NestfigModule } from "nestfig";
import { MailerConfig } from "./mailer-config";
import { CacheConfig } from "./cache-config";

@Module({
  imports: [
    NestfigModule.forRoot({
      global: true, // Makes the configuration available globally
      envFilePaths: [".env", ".env.development"], // Env file paths to load them to the process.env using dotenv
      configs: [MailerConfig, CacheConfig] // Register multiple config classes
    })
  ]
})
export class AppModule {}
```

### License

This project is licensed under the MIT License.
