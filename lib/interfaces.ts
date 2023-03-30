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
    karma: number;
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
    answers: PollAnswer[];
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

/**
* The interface for users on Meower
*/
export interface User {
    _id: string;
    banned: boolean;
    created: number;
    error: boolean;
    lower_username: string;
    lvl: number;
    pfp_data: number;
    quote: string;
    uuid: string;
}

/**
* The interface for a user's posts on Meower
*/
export interface UserPosts {
    error: boolean;
    index: string[] | object[];
    "page#": number;
    pages: number;
    query: {
        isDeleted: boolean;
        post_origin: string;
        u: string;
    };
}

/**
* The interface for cooldowns
*/
export interface Cooldown {
    username: string;
    user_karma: number;
    karma: string;
}
