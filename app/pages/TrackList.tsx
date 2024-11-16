import { FlatList, StyleSheet, Text } from 'react-native';
import { useTrackContext } from '../../contexts/TrackContext';
import TrackListItem from '../../components/TrackListItem';

const TrackList = () => {

    const { tracks } = useTrackContext()

    return (
        <FlatList
            data={tracks}
            renderItem={({ item }) => <TrackListItem track={item} />}
            showsHorizontalScrollIndicator={false}
        />
    );
}

export default TrackList