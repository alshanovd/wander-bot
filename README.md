# 🤖 Wander Bot

A command-driven robot simulator that moves a toy robot on a 5x5 grid while preventing it from falling off the table. The robot responds to commands like `PLACE`, `MOVE`, `LEFT`, `RIGHT`, and `REPORT` to navigate and report its position and direction.

## 🚀 Quick Start

Install dependencies:

```bash
npm i
```

Run the application:

```bash
npm run start
```

## 🫡 Robot Commands

- `PLACE X,Y,F` - Place robot at position (X,Y) facing direction F (NORTH/SOUTH/EAST/WEST). First valid PLACE command must be issued before other commands take effect.
- `MOVE` - Move robot one unit forward. Robot won't fall off the table.
- `LEFT` - Rotate robot 90° left (counter-clockwise).
- `RIGHT` - Rotate robot 90° right (clockwise).
- `REPORT` - Display current robot position and direction.

## 🛠️ Available NPM Commands

- `dev` - Run the app in development mode with auto-reload
- `dev-bun` - Run the app using Bun runtime (requires [Bun](https://bun.com/))
- `start` - Run the built application
- `build` - Build the application with [Vite](https://vite.dev/)
- `test` - Run unit tests with [Vitest](https://vitest.dev/)
- `test:dev` - Run tests in watch mode
- `e2e` - Build and run end-to-end tests with [Playwright](https://playwright.dev/)
- `e2e:watch` - Run end-to-end tests in UI watch mode
- `lint` - Check code with [Biome](https://biomejs.dev/) linter

## 🧩 Tech Stack Used

- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest (unit tests) & Playwright (E2E tests)
- **Linting**: Biome
- **Runtime**: Node.js / Bun
- **Development Tools**: Nodemon, TSX, Husky

## 🧪 Testing

### Unit Tests

Unit tests cover all robot commands using Vitest:

- **CommandPlace** - Tests robot placement validation, boundary checking, and direction parsing. Validates that robots can only be placed within board bounds (0-4 for 5x5 grid) and rejects invalid coordinates or directions.
- **CommandMove** - Tests forward movement in all four directions and ensures the robot stops at board edges instead of falling off.
- **CommandLeft & CommandRight** - Tests rotation mechanics, verifying the robot correctly rotates through all four directions (NORTH → WEST → SOUTH → EAST).
- **CommandReport** - Tests the report functionality across various robot positions and directions.
- **CommandFormatter** - Tests command parsing and normalization (converting input to uppercase).

Run tests with:
```bash
npm run test       # Run once
npm run test:dev   # Watch mode
```

### End-to-End Tests

End-to-end tests using Playwright validate the complete application flow:

- **Simple Case** - Basic integration test: places a robot, moves it twice, and verifies final position and direction.
- **100 Commands Stress Test** - Tests the application with 100 random commands on a 10x10 board, including `PLACE`, `MOVE`, `LEFT`, `RIGHT`, and `REPORT` to ensure reliability under varied input.
- **1000 Commands Stress Test** - Comprehensive stress test with 1000 commands, including edge cases like invalid placements, commands before robot placement, and boundary conditions to verify performance and correctness.

Run E2E tests with:
```bash
npm run e2e         # Build and run tests
npm run e2e:watch   # Watch mode with UI
```
## 📖 Verbose Mode
You can turn on app notifications by switching `AlertSilence` to `AlertColor` in [src/alert/alert-service.ts](src/alert/alert-service.ts). <br>**⚠️ Warning!** This is for dev purposes, tests will fail when different than `AlertSilence` provider is used.

## 🔁 CI / CD
- **Pre-commit Hooks**: Husky runs linting checks (`npm run lint`) before every commit to ensure code quality and prevent style violations.
- **Deployment Pipelines**: When deployed to production, we would integrate automated testing and E2E tests into CI/CD pipelines. Additionally, test coverage would be expanded to cover more edge cases and scenarios.