/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ColorSchemeName} from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import {RootStackParamList, RootTabParamList} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';
import Account from '../screens/Account';
import Docs from '../screens/Docs';
import {useWeb3Modal} from '@web3modal/react-native';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {isConnected} = useWeb3Modal();
  return (
    <Stack.Navigator>
      {isConnected ? (
        <Stack.Screen
          name="Root"
          // the Root path renders the component mentioned below.
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="Root"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{title: 'Oops!'}}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const theme = useColorScheme();

  return (
    <SafeAreaProvider>
      <BottomTab.Navigator
        // first screen visible after login
        initialRouteName="Docs"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors['brand'].light.text,
          tabBarActiveBackgroundColor: Colors['brand'][theme].background,
          tabBarLabelStyle: {textAlign: 'center'},
        }}>
        <BottomTab.Screen
          name="Docs"
          options={() => ({
            tabBarIcon: () => {
              return <></>;
            },
            tabBarLabelPosition: 'beside-icon',
          })}
          component={Docs}
        />
        <BottomTab.Screen
          name="Account"
          component={Account}
          options={() => ({
            title: 'Account',
            headerShown: false,
            tabBarIcon: () => {
              return <></>;
            },
            tabBarLabelPosition: 'beside-icon',
          })}
        />
      </BottomTab.Navigator>
    </SafeAreaProvider>
  );
}
