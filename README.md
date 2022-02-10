# Runesmith

_Runesmith_ is a tool for generating custom [Roll20](https://roll20.net) character sheets from [React](https://reactjs.org) components. Made using [Deno 🦕](https://deno.land).

It is a work in progress. Use at your own risk 😎

## Usage

Add _Runesmith_ to your deno project.

```js
// deps.ts

import * as Runesmith from "https://denopkg.com/adrianbrooks/runesmith@february-2022/mod.ts"
```

That's as far as I've gotten on this branch. More details here when I have them :)

<!-- TODO: Revisit 'Usage' example -->

## Roadmap

- [ ] Render _layout_ components from the `src/layout` directory to a mock roll20.net app in when using `rs start`
- [ ] Generate _project-name.html_ and _project-name.css_ in `build` directory that are ready to upload to roll20.net as a custom character sheet when using `rs build`
- [ ] Append _roll template_ components from `src/templates` directory to _project-name.html_ when using `rs build`
- [ ] Process and bundle SheetWorker javascript in the `src/scripts` directory and append it to _project-name.html_ when using `rs build`
- [ ] Generate a _translation.json_ file if i18n tags are used on the sheet when using `rs build`
- [ ] Generate a customizable project _README_ when using `rs build`
