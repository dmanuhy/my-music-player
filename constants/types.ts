export type Track = {
    id: string,
    filename: string,
    albumId: string,
    uri: string,
    artwork: string,
    artist: string,
    mediaType: string,
    duration: number,
    height: number,
    width: number
    modificationTime: number,
    creationTime: number,
};

export type Playback = {
    position: number | null,
    duration: number | undefined,
}
