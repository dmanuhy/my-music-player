export type Track = {
    id: string,
    filename: string,
    albumId: string,
    uri: string,
    artwork: string
    mediaType: string,
    duration: number,
    height: number,
    width: number
    modificationTime: number,
    creationTime: number,
};
export type Album = {
    id: string;
    name: string;
    images: Image[];
};
export type Artist = {
    id: string;
    name: string;
    images?: Image[];
};

export type Image = {
    url: string;
    height?: number;
    width?: number;
};
