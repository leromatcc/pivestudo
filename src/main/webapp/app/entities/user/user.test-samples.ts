import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 6366,
  login: 'nMl@1L0P\\(5MBYJ\\&2N\\WdMjrG\\QaZ',
};

export const sampleWithPartialData: IUser = {
  id: 16885,
  login: 'I7n6',
};

export const sampleWithFullData: IUser = {
  id: 30775,
  login: 'nK',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
