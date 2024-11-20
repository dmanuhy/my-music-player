import { useEffect, useState, createContext, PropsWithChildren, useContext } from "react";
import { getAssetsAsync, getPermissionsAsync, requestPermissionsAsync } from "expo-media-library"
import { Alert } from "react-native";
import { Track } from "../constants/types";
import { getAudioMetadata } from "@missingcore/audio-metadata";

type TrackContextType = {
    tracks: Track[];
};
const TrackContext = createContext<TrackContextType>({
    tracks: []
});

export const TrackProvider = ({ children }: PropsWithChildren) => {

    const [tracks, setTracks] = useState<Track[]>([])

    const permissonAlert = () => {
        Alert.alert("Permission require", "This app need access to your audio files!",
            [
                { text: "Accept", onPress: () => getPermission() },
                { text: "Deny", onPress: () => permissonAlert() }
            ]
        )
    }

    const getAudioFiles = async () => {
        const files = await getAssetsAsync({
            mediaType: "audio",
            first: 1000
        })
        const tracksWithArtwork = await Promise.all(files.assets.map(async track => {
            try {
                const data = await getAudioMetadata(track.uri, ["artwork", "artist"]);
                if (data?.metadata) {
                    return { ...track, artwork: data.metadata?.artwork || "", artist: data.metadata?.artist?.toString() || "Unknown" };
                } else {
                    return { ...track, artwork: "", artist: "Unknown" };
                }
            } catch (e) {
            }
            return track;
            // Return the track as is if artwork is not found or an error occurs 
        }));
        setTracks(tracksWithArtwork as Track[])
    }

    const getPermission = async () => {
        const permission = await getPermissionsAsync()
        if (permission.granted) {
            getAudioFiles()
        }
        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await requestPermissionsAsync()
            if (status === "denied" && canAskAgain) {
                permissonAlert()
            }
            if (status === "granted") {
                getAudioFiles()
            }
            if (status === "denied" && !canAskAgain) {

            }
        }
    }

    useEffect(() => {
        getPermission()
    }, [])

    return (
        <TrackContext.Provider value={{ tracks }}>
            {children}
        </TrackContext.Provider>
    )
}

export const useTrackContext = () => useContext(TrackContext)