import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create an instance of the NestJS application
  const app = await NestFactory.create(AppModule);

  // Apply global validation middleware to handle request data validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS (Cross-Origin Resource Sharing) with specific configurations
  app.enableCors({
    origin: [/localhost:\d+$/, /\.com$/], // Allows requests from localhost (any port) and domains ending in .com
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specifies allowed HTTP methods
    credentials: true, // Allows credentials such as cookies and authorization headers
  });

  // Start the application and listen on the specified port (default: 3000)
  await app.listen(process.env.PORT ?? 3000);
}

// Initialize the application
bootstrap();
