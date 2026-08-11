import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MembersService } from './application/members.service';
import { MembersController } from './presentation/members.controller';

@Module({
  imports: [AuthModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
