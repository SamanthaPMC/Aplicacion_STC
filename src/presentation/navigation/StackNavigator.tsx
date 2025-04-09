import {
  StackCardStyleInterpolator,
  createStackNavigator,
} from '@react-navigation/stack';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {RegisterScreen} from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import {PresentationScreen} from '../screens/presentation/PresentationScreen';
import {HistoryScreen} from '../screens/history/HistoryScreen';
import StartScreen from '../screens/home/StartScreen';
import { InfoScreen } from '../screens/info/InfoScreen';
import { AuthAdminScreen } from '../screens/auth/AuthAdminScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import { AddNewUserScreen } from '../screens/auth/AddNewUserScreen';
import { ModificarScreen } from '../screens/admin/ModificarScreen';
import { ConfigScreen } from '../screens/config/ConfigScreen';
import { Onboarding2Screen } from '../screens/Onboarding/Onboarding2Screen';


export type RootStackParams = {
  LoadingScreen: {CI:number|null};
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: {Estado:string|number, EMG:number, GSR:number, CI:number|null};
  OnboardingScreen:{NombreApellido:string, Ci:number, Telefono:number,Email:string};
  Onboarding2Screen: {NombreApellido:string|null,CI:number|null, Telefono:number|null,Email:string|null};
  PresentationScreen:undefined;
  HistoryScreen:{CI:number};
  StartScreen:{NombreApellido:string|null,CI:number|null, Telefono:number|null,Email:string|null};
  InfoScreen:undefined;
  AuthAdminScreen:undefined;
  AdminScreen: undefined;
  AddNewUserScreen: undefined;
  ModificarScreen: {CI:number|string, email:string, nombreApellido:string,telefono:number|string};
  ConfigScreen: undefined;

};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({current}) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PresentationScreen"
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation,
      }}>
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="LoadingScreen"
        component={LoadingScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="OnboardingScreen"
        component={OnboardingScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="PresentationScreen"
        component={PresentationScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="HistoryScreen"
        component={HistoryScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="StartScreen"
        component={StartScreen}
      />
      <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="InfoScreen"
        component={InfoScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="AuthAdminScreen"
        component={AuthAdminScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="AdminScreen"
        component={AdminScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation}}
        name="AddNewUserScreen"
        component={AddNewUserScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation }}
        name="ModificarScreen"
        component={ModificarScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation }}
        name="ConfigScreen"
        component={ConfigScreen}
      />
        <Stack.Screen
        options={{cardStyleInterpolator: fadeAnimation }}
        name="Onboarding2Screen"
        component={Onboarding2Screen}
      />
    </Stack.Navigator>
  );
};
