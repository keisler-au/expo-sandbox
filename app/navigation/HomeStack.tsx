import { createStackNavigator } from '@react-navigation/stack';
import Home from '../components/Home';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import Publish from '../components/Publish';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
      <Stack.Screen name="Publish" component={Publish} options={{ headerShown: false}} />
    </Stack.Navigator>
  );
};

export default HomeStack;
