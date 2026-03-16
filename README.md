# NCU Pony Racer

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Architecture

```mermaid
graph TD
  NCUPonyracer["NCU Ponyracer"] --> Menu
  NCUPonyracer --> Home
  NCUPonyracer --> Races
  Menu
  Races --> Race1
  Races --> Race2
  Race1 --> Pony1
  Race1 --> Pony2
  Race1 --> Pony3
  Race2 --> Pony4
  Race2 --> Pony5
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Run [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)

1. Open Chrome
    - On Windows: Launch PowerShell by Administrator
      ```bash
      & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-mcp-profile"
      ```
    - On MacOS
      ```bash
      /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \ --remote-debugging-port=9222 \ --user-data-dir=/tmp/chrome-mcp-profile
      ```

2. Start `chrome-devtools`

3. Serve the website

4. Ask something about the website under `Agent` mode

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
