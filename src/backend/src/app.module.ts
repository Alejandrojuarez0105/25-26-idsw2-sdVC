import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GradosModule } from './modules/grados/grados.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [AuthModule, GradosModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
