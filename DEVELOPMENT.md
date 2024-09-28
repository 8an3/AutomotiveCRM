# Contribute to the Codebase

- Clone the repository
- install dependency with `npm install`
- build the packages with `npm run build`

```cmd
[in / dir]
npm install
[in / dir]
npm run build
```

Due to modifications we use @eightanthreepdfme/ui instead of @pdfme/ui. As long as this project is in use, so will the customized library. If it isn't already install or its missing.

```cmd
[in / dir]
 npm install @eightanthreepdfme/ui
 ||
 npm install https://github.com/8an3/eightandthreepdfme-ui.git
```

Then, we will need to populate the .env file with the needed values.

```cmd
[in pdfme/packages/common dir] $ npm run dev
[in pdfme/packages/schemas dir] $ npm run dev
[in pdfme/packages/ui dir] $ npm run dev
[in pdfme/packages/generator dir] $ npm run dev
```

If you want to check the changes in the browser, go to `playground`.

```cmd
[in pdfme/playground dir] $ npm install
[in pdfme/playground dir] $ npm run dev
```

If `npm run dev` is running in each package, changes made will be reflected in the playground. (For the UI package, it may take about 5-10 seconds for the changes to be reflected.)

Please feel free to send a PR if you can fix bugs or add new features. Also, don't forget to add the necessary tests before sending a PR and make sure that the tests pass.

Happy hacking!
