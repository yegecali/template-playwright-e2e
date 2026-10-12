# Template Playwright E2E

Proyecto base para pruebas end-to-end con **Playwright + TypeScript**, preparado para trabajar con varios ambientes, datos de prueba generados y sesiones reutilizables.

El sitio de ejemplo es [saucedemo.com](https://www.saucedemo.com).

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
npm run install:browsers
cp .env.example .env.local   # solo si necesitas secretos locales
```

## Ejecución

| Comando | Descripción |
| --- | --- |
| `npm test` | Ejecuta todas las pruebas con el ambiente por defecto (`dev`) |
| `npm run test:dev` | Ejecuta contra el ambiente `dev` |
| `npm run test:staging` | Ejecuta contra el ambiente `staging` |
| `npm run test:headed` | Muestra el navegador durante la ejecución |
| `npm run test:ui` | Abre el modo UI de Playwright |
| `npm run test:debug` | Modo depuración paso a paso |
| `npm run report` | Abre el reporte HTML |
| `npm run typecheck` | Valida los tipos de TypeScript |

Ejecutar un archivo o prueba específica:

```bash
ENV=dev npx playwright test tests/login.spec.ts
ENV=dev npx playwright test -g "compra un producto"
```

## Estructura

```
.
├── playwright.config.ts        # Configuración global (timeouts, reporters, proyectos)
├── tests/
│   ├── auth.setup.ts           # Login único que guarda la sesión en .auth/
│   ├── login.spec.ts           # Pruebas de autenticación (sin sesión previa)
│   └── checkout.spec.ts        # Flujo de compra (usa sesión reutilizada)
├── src/
│   ├── config/env.ts           # Carga y valida variables por ambiente
│   ├── data/
│   │   ├── users.ts            # Usuarios según el ambiente
│   │   ├── products.ts         # Identificadores de productos
│   │   └── checkout.ts         # Generación de datos con Faker
│   ├── pages/                  # Page Object Model
│   └── fixtures/index.ts       # `test` extendido con page objects y datos
├── .env.dev                    # Variables del ambiente dev (no sensibles)
├── .env.staging                # Variables del ambiente staging
├── .env.example                # Plantilla de variables
├── .auth/                      # Sesión generada (ignorado por git)
└── reports/                    # Reportes HTML y JUnit (ignorado por git)
```

## Ambientes y variables

El ambiente se selecciona con la variable `ENV` (por defecto `dev`). Se carga `.env.<ENV>` y, por encima de él, `.env.local`. Las variables ya definidas en el sistema tienen la máxima prioridad.

| Variable | Descripción |
| --- | --- |
| `ENV` | Nombre del ambiente: `dev`, `staging`, etc. |
| `BASE_URL` | URL base de la aplicación |
| `STANDARD_USER` | Usuario con permisos completos |
| `STANDARD_PASSWORD` | Contraseña del usuario |

Para agregar un ambiente nuevo, crea `.env.<nombre>` con las mismas variables y ejecuta `ENV=<nombre> npx playwright test`.

**Secretos:** nunca los pongas en `.env.<ENV>`. Usa `.env.local` en tu máquina o variables de entorno / secretos del CI.

## Datos de prueba

- **Datos estáticos** (usuarios, productos): en `src/data/`.
- **Datos dinámicos**: `src/data/checkout.ts` genera nombres y códigos postales con Faker en cada ejecución, así las pruebas no dependen de datos previos. Usa `buildCheckoutInfo({ postalCode: '00000' })` para sobrescribir campos concretos.
- **Datos por prueba**: crea fixtures nuevos en `src/fixtures/index.ts` cuando un dato se repita en varios tests.

## Autenticación

`tests/auth.setup.ts` corre una sola vez antes de la suite (proyecto `setup`), inicia sesión y guarda el estado en `.auth/standard.json`. El proyecto `chromium` reutiliza ese estado mediante `storageState`, así que las pruebas que necesitan sesión no repiten el login.

Para una prueba que debe partir sin sesión, usa:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

Si necesitas otro rol, agrega un nuevo setup (por ejemplo `admin.setup.ts`) que guarde en otro archivo, y un proyecto que lo use.

## Page Object Model y fixtures

1. Crea la clase en `src/pages/` usando `page.getByTestId(...)` (el atributo configurado es `data-test`).
2. Regístrala como fixture en `src/fixtures/index.ts`.
3. Importa `test` y `expect` desde `../src/fixtures` en tus specs.

## Buenas prácticas incluidas

- Selectores por `data-test`, más estables que CSS o texto.
- Aserciones web con `expect` (con auto-espera), sin `waitForTimeout`.
- `trace`, `screenshot` y `video` solo en fallos.
- `retries` y `workers` ajustados automáticamente en CI (`CI=true`).
- `forbidOnly` en CI para evitar `test.only` olvidados.

## Integración con CI

Ejemplo mínimo para GitHub Actions:

```yaml
- run: npm ci
- run: npx playwright install --with-deps chromium
- run: npm run test:staging
  env:
    CI: true
    STANDARD_USER: ${{ secrets.STANDARD_USER }}
    STANDARD_PASSWORD: ${{ secrets.STANDARD_PASSWORD }}
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: reports/
```
