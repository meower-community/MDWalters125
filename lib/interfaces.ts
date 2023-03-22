/**
* The interface for statuses 
*/
export interface Status {
    _id: string;
    username: string;
    status: string;
}

/**
* The interface for karma 
*/
export interface Karma {
    _id: string;
    username: string;
    karma: string;
}

/**
* The interface for place 
*/
export interface Place {
    _id: string;
    map: string[][];
    contributors: string[];
}

/**
* The interface for mutes 
*/
export interface Mute {
    _id: string;
    username: string;
    reason: string | null;
}

/**
* The interface for mutes 
*/
export interface Poll {
    _id: number;
    question: string;
    answers: object[];
    username: string;
    deleted: boolean;
}

/**
* The interface for poll answers 
*/
export interface PollAnswer {
    username: string;
    answer: string;
}
