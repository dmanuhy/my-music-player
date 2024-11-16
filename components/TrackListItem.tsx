import { usePlayerContext } from "../contexts/PlayerContext"
import { Track } from "../constants/types"
import { Text, View, StyleSheet, Image, Pressable } from "react-native"
import trackIcon from "../assets/icon/track-icon.png"

type TrackListItemProps = {
    track: Track
}

const TrackListItem = ({ track }: TrackListItemProps) => {

    const { setTrack } = usePlayerContext()

    return (
        <Pressable
            onPress={() => {
                setTrack(track)
            }}
            style={styles.container}>
            <Image source={track?.artwork ? { uri: track.artwork } : trackIcon} style={styles.image} />
            <View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{track?.filename}</Text>
                <Text style={styles.subTitle}>Unknown Artist</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 1,
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#00BECF",
        width: "100%"
    },
    title: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 16,
    },
    subTitle: {
        color: "purple",
    },
    image: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 4
    }
})

export default TrackListItem