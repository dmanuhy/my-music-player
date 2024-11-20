import React, { useEffect, useRef } from "react"
import { Animated, Easing, Image, ImageBackground, Modal, PanResponder, StyleSheet } from "react-native"
import { View, Text } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Track } from "../constants/types";
import { SafeAreaView } from 'react-native-safe-area-context';
import trackIcon from "../assets/icon/track-icon.png"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Slider from "@react-native-community/slider";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { usePlayerContext } from "../contexts/PlayerContext";

interface PlayerModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ modalVisible, setModalVisible }) => {

    const { track, isPlaying, onPlayPause, playback, setPlayback } = usePlayerContext()

    const calculateSeeBar = () => {
        if (playback?.position !== null && playback?.duration !== undefined) {
            return playback.position / playback.duration
        } else {
            return 0
        }
    }

    const spinTracker = useRef(new Animated.Value(0)).current;
    const savedSpinValueRef = useRef(0)
    const spin = spinTracker.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

    const startSpinAnimation = (fromValue = 0) => {
        spinTracker.setValue(fromValue);
        Animated.timing(spinTracker, {
            toValue: fromValue + 1,
            duration: (1 - fromValue) * 10000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished && isPlaying) {
                startSpinAnimation();
            }
        });
    }; const stopSpinAnimation = () => {
        spinTracker.stopAnimation((value) => {
            savedSpinValueRef.current = value % 1;
            // Save the current animation progress 
        })
    };
    useEffect(() => {
        if (isPlaying && modalVisible) {
            startSpinAnimation(savedSpinValueRef.current);
        } else {
            stopSpinAnimation();
        }
    }, [isPlaying, modalVisible]);
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={[styles.container]} >
                <ImageBackground source={track?.artwork ? { uri: track.artwork } : trackIcon} blurRadius={12} style={styles.bgCover}>
                </ImageBackground>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <AntDesign onPress={() => setModalVisible(false)} name="caretdown" size={24} color="white" />
                        <Text style={styles.title}>
                            Playing
                        </Text>
                        <AntDesign onPress={() => setModalVisible(false)} name="shrink" size={24} color="white" />
                    </View>
                    <Animated.Image
                        key={track?.id}
                        source={track?.artwork ? { uri: track.artwork } : trackIcon}
                        style={[styles.image, { transform: [{ rotate: spin }] }]}
                    />
                    <View style={styles.body}>
                        <FontAwesome name="share-square-o" size={24} color="#00BCEE" />
                        <View style={styles.text}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>{track?.filename}</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles?.subtitle}>{track?.artist?.toString() || "Unknown"}</Text>
                        </View>
                        <AntDesign name="heart" size={24} color="red" />
                    </View>
                    <View style={styles.footer}>
                        <Slider
                            maximumValue={1}
                            minimumValue={0}
                            value={calculateSeeBar()}
                            minimumTrackTintColor="#00BECC"
                            maximumTrackTintColor="#FFF"
                        />
                        <View style={styles.controller}>
                            <FontAwesome6 name="shuffle" size={28} color="white" />
                            <View style={styles.stepController}>
                                <AntDesign name="stepbackward" size={28} color="white" />
                                <AntDesign onPress={() => onPlayPause()} name={isPlaying ? "pausecircleo" : "playcircleo"} size={60} color="white" />
                                <AntDesign name="stepforward" size={28} color="white" />
                            </View>
                            <View style={{ position: "relative" }}>
                                <FontAwesome5 name="retweet" size={28} color="white" />
                                <Text style={styles.iconLoop1}>1</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#000",
    },
    bgCover: {
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
    },
    content: {
        alignItems: 'center',
        gap: 48,
        padding: 24
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    image: {
        width: '90%',
        height: "auto",
        aspectRatio: 1,
        borderRadius: 999,
    },
    body: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 32
    },
    text: {
        alignItems: "center",
        gap: 8,
        flex: 1
    },
    title: {
        fontSize: 20,
        color: "white",
    },
    subtitle: {
        color: 'lightgray',
        fontSize: 14,
    },
    footer: {
        width: "100%",
        gap: 24
    },
    controller: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    stepController: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    iconLoop1: {
        position: "absolute",
        backgroundColor: "transparent",
        top: 7,
        right: 0,
        left: 14,
        bottom: 0,
        fontSize: 11,
        fontWeight: 900,
        color: "#00BECC"
    }
})


export default PlayerModal