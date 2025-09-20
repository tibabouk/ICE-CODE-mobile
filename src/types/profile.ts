export type ProfileFromApi = {
  firstname?: string;
  lastname?: string;
  dob?: string;
  languages?: string;
  country?: string;
  blood?: string;
  ec1n?: string;
  ec1p?: string;
  ec2n?: string;
  ec2p?: string;
  ec3n?: string;
  ec3p?: string;
  ice_url?: string; // read-only
};

export type ProfileUpdatable = Omit<ProfileFromApi, 'ice_url'>;

export type BasicInfo = {
  firstname?: string;
  lastname?: string;
  dob?: string;
  languages?: string;
  country?: string;
  blood?: string;
};

export type Contacts = {
  ice1n?: string;
  ice1p?: string;
  ice2n?: string;
  ice2p?: string;
  ice3n?: string;
  ice3p?: string;
};