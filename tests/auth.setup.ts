import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../src/pages/LoginPage';
import { users } from '../src/data/users';
import { AUTH_FILE } from '../src/config/paths';

// Inicia sesión una sola vez y guarda el estado (cookies / localStorage)
// para reutilizarlo en las pruebas que requieren un usuario autenticado.
setup('autenticar usuario estándar', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await page.waitForURL(/inventory\.html/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
