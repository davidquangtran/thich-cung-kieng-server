import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing JWT token',
})
@ApiForbiddenResponse({
  description: 'Forbidden - Insufficient permissions',
})
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) { }

  // @Get()
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({
  //   summary: 'Get all users',
  //   description:
  //     'Retrieve list of all users in the system with pagination and filtering. Admin only.',
  // })
  // @ApiOkResponse({
  //   description: 'List of users retrieved successfully',
  //   type: FindAllUsersResponseDto,
  // })
  // async findAll(
  //   @Query() query: FindAllUsersQueryDto,
  // ): Promise<FindAllUsersResponseDto> {
  //   return this.usersService.findAll(query);
  // }

  @Get('me')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Get the profile information of the currently authenticated user',
  })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully',
    // type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async getMe(@Req() req: Request & { user: { email: string } }) {
    const user = await this.usersService.findByOption({ email: req.user.email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // @Get('email/:email')
  // @Roles(UserRole.ADMIN, UserRole.STAFF)
  // @ApiOperation({
  //   summary: 'Find user by email',
  //   description:
  //     'Find a specific user by their email address. Admin and Staff only.',
  // })
  // @ApiParam({
  //   name: 'email',
  //   description: 'User email address',
  //   example: 'john.doe@example.com',
  // })
  // @ApiOkResponse({
  //   description: 'User found successfully',
  //   type: UserResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'User with specified email not found',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid email format',
  // })
  // async findByEmail(@Param('email') email: string) {
  //   return this.usersService.findUserByEmail(email);
  // }

  // @Get(':id')
  // @Roles(UserRole.ADMIN, UserRole.STAFF)
  // @ApiOperation({
  //   summary: 'Find user by ID',
  //   description:
  //     'Find a specific user by their unique ID. Admin and Staff only.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'User unique identifier (UUID)',
  //   example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
  // })
  // @ApiOkResponse({
  //   description: 'User found successfully',
  //   type: UserResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'User with specified ID not found',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid UUID format',
  // })
  // async findOne(
  //   @Param('id', ParseUUIDPipe) id: string,
  // ): Promise<UserResponseDto> {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // @Roles(UserRole.ADMIN, UserRole.STAFF)
  // @ApiOperation({
  //   summary: 'Update user information',
  //   description: 'Update user profile information. Admin and Staff only.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'User unique identifier (UUID)',
  //   example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
  // })
  // @ApiOkResponse({
  //   description: 'User updated successfully',
  //   type: UserResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'User not found',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid input data or UUID format',
  // })
  // @ApiResponse({
  //   status: HttpStatus.CONFLICT,
  //   description: 'Email already exists',
  // })
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<UserResponseDto> {
  //   return this.usersService.updateUserInfo(id, updateUserDto);
  // }

  // @Patch(':id/role')
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({
  //   summary: 'Update user role',
  //   description: 'Update the role of a user. Admin only.',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'User unique identifier (UUID)',
  //   example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
  // })
  // @ApiBody({
  //   description: 'Role update request body',
  //   type: UpdateUserRoleDto,
  // })
  // @ApiOkResponse({
  //   description: 'User role updated successfully',
  //   type: UserResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'User not found',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Invalid UUID format or role (only STAFF is allowed)',
  // })
  // async updateRole(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateRoleDto: UpdateUserRoleDto,
  // ): Promise<UserResponseDto> {
  //   return await this.usersService.updateUserField(
  //     id,
  //     'role',
  //     updateRoleDto.role,
  //   );
  // }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Deactivate user',
    description: 'Deactivate a user account (soft delete). Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier (UUID)',
    example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
  })
  @ApiOkResponse({
    description: 'User deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deactivated successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format or user is already deactivated',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Restore user',
    description: 'Restore a deactivated user account. Admin only.',
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier (UUID)',
    example: 'c2adc0a6-7af6-4484-8ae0-72349d78e769',
  })
  @ApiOkResponse({
    description: 'User restored successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User restored successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format or user is already active',
  })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.softDelete(id);
  }
}
