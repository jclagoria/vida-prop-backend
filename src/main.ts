import 'reflect-metadata'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(winstonLogger)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000
  const environment = configService.get<string>('NODE_ENV') ?? 'development'

  app.use(helmet())
  app.enableCors()

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  app.useGlobalInterceptors(new CorrelationIdInterceptor(), new LoggingInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(port)

  const url = await app.getUrl()
  logger.log(`Application is running in ${environment} mode on: ${url}`)

  of({ message: 'Server started' }).pipe(map((data) => winstonLogger.log(JSON.stringify(data))))
}

bootstrap()
