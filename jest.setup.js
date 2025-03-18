jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: jest.fn().mockReturnValue({
    isConnected: true,
  }),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("react-use-websocket", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    sendMessage: jest.fn(),
    lastMessage: null,
    readyState: 1,
  })),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true]),
  isLoaded: jest.fn(() => {}),
  loadAsync: jest.fn(() => {}),
}));

jest.mock("sentry-expo", () => ({
  Native: {
    captureException: jest.fn(),
  },
}));
