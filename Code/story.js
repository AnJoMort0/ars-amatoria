import { getReflectionState } from './special_events.js';

// Placeholders
const d = "What do you do?";
const e = "Press ENTER to rewind!";
const w = "Walk towards where?";
const l = "Look at what?";

/* Story syntax -> 
const title = 
[
    `text`, 
    [
        ['verb1', title_of_destination1], 
        ['v2', tod2], 
        ['v3', tod3],
    ],
    d
];
*/

export const storyStates = {
    'intro': [
        `I stumble one more time out of the final exam, the weight of textbooks finally off my shoulders.
There she is, standing in the corridor, the girl I've barely spoken to all semester, if I can even say that now, but I can't get her out of my mind.
She's laughing.
My heart races; this is my chance, maybe my last chance,
once again...
one more time...`,
        [
            ['look', 'look_classroom'],
            ['walk', 'walk_from_classroom'],
            ['wait', 'wait_on_intro'],
        ],
        d
    ],
    'look_classroom': [
        `You look at the...`, 
        [
            ['classroom', 'look_at_classroom'],
            ['corridor', 'look_at_corridor'],
            ['girl', 'look_at_girl'],
            ['floor', 'look_at_floor'],
        ],
        l
    ],
    'look_at_classroom': [
        `The room is chaotic as students rush out, relieved that the ordeal is over.
I catch glimpses of stressed faces and hear a mix of sighs and chatter.
A sea of people flows towards the corridor.`, 
        [
            ['walk', 'walk_from_classroom'],
            ['wait', 'wait_on_intro']
        ],
        d
    ],
    'look_at_corridor': [
        `The toilet is just on the other side of the corridor`, 
        [
            ['walk', 'walk_from_classroom'],
            ['wait', 'wait_on_intro']
        ],
        d
    ],
    'look_at_girl': [
        `She's just standing there, talking to her friend. Can I just approach her like that?`, 
        [
            ['walk', 'walk_from_classroom'],
            ['wait', 'wait_on_intro']
        ],
        d
    ],
    'walk_from_classroom': [
        `You walk towards...`, 
        [
            ['classroom', 'w_cr_cr'],
            ['corridor', 'w_cr_cd'],
            ['girl', 'w_cr_g']
        ],
        w
    ],
    'wait_on_intro': [
        `I wait for a moment, uncertain of what to say. 
Jackson comes from behind me, friendly punches me in the shoulder and happily asks:
"So how was it?"

Still surprised I answer:
"It was alright."

As I look back at the corridor, the girl is not there anymore. I've lost my chance...`, 
        [],
        e
    ],

    'reflection': () => getReflectionState(reflectionIndex)
};