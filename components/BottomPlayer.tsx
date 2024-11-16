import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useEffect, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import trackIcon from "../assets/icon/track-icon.png"

const BottomPlayer = () => {
    const [sound, setSound] = useState<Sound>();
    const [isPlaying, setIsPlaying] = useState(false)
    const { track } = usePlayerContext()

    const playTrack = async () => {
        if (sound) {
            await sound.unloadAsync();
        }

        if (!track?.uri) {
            return null;
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: track.uri },
            { shouldPlay: true }
        )
        setSound(newSound)
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        await newSound.playAsync()
    }

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            return
        }
        setIsPlaying(status.isPlaying)
    }

    const onPlayPause = async () => {
        if (!sound) {
            return
        }
        if (isPlaying) {
            await sound.pauseAsync()
        } else {
            await sound.playAsync()
        }
    }

    useEffect(() => {
        playTrack()
    }, [track])

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync()
        } : undefined
    }, [sound])

    if (!track) {
        return null;
    }

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={trackIcon} style={styles.image} />
                <View style={styles.text}>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{track?.filename}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles?.subtitle}>Unknown Artist</Text>
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
        </View>
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