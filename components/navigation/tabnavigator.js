import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import home from '../screens/home';
import addtask from '../screens/addtask';
import settings from '../screens/settings';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={home} />
      <Tab.Screen name="Add Task" component={addtask} />
      <Tab.Screen name="Settings" component={settings} />
    </Tab.Navigator>
  );
}
