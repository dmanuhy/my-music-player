import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TrackList from "../pages/TrackList";
import Playlist from "../pages/Playlist";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import TrackPlayer from "../pages/TrackPlayer";
import { View } from "react-native";
import BottomPlayer from "../../components/BottomPlayer";

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => (
                <View style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: "red" }}>
                    <BottomPlayer />
                    <BottomTabBar {...props} />
                </View>
            )}>
            <Tab.Screen name="TrackList" component={TrackList} options={{
                tabBarIcon: ({ size, color }) => { return <MaterialIcons name="headset" size={size} color={color} /> }
            }} />
            <Tab.Screen name="Player" component={TrackPlayer} options={{
                tabBarIcon: ({ size, color }) => { return <FontAwesome5 name="compact-disc" size={size} color={color} /> }
            }} />
            <Tab.Screen name="Playlist" component={Playlist} options={{
                tabBarIcon: ({ size, color }) => { return <MaterialIcons name="library-music" size={size} color={color} /> }
            }} />
        </Tab.Navigator>
    );
}

export default AppNavigator
