import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return hash(password);
  }

  verify(hashValue: string, password: string): Promise<boolean> {
    return verify(hashValue, password);
  }
}
