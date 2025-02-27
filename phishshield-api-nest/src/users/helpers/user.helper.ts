import { Injectable } from '@nestjs/common';

@Injectable()
export class UserHelper {
  userNormalization(userToNormalize: Record<string, any> = {}, fieldsToRemove: string[] = []): Record<string, any> {
    const defaultFieldsToRemove = ['password', 'emailToken', 'deleted', 'deletedAt', 'passwordToken'];

    const fields = fieldsToRemove.length ? fieldsToRemove : defaultFieldsToRemove;

    fields.forEach(field => {
      delete userToNormalize[field];
    });

    return userToNormalize;
  }
}
