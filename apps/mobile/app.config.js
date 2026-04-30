const isIosBuild = process.env.EAS_BUILD_PLATFORM === "ios";

const splashConfig = {
  image: "./assets/native-splash-icon.png",
  imageWidth: 1,
  resizeMode: "contain",
  backgroundColor: "#101C34",
  dark: {
    image: "./assets/native-splash-icon.png",
    imageWidth: 1,
    resizeMode: "contain",
    backgroundColor: "#101C34",
  },
};

const plugins = [
  "expo-router",
  "expo-sqlite",
  ["expo-splash-screen", splashConfig],
  ...(isIosBuild
    ? [
        [
          "expo-iap",
          {
            modules: {
              onside: false,
              horizon: false,
            },
          },
        ],
      ]
    : []),
  [
    "expo-location",
    {
      locationWhenInUsePermission:
        "Sükût, kıble yönünü ve yakın şehir bilgisini daha doğru hesaplamak için konumunu yalnızca uygulamayı kullanırken ister.",
    },
  ],
  [
    "expo-notifications",
    {
      icon: "./assets/notification-icon.png",
      color: "#D8A84E",
    },
  ],
];

module.exports = {
  expo: {
    name: "Sükût",
    slug: "sukut",
    scheme: "sukut",
    version: "0.1.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.sukut.app",
      buildNumber: "4",
      requireFullScreen: true,
      supportsTablet: true,
      usesNonExemptEncryption: false,
      infoPlist: {
        UIStatusBarHidden: true,
        UIViewControllerBasedStatusBarAppearance: false,
        NSLocationWhenInUseUsageDescription:
          "Sükût, kıble yönünü ve yakın şehir bilgisini daha doğru hesaplamak için konumunu yalnızca uygulamayı kullanırken ister.",
        NSMotionUsageDescription:
          "Sükût, kıble pusulasını telefon yönüne göre göstermek için cihaz sensörlerini kullanır.",
        NSLocationTemporaryUsageDescriptionDictionary: {
          QiblaAccuracy:
            "Konum, kıble yönünü daha doğru göstermek için kullanılır.",
        },
      },
    },
    android: {
      package: "com.sukut.app",
      versionCode: 1,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "POST_NOTIFICATIONS",
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#101C34",
      },
    },
    androidStatusBar: {
      hidden: true,
      translucent: true,
      backgroundColor: "#101C34",
      barStyle: "light-content",
    },
    androidNavigationBar: {
      visible: "immersive",
      backgroundColor: "#101C34",
      barStyle: "light-content",
    },
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/native-splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#101C34",
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/notification-icon.png",
    },
    plugins,
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appDisplayName: "Sükût",
      bundleIdPlaceholder: "com.sukut.app",
      router: {
        origin: false,
      },
      eas: {
        projectId: "7b8883d9-2177-4342-afef-fecd6958fbf3",
      },
    },
    owner: "smtycl",
  },
};
