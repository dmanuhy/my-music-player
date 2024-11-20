import { View, Text, StyleSheet, Image, Pressable, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useEffect, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import trackIcon from "../assets/icon/track-icon.png"
import PlayerModal from './PlayerModal';

const BottomPlayer = () => {

    const [modalVisible, setModalVisible] = useState(false)
    const { track, isPlaying, onPlayPause } = usePlayerContext()

    if (!track) {
        return null;
    }

    return (
        <>
            <Pressable onPress={() => setModalVisible(true)} style={styles.container}>
                <View style={styles.content}>
                    <Image source={track?.artwork ? { uri: track.artwork } : trackIcon} style={styles.image} />
                    <View style={styles.text}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{track?.filename}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles?.subtitle}>{track?.artist?.toString() || "Unknown"}</Text>
                    </View>
                </View>
                <View style={styles.action}>
                    <Ionicons
                        name={'heart-outline'}
                        size={20}
                        color={'white'}
                    />
                    <Ionicons
                        onPress={onPlayPause}
                        disabled={!track?.uri}
                        name={isPlaying ? "pause" : "play"}
                        size={22}
                        color={track?.uri ? 'white' : 'gray'}
                    />
                </View>
            </Pressable>
            <PlayerModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        padding: 1,
        backgroundColor: '#00BFFF',
        flexDirection: 'row',
        justifyContent: "space-between",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    content: {
        borderTopRightRadius: 5,
        flexDirection: "row",
        flex: 1
    },
    action: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 12,
    },
    text: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1
    },
    title: {
        color: 'white',
    },
    subtitle: {
        color: 'lightgray',
        fontSize: 12,
    },
    image: {
        height: '100%',
        width: "auto",
        aspectRatio: 1,
        marginRight: 10,
        borderTopLeftRadius: 5,
    },
});

export default BottomPlayer;