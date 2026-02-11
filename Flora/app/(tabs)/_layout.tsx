import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2A6A4A',
        tabBarInactiveTintColor: '#6D8478',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="home" size={size} />,
        }}
      />
      <Tabs.Screen
        name="current-updates"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="bell" size={size} />,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="lightbulb-o" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="user" size={size} />,
        }}
      />
    </Tabs>
  );
}
