import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';

export default function Navigation({navigation}) {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};


import MySplashScreen from '../screens/MySplashScreen';
import TimerExerciseScreen from '../screens/TimerExerciseScreen';
import TimerSetScreen from '../screens/TimerSetScreen';
import SavePresetScreen from '../screens/SavePresetScreen';

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="MySplashScreen" component={MySplashScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="TimerSetScreen" component={TimerSetScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.RevealFromBottomAndroid }} name="SavePresetScreen" component={SavePresetScreen} />
      <Stack.Screen options={{headerShown:false, ...TransitionPresets.ScaleFromCenterAndroid }} name="TimerExerciseScreen" component={TimerExerciseScreen} />
    </Stack.Navigator>
  )
};