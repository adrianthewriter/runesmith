# Runesmith

_Runesmith_(ᚱ) is a tool for generating custom [Roll20](https://roll20.net) character sheets from [React](https://reactjs.org) components.

It is a work in progress. Use at your own risk 😎

## About this branch

I'm testing a new tool I heard of called [Vite](https://vitejs.dev). IDK if it will work for what I'm trying to do...

## Usage

tbd

## Todo

- [ ] Render _layout_ components from the `src/layout` directory to a mock roll20.net app in when using `rs start`
- [ ] Generate _project-name.html_ and _project-name.css_ in `build` directory that are ready to upload to roll20.net as a custom character sheet when using `rs build`
- [ ] Append _roll template_ components from `src/templates` directory to _project-name.html_ when using `rs build`
- [ ] Process and bundle SheetWorker javascript in the `src/scripts` directory and append it to _project-name.html_ when using `rs build`
- [ ] Generate a _translation.json_ file if i18n tags are used on the sheet when using `rs build`
- [ ] Generate a customizable project _README_ when using `rs build`
