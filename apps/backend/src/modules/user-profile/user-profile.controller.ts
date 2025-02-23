import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface RequestUser {
  id: number;
  email: string;
  roles?: string[];
}

@ApiTags('user-profile')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Pobierz dane profilu użytkownika' })
  getProfile(@CurrentUser() user: RequestUser) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.userProfileService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Zaktualizuj dane profilu użytkownika' })
  updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() updateData: UpdateUserProfileDto,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.userProfileService.updateProfile(user.id, updateData);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Pobierz historię transakcji użytkownika' })
  getWalletTransactions(@CurrentUser() user: RequestUser) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.userProfileService.getWalletTransactions(user.id);
  }

  @Get('games')
  @ApiOperation({ summary: 'Pobierz sesje gier użytkownika z paginacją' })
  getGameSessions(
    @CurrentUser() user: RequestUser,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.userProfileService.getGameSessions(user.id, page, limit);
  }
}
