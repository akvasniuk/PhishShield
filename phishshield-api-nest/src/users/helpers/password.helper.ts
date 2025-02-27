import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHelper {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<void> {
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      throw new BadRequestException('Wrong email or password');
    }
  }
}
