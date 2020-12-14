<div align="center">
  <img src="assets/logo.png" alt="github-story-points" width="600">
  <br>
  <b>Browser extension to add story points to GitHub projects</b>
  <hr>
</div>

### Install

- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/fdhfdpafombnahpjjjcfopmehfofbdko.svg?label=%20">][link-cws]
- [**Firefox** add-on][link-amo] [<img valign="middle" src="https://img.shields.io/amo/v/github-story-points.svg?label=%20">][link-amo]

### Usage

You need to create issue with a title starting with `[Xpt]` or with add a label `sp: X` to accumulate the number of points.

![Example](./assets/images/example.png)

![GIF](./assets/sample.gif)

### Develop

To develop locally:

- Build your extension using `yarn build`.
- Go to `chrome://extensions/` and activate the developer mode (tutorial [here](https://support.google.com/chrome/a/answer/2714278?hl=en) ).
- Finally, click `Load unpacked` and add the folder to the extension.
- If you make changes, you can simply reload the extension using the reload button in `chrome://extensions/`

### Demo

You can try [demo project](https://github.com/banyan/github-story-points-sandbox/projects/1) after installed extension.

### License

MIT

[link-cws]: https://chrome.google.com/webstore/detail/github-story-points/fdhfdpafombnahpjjjcfopmehfofbdko 'Version published on Chrome Web Store'
[link-amo]: https://addons.mozilla.org/en-US/firefox/addon/github-story-points/ 'Version published on Mozilla Add-ons'
