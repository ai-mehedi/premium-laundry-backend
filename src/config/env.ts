import { IsIn, IsInt, IsString } from 'class-validator';

const NodeEnvironments = ['development', 'staging', 'production'] as const;

export class EnvironmentVariables {
  @IsString()
  @IsIn(NodeEnvironments)
  NODE_ENV: (typeof NodeEnvironments)[number] = 'development';

  @IsInt()
  PORT!: number;

  @IsInt()
  THROTTLE_TTL!: number;

  @IsInt()
  THROTTLE_LIMIT!: number;

  @IsString()
  MONGODB_URL!: string;

  @IsString()
  JWT_SECRET_KEY!: string;

  @IsString()
  SMTP_HOST!: string;

  @IsInt()
  SMTP_PORT!: number;

  @IsString()
  SMTP_USERNAME!: string;

  @IsString()
  SMTP_PASSWORD!: string;

  @IsString()
  SMTP_FROM_NAME!: string;

  @IsString()
  SMTP_FROM_EMAIL!: string;

  @IsString()
  ADMIN_SESSION_SECRET!: string;

  @IsString()
  ADMIN_SESSION_KEY!: string;

  @IsString()
  WEB_BASE_URL!: string;

  @IsString()
  BULK_SMS_API_URL!: string;

  @IsString()
  BULK_SMS_API_KEY!: string;

  @IsString()
  BULK_SMS_SENDER_ID!: string;
}
