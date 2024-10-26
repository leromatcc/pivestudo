import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '7d593a58-f2dc-4c71-bcde-04169c14b906',
};

export const sampleWithPartialData: IAuthority = {
  name: 'fb72eb1d-df1c-42c8-bd5d-bfde86de51f8',
};

export const sampleWithFullData: IAuthority = {
  name: '656dd6e4-da2c-4101-836b-fa9695d23856',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
