import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import TierSelectScreen from './src/screens/TierSelectScreen';
import MatchScreen from './src/screens/MatchScreen';
import ResultScreen from './src/screens/ResultScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0f0f1a' },
            headerTintColor: '#e2c97e',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0f0f1a' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TierSelect" component={TierSelectScreen} options={{ title: 'Stake' }} />
          <Stack.Screen name="Match" component={MatchScreen} options={{ title: 'Pick Stats' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Result', headerBackVisible: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
