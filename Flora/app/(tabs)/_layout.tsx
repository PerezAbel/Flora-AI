import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';

export default function TabLayout() {
  const { tr } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8BB8FF',
        tabBarInactiveTintColor: '#5D7AAE',
        tabBarStyle: {
          backgroundColor: '#061735',
          borderTopColor: '#1A2E56',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: tr('Home'),
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="home" size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: tr('Dashboard'),
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="bar-chart" size={size} />,
        }}
      />
      <Tabs.Screen
        name="current-updates"
        options={{
          title: tr('Alerts'),
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="bell" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: tr('Profile'),
          tabBarIcon: ({ color, size }) => <FontAwesome color={color} name="user" size={size} />,
        }}
      />
    </Tabs>
  );
}
