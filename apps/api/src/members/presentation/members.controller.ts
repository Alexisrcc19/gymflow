import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import type { AuthenticatedUser } from '../../auth/domain/authenticated-user';
import { Permission } from '../../auth/domain/permission';
import { MembersService } from '../application/members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { ListMembersQueryDto } from './dto/list-members-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@ApiTags('Miembros')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Post()
  @RequirePermissions(Permission.MemberCreate)
  @ApiOperation({ summary: 'Crear un miembro' })
  create(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() input: CreateMemberDto,
  ) {
    return this.members.create(actor, input);
  }

  @Get()
  @RequirePermissions(Permission.MemberRead)
  @ApiOperation({ summary: 'Listar los miembros disponibles para el usuario' })
  list(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListMembersQueryDto,
  ) {
    return this.members.list(actor, query);
  }

  @Post(':id/invitation')
  @RequirePermissions(Permission.MemberCreate)
  @ApiOperation({ summary: 'Reenviar la invitación de acceso de un miembro' })
  resendInvitation(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.members.resendInvitation(actor, id);
  }

  @Get(':id')
  @RequirePermissions(Permission.MemberRead)
  @ApiOperation({ summary: 'Consultar un miembro' })
  get(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.members.get(actor, id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.MemberUpdate)
  @ApiOperation({ summary: 'Actualizar los datos permitidos de un miembro' })
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateMemberDto,
  ) {
    return this.members.update(actor, id, input);
  }

  @Patch(':id/deactivate')
  @RequirePermissions(Permission.MemberDeactivate)
  @ApiOperation({ summary: 'Desactivar un miembro y su acceso' })
  deactivate(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.members.deactivate(actor, id);
  }
}
