import { EmailActionsEnum } from '../constants/email-actions.enum';

export const templateInfo: Record<EmailActionsEnum, { templateName: string; subject: string }> = {
  [EmailActionsEnum.WELCOME]: {
    templateName: 'welcome',
    subject: 'Welcome on board',
  },
  [EmailActionsEnum.DELETE_USER]: {
    templateName: 'delete.account',
    subject: 'Account successfully deleted',
  },
  [EmailActionsEnum.UPDATE_USER]: {
    templateName: 'update.account',
    subject: 'Account successfully updated',
  },
  [EmailActionsEnum.VERIFY_ACCOUNT]: {
    templateName: 'activate.account',
    subject: 'Activate your account',
  },
  [EmailActionsEnum.CHANGE_PASSWORD]: {
    templateName: 'change.password',
    subject: 'Change password',
  },
};
