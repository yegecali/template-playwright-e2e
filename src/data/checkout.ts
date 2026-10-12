import { faker } from '@faker-js/faker';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Datos generados en cada ejecución para evitar dependencias entre pruebas
export function buildCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'),
    ...overrides,
  };
}
