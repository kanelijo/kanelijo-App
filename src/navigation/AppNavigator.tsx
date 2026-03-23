import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import LibrariesScreen from '../screens/LibrariesScreen';
import ShopsScreen from '../screens/ShopsScreen';
import JobsScreen from '../screens/JobsScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import AddShopScreen from '../screens/AddShopScreen';
import AddLibraryScreen from '../screens/AddLibraryScreen';
import AddJobScreen from '../screens/AddJobScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0a0a0a',
  },
};

const ExploreStack = createNativeStackNavigator();

function ExploreNavigator() {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff',
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <ExploreStack.Screen name="Rooms" component={ExploreScreen} options={{ title: '🏠 Rooms' }} />
      <ExploreStack.Screen name="Shops" component={ShopsScreen} options={{ title: '🛒 Shops' }} />
      <ExploreStack.Screen name="Libraries" component={LibrariesScreen} options={{ title: '📚 Libraries' }} />
      <ExploreStack.Screen name="Jobs" component={JobsScreen} options={{ title: '💼 Jobs' }} />
    </ExploreStack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E83A30',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: any = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Explore') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Favourite') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Favourite" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {session && session.user ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
            <Stack.Screen name="MyListings" component={MyListingsScreen} />
            <Stack.Screen name="AddRoom" component={AddRoomScreen} />
            <Stack.Screen name="AddShop" component={AddShopScreen} />
            <Stack.Screen name="AddLibrary" component={AddLibraryScreen} />
            <Stack.Screen name="AddJob" component={AddJobScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#131316',
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
