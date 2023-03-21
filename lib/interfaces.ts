export interface Status {
    _id: string;
    username: string;
    status: string;
}

export interface Karma {
    _id: string;
    username: string;
    karma: string;
}

export interface Place {
    _id: string;
    map: string[][];
    contributors: string[];
}

export interface Mute {
    _id: string;
    username: string;
    reason?: string;
}
