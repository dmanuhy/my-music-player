
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigations/AppNavigator';
import { TrackProvider } from './contexts/TrackContext';
import { PlayerProvider } from './contexts/PlayerContext';
export default function App() {
  return (
    <TrackProvider>
      <PlayerProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PlayerProvider>
    </TrackProvider>
  );
}
