// jest.ui.setup.ts

try {
  require.resolve('react-native/Libraries/Animated/NativeAnimatedHelper');
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));
} catch {

}


jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Ionicons = (props: any) =>
    React.createElement(View, { ...props, testID: 'mock-ionicon' });
  return { Ionicons };
});
