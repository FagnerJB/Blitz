# Blitz eBook Framework

An eBook framework (CSS + template) whose mantra is “finding simple solutions to complex issues.”

## Licence

Blitz is released under [MIT Licence](https://github.com/FriendsOfEpub/Blitz/blob/master/LICENSE) © 2016, Jiminy
Panoz.

## Support

- Readium SDK
- Adobe RMSDK
- iBooks
- Kobo
- Google Play Books
- Kindle (mobi7 + KF8)

## How to Use

There are various ways to use blitz, from adding the available stylesheets (`CSS` folder) to building them with the
LESS framework.

### Use the Provided Stylesheets

You can either add `blitz.css` or an alternative stylesheet in your EPUB file.

`blitz.css` is commented but you’ll find an uncommented version in the `AltStylesheets` folder (which helps you save
some 7kb).

In this folder, you’ll also find `blitz-lite.css` and `blitz-reset.css` (normal + minified).

1. `blitz-lite.css` should be enough for simple books like novels and essays (it’s 3kb);
2. `blitz-reset.css` is just… the reset we’ve designed (it’s 1kb).

Add styles on top of those two is up to you… But you’ll then miss the powerful tools we’ve built in LESS!

### Install and Compile With npm

First go to the blitz root directory and install the dev dependencies:

```
npm install
```

Then make your changes in LESS and run:

```
npm run build
```

This will compile the LESS src to the default, lite and reset stylesheets, and update the template.

If you want to compile only one stylesheet you can run:

- `build:default` for the default output (`blitz.css`) – that will update the template’s unzipped src too;
- `build:lite` for the lite output (`blitz-lite.css`);
- `build:reset` for the reset output (`blitz-reset.css`);

All those sub-builds will generate uncommented/minified files as well.

Finally, to update the packaged EPUB file then use `npm run make`.

## Design & Goals

Blitz was designed to deal with the significant obstacles a newcomer or even an experienced producer might encounter.
Its major goals are:

1. to be simple and robust enough;
2. to offer a sensible default;
3. to manage backwards compatibility (ePub 2.0.1 + mobi 7);
4. to provide useful tools (LESS);
5. to get around reading modes (night, sepia, etc.);
6. to **not** disable user settings.

We have chosen a functional approach (FCSS) but LESS presets are planned to provide meaningful class names depending
on eBook’s type (poetry, plays, etc.).

### The 4 Principles of Blitz

1. **Espouse [inheritance and the cascade](https://www.w3.org/wiki/Inheritance_and_cascade)**, the 2 fundamental
   principles of CSS. eBooks are documents, CSS was designed for documents… It’s a match!
2. **Build and refine**, don’t style and undo. Don’t override your own styles, create reusable components—the reset
   should help you do that.
3. **Don’t fight, skirt.** Be smart, it’s not worth fighting RS’ default stylesheets (their selectors and !importants
   are too much hassle), _trompe le monde._
4. **Have fun!** We’ve done our utmost to help you avoid common pitfalls. You don’t have to deal with the crappiest
   parts of eBook CSS authoring, sit back and relax.

## Log

### 2.0.0

- Template: New file structure and names.
- CSS: New styles.
- CLI: Script to create template file.

### Before 1.5.2

[Changelog](https://github.com/FriendsOfEpub/Blitz?tab=readme-ov-file#log)
