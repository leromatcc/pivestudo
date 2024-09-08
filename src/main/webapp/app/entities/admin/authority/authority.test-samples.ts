import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '70db5191-32a4-45f8-b8fb-20dbc2c37412',
};

export const sampleWithPartialData: IAuthority = {
  name: '4d0e6024-2166-449b-ace1-14cbc9c0169f',
};

export const sampleWithFullData: IAuthority = {
  name: 'f9b67825-e2b1-41fd-bbda-fd16ce25ca86',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
