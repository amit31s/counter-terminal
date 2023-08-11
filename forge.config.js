require("dotenv").config();

module.exports = {
  packagerConfig: {
    icon: "public/favicon.ico",
    protocols: [
      {
        protocol: "po",
        name: "Counter Terminal",
        schemes: ["po"],
      },
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 2057,
        manufacturer: "Post Office Ltd.",
        name: "Counter Terminal",
        shortName: "counterTerminal",
        appIconPath: "public/favicon.ico",
        upgradeCode: "bb01f636-4476-43fd-83f6-668565131744",
        lightSwitches: ["-sval"],
      },
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        mimeType: ["x-scheme-handler/po"],
        name: "CounterTerminal",
        exe: "counterterminal.exe",
        authors: "Post Office",
        owners: "Post Office",
        copyright: "Post Office",
        description: "Counter Terminal Windows",
        icon: "public/favicon.ico",
        setupExe: "setup.exe",
        setupIcon: "public/favicon.ico",
        loadingGif: "public/logo.gif",
        remoteRelease: "https://electron-update-server-bucket.s3.eu-west-2.amazonaws.com",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        mimeType: ["x-scheme-handler/po"],
        background: "./src/assets/images/homeBackgroundImg.png",
        format: "ULFO",
        additionalDMGOptions: {
          window: {
            size: {
              width: 642,
              height: 706,
            },
          },
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        mimeType: ["x-scheme-handler/po"],
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        mimeType: ["x-scheme-handler/po"],
      },
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-s3",
      config: {
        bucket: process.env.ELECTRON_UPDATE_BUCKET_NAME,
        folder: process.env.ELECTRON_UPDATE_BUCKET_FOLDER,
        region: process.env.ELECTRON_UPDATE_BUCKET_REGION,
        public: false,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        devContentSecurityPolicy: `style-src-elem 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data:; connect-src https://fonts.googleapis.com https://fonts.gstatic.com https://nbit-user-authentication.ipt.cdp.postoffice.co.uk https://poapps.auth.eu-west-2.amazoncognito.com http://localhost:3000 https://eu-west-2.console.aws.amazon.com https://cognito-idp.eu-west-2.amazonaws.com https://cognito-identity.eu-west-2.amazonaws.com/ https://postofficetest.service-now.com https://api.spm-dev.com https://branch-back-office.spm-dev.com https://api.spm-int.com https://branch-back-office.spm-int.com https://api.spm-preprod.com https://branch-back-office.spm-preprod.com https://api.spm-prod.com https://branch-back-office.spm-prod.com https://api.spm-test1.com https://branch-back-office.spm-test1.com https://api.spm-test2.com https://branch-back-office.spm-test2.com https://api.spm-devmaster.com https://branch-back-office.spm-devmaster.com https://api.spm-dev2.com https://branch-back-office.spm-dev2.com https://api.spm-dev3.com https://branch-back-office.spm-dev3.com https://api.spm-dataref.com https://branch-back-office.spm-dataref.com https://api.spm-test3.com https://branch-back-office.spm-test3.com https://api.spm-test4.com https://api.spm-training.com https://api.spm-incidentfix.com https://api.spm-dataref.com https://branch-back-office.spm-test4.com https://branch-back-office.spm-training.com https://branch-back-office.spm-incidentfix.com https://branch-back-office.spm-dataref.com    https://nbit-user-authentication.ipt.cdp.postoffice.co.uk https://api.ipt.cdp.postoffice.co.uk https://api.ra.cdp.postoffice.co.uk https://branch-ui-auth.spm-int.com https://branch-ui-auth.spm-test4.com https://branch-ui-auth.spm-incidentfix.com https://branch-ui-auth.spm-training.com https://branch-ui-auth.spm-dataref.com ws:; script-src 'self' 'unsafe-eval'; default-src 'self' 'unsafe-eval' 'unsafe-inline'; worker-src blob: data:;`,
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./public/index.html",
              js: "./src/index.js",
              name: "counter_terminal_window",
              preload: {
                js: "./src/electron/preload.ts",
              },
            },
            {
              html: "./public/index.html",
              js: "./src/electron/boEntry.tsx",
              name: "back_office_window",
            },
          ],
        },
      },
    ],
  ],
};
