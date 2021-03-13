# Runesmith

_Runesmith_ is a tool for generating custom [Roll20](https://roll20.net) character sheets from [React](https://reactjs.org) components.

It is a work in progress. Use at your own risk 😎

# About Roll20's _Character Sheet Enhancements_

As of March 2021, Roll20 is working on a new way to process and display character sheets. As sheet authors, more options will be available to us, but it drastically changed the way this tool's dev mode works. If you use the #march-2021 branch when installig this package, you'll be all set. I won't push that branch to #main until the changes go live on Roll20.

## Usage

Add _Runesmith_ to your project along with React and React-Dom.

```
yarn add runesmith@adrianthewriter/runesmith
yarn add react react-dom
```

Add the following scripts to your `package.json` file.

```
"scripts": {
  "start": "runesmith start",
  "build": "runesmith build"
},
```

### About aliases

To resolve aliases in your templates, include a `jsconfig.json` file and configure the _baseUrl_ and _paths_ properties. Runesmith is configured to look here when configuring your aliases inside webpack.

## Todo

- [x] Render _layout_ components from the `src/layout` directory to a mock roll20.net app in when using `yarn start`
- [x] Generate _project-name.html_ and _project-name.css_ in `build` directory that are ready to upload to roll20.net as a custom character sheet when using `yarn build`
- [x] Append _roll template_ components from `src/templates` directory to _project-name.html_ when using `yarn build`
- [x] Process and bundle SheetWorker javascript in the `src/scripts` directory and append it to _project-name.html_ when using `yarn build`
- [x] Upgrade to reflect changes to character sheet processing on Roll20 (in #march-2021 branch)
- [ ] Generate a _translation.json_ file if i18n tags are used on the sheet when using `yarn build`
- [ ] Generate a customizable project _README_ when using `yarn build`
