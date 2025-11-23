export interface AdditionalProvider {
  provider: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  idToken?: string;
  accessToken?: string;

  [key: string]: unknown;
}

export interface AuthentifiableUser {
  id: string;
  name?: string;
  imageUrl?: string;
  additional: AdditionalProvider;
}

export class AuthUser implements AuthentifiableUser {
  id: string;
  name?: string;
  imageUrl?: string;
  additional: AdditionalProvider;

  constructor(user: AuthentifiableUser) {
    this.id = user.id;
    this.name = user.name;
    this.imageUrl = user.imageUrl;
    this.additional = user.additional;
  }

  get firstName(): string | undefined {
    return this.additional.firstName;
  }

  get lastName(): string | undefined {
    return this.additional.lastName;
  }

  get email(): string | undefined {
    return this.additional.email;
  }

  get accessToken(): string | undefined {
    return this.additional.accessToken;
  }

  get idToken(): string | undefined {
    return this.additional.idToken;
  }
}
