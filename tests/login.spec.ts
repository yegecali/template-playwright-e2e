import { test, expect } from '../src/fixtures';
import { users } from '../src/data/users';

test.describe('Login', () => {
  // Estas pruebas parten sin sesión, aunque el proyecto use storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('inicia sesión con credenciales válidas', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('muestra error con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.login('usuario_inexistente', 'clave_incorrecta');

    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
