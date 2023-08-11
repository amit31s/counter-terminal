# Visual Studio Code Extensions

Please install the following VSCode extensions:

- Code spell checker
- ESLint
- Prettier

# Coding Standards for Counter Terminal

## Spelling Spelling

To avoid spelling mistakes, everyone should install and use a spell checker. VSCode users can use this:

https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker.

## No large Files - Causes maintainability issues

Files should contain no more than 200 lines. If a file is larger than this, consider ways to separate concerns and refactor. Think dry principle.
<br> <br>

## No Prop Drilling – Causes maintainability issues

In lieu of global state management, we should utilise component composition, lifting components up to where they are needed.

```export const App = () => {
  const [data, setData] = useState<string>("some state");

  return (
    <ParentComponent>
      <ComponentOne>
        <ComponentTwo data={data} />
      </ComponentOne>
    </ParentComponent>
  );
}
```

<br>

### OR

<br>

```
type AppProps = {
  name: string;
};

export const App = () => {
  const [user, setUser] = useState<AppProps>({ name: 'Steve' });
  return (
    <View>
      <Navbar />
      <MainPage content={<Content message={<Message user={user} />} />} />
    </View>
  );
};
```

<br>

## Component Styling - Causes maintainability issues

Inline-Styling should be avoided as it reduces scalability and will make the project difficult to maintain in the long term.

<br>

## Console logs and unused functions – performance and maintainability

console.logs and unused functions should be deleted once we are finished with them, this will make the codebase cleaner and easier to read. Also, as the console.log statements build up it can have implications on app performance.

<br>

## React Conventions – Improvements in code quality

Where possible we should add components to return statements rather than passing functions directly. This has state lifecycle implications and makes components harder to debug, e.g.:

```
<SomeComponent />;
// Instead of
someComponent();
```

<br>

### Use of React.FC

We should type our arguments rather than use React.FC. This is because React.FC types a function NOT the arguments. Here is an example:

```
type HomeProps = {
  children?: React.ReactNode;
};

export const Home = ({ children }: HomeProps) => {};
// Instead of
export const Home: FC<HomeProps> = ({ children }) => {};
```

# Other Considerations

## Refactoring

Where possible, we should refactor components to avoid repetition. This will help to make the project more maintainable for future devs.

## Components

Rather than specific components for specific use cases, where practical, components should be reusable. If for example, a button exists which does not fit your use case, before creating a similar button, check if the original button can be extended for your needs using a switch statement, variables to control the type of button to be displayed, or something similar.

## Feature folders

All features should be developed in respective Folders e.g., the Home screen has many features e.g., Modals, BasketView, NumericPad.

These files should live in separate feature folders e.g.

features/HomeScreenModals features/BasketView features/NumericPad, etc.

# Counter terminal app - steps to setup development environment and making changes in counter terminal

## Cache clean

```bash
yarn cache-clean --force
```

## Installation

```bash
yarn
```

## Build

```bash
yarn prebuild
```

## Run Web build for dev environment

```bash
yarn web
```

## Start metro server

```bash
yarn start
```

## Linter

```bash
yarn lint
```

## Test

```bash
yarn test
```

To run tests in the background

```bash
yarn watch
```

## Enabling PED Device Server on local

PED Device server is a small websocket server that communicates with the Pin Pad. To enable this via journeys, set the following environment variables in `package.json`:

```
 REACT_APP_POL_DEVICE_SERVER_HOST=ws://localhost:2001
 REACT_APP_POL_DEVICE_SERVER_SIMULATED_ELECTRON=true
 REACT_APP_POL_DEVICE_SERVER_SIMULATED_SIMULATOR=true
```

If `REACT_APP_POL_DEVICE_SERVER_SIMULATED_[ENV]` is set to `true`, the existing approach can be used (Broadcast Channels). _A sample of this would be_:

```
const ped = new BroadcastChannel("IngenicoPed");
ped.postMessage({ event: "Success | "NotSupported" | "InvalidCard", pan: "Sample PAN Mask from Tokeniser"});
```

You can override the TPV used by the Pin Pad using environment variable `REACT_APP_POL_PED_TPV_OVERRIDE`.
To perform an automatic initialisation of the PED, you can set `REACT_APP_INITIALISE_PED_ON_LOGIN` to `true`. Bu default this is false.

If you have a Pin Pad, you can set it up as per the instructions here:
https://pol-jira.atlassian.net/wiki/spaces/SPM/pages/10528069992/Setup+of+PMS

By default, the PED Device Server is disabled. When running on simulator, the PED Device Server will automatically broadcast channels.

## Hygen

Hygen is a code generation tool that allows you to generate files and folders from templates. To install hygen follow the installation instructions here: http://www.hygen.io/docs/quick-start

Currently this project contains just one codegen template which can be executed with the following script:

```
yarn new-component
```

This will prompt you for a component name and will then generate the following folder structure:

```
- <Component_Name>
  - index.ts
  - <Component_Name>.tsx
```

The `index.ts` and `<Component_Name>.tsx` files are prefilled with boilerplate React code, so using this hygen template should save time.

## In order to toggle Product journey display in counter terminal from S3 location to reading from local follow these steps.

- Go to spm/apps/counter-terminal/src/components/JourneyRenderer/index.tsx
- We have kept here ways and comments to read counterjourney from journey-manager or S3, you can use them locally incase of any issue related with reading data from S3 location.

## Flags used in Counter Terminal

## Enabling Auto Cache Clear on Install of build

REACT_APP_CLEAR_CACHE_ON_UPDATE - boolean flag

## Case when you should enable REACT_APP_CLEAR_CACHE_ON_UPDATE flag 
1. When in newer version of App, there is any change in structure of localpersisted information for example cash drawer.
2. When there is any change in device cognito or user cognito details in newer version of App.

It would remove previous version App cache from following locations -
~AppData/Roaming/counterterminal
~AppData/Local/Temp/counterterminal
- App localStorage 

You should use this flag only when installing the newer version of App's device cache is required to be cleared otherwise keep this flag as false or disabled.


## Storybook

To use storybook with electron in Counter Terminal run `yarn storybook` then in a second terminal run `yarn electron-storybook`

## Running Electron on Linux with deep links configured

To run electron on Linux you must first install a built version of the Electron app in order to set up the deep link scheme. You won't need to run the built app, we're just leveraging the installer to set up the deep link scheme for us. All you need to do is follow these steps:

1. run `yarn make-dev` (or any of the other `make-[ENV]` commands)
2. install the `.deb` or `.rpm` file. E.g. the following command will install version 0.0.1 of the counterterminal `.deb` app: `sudo dpkg -i ./out/make/deb/arm64/counterterminal_0.0.1_arm64.deb`
3. This will have set up the `.desktop` file for you - you can verify this by checking the following file exists `/usr/share/applications/counterterminal.desktop`
4. The deep links will now work correctly even in development, and you can run `yarn electron` to start up the development server
