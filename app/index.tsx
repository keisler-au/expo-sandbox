import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Profile from './components/Profile';
import Publish from './components/Publish';
import Settings from './components/Settings';
import Play from './components/Play';

import { useNavigation } from "expo-router";



const Stack = createStackNavigator();

export default function Index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]); 

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Publish" component={Publish} />
      <Stack.Screen name="Play" component={Play} />
    </Stack.Navigator>
  )
}
