import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';

import { useNavigation } from "expo-router";



const Stack = createStackNavigator();

export default function Index() {
  // const navigation = useNavigation();
  // navigation.setOptions({ headerShown: false });
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  )
}
