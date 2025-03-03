import { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import Home from './components/Home';
import Profile from './components/Profile';
import Publish from './components/Publish';
import Settings from './components/Settings';
import PlayWrapper from './components/Play';




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
      <Stack.Screen name="Play" component={PlayWrapper} />
    </Stack.Navigator>
  )
}
