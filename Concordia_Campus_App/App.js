import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from './maps/MapScreen';
import TransitScreen from './maps/transitOptions.js';
import { StatusBar } from 'expo-status-bar';
import Calendar from './calendar/calendar';
import BuildingDirectionsMapScreen from './maps/BuildingDirectionsMapScreen';
import { PaperProvider } from 'react-native-paper';
import FullShuttleSchedule from './shuttle_bus/full_schedule'


const Drawer = createDrawerNavigator();


export default function App() {
  return (
    <PaperProvider> 
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Map">
        <Drawer.Screen name="Map" component={MapScreen} />
        <Drawer.Screen name="Calendar" component={Calendar}/>
        <Drawer.Screen name="Building Map Directions" component={BuildingDirectionsMapScreen}/>
        <Drawer.Screen name="Shuttle Bus Schedule" component={FullShuttleSchedule}/>
      </Drawer.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
