import { Sound } from "expo-av/build/Audio";
import { Playback, Track } from "../constants/types";
import { useEffect, useState, createContext, PropsWithChildren, useContext } from "react";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { useTrackContext } from "./TrackContext";

type PlayerContextType = {
    track?: Track
    setTrack: (track: Track) => void,

    playback: { position: number | null, duration: number | undefined },
    setPlayback: (playback: { position: number | null, duration: number | undefined }) => void,

    isPlaying: boolean,

    onPlayPause: () => void,

}

const PlayerContext = createContext<PlayerContextType>({
    track: undefined,
    setTrack: () => { },

    playback: { position: null, duration: undefined },
    setPlayback: () => { },

    isPlaying: false,

    onPlayPause: () => { },

});

export const PlayerProvider = ({ children }: PropsWithChildren) => {

    const { tracks } = useTrackContext()

    const [track, setTrack] = useState<Track>()
    const [sound, setSound] = useState<Sound>();
    const [isPlaying, setIsPlaying] = useState(false)
    const [playback, setPlayback] = useState<Playback>({
        position: null,
        duration: undefined
    })

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
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying)
            if (status.isPlaying) {
                setPlayback({
                    position: status.positionMillis,
                    duration: status.durationMillis
                })
            }
            if (status.didJustFinish) {
                setTrack(tracks[(tracks.findIndex(t => t.uri === track?.uri) + 1) % tracks.length]);
            }
        }
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

    return (
        <PlayerContext.Provider value={{ track, setTrack, playback, setPlayback, isPlaying, onPlayPause }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContext = () => useContext(PlayerContext)