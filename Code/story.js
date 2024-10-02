import { getReflectionState } from './special_events.js';

// Placeholders
const d = "What do you do?";
const e = "Press ENTER to rewind!";
const w = "Walk towards where?";
const l = "Look at what?";

/* Story syntax -> 
'title': [
    `text`, 
    [
        ['verb1', 'title_of_destination1'], 
        ['v2', 'tod2'], 
        ['v3', 'tod3'],
    ],
    d
],
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
            ['wait', 'wait_on_intro'],
            ['look', 'look_onIntro'],
            ['walk', 'walk_on_intro'],
            ['talk', 'talk_on_intro'],
        ],
        d
    ],
        'wait_on_intro': [
            `I wait for a moment, uncertain of what to do. 
Jackson comes from behind me, friendly punches me in the shoulder and happily asks
"So how was it?"

Still surprised I answer
"It was alright."

As I look back at the corridor, the girl is not there anymore. I've lost my chance...`, 
            [],
            e
            ],
        'talk_on_intro': [
            `I stand there, frozen for a second, my heart pounding. I open my mouth, the word "talk" swirling in my head as if it’s the answer to everything. But instead of saying something clever, or even remotely coherent, I mutter...

“Okay, just... talk. You can do this. You’re talking... to yourself now. Perfect.”

No one else hears it, of course. The crowd flows around me, oblivious to my internal monologue. And the girl? Yeah, she’s still there, still laughing, still... not talking to me.

Great start, really.`, 
            [
                ['wait', 'wait_on_intro'],
                ['look', 'look_onIntro'],
                ['walk', 'walk_on_intro'],
            ],
            d
        ],
        'talk_again': [
            `"Talk, it's not that hard... I'm talking to myself again, am I not? Nice."

This time, a random guy walking near by hears it.
"Weirdo."

Great.`, 
            [
                ['wait', 'wait_on_intro'],
                ['look', 'look_onIntro'],
                ['walk', 'walk_on_intro'],
            ],
            d
        ],
        'look_onIntro': [
            `I look at the...`, 
            [
                ['corridor', 'look_at_corridor'],
                ['girl', 'look_at_girl'],
                ['floor', 'look_at_floor'],
            ],
            l
        ],
            'look_at_corridor': [
                `The corridor is bustling with students, backpacks slung over their shoulders as they chatter about the final exam.
Toward the other side of the hallway, a sign marks the restroom door, just a few feet away from where she stands with her friends, their laughter mingling with the noise. 
The crowd swirls past, but all I can see is her.`, 
                [
                    ['wait', 'wait_on_intro'],
                    ['look', 'look_onIntro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                ],
                d
            ],
            'look_at_girl': [
                `She’s standing there, surrounded by her friends, but all I can focus on is her.
It’s hard to describe what it is exactly—maybe the way she laughs, a sound that cuts through the chaos around us, or how she seems to light up the space without even trying.
She’s always been... there, like this unreachable dream, someone I’ve barely spoken to but who occupies way too much space in my mind.
The way she moves, the way she’s so effortlessly part of the crowd yet somehow stands out from everyone else. 
She’s perfect, in the kind of way that makes my heart race and my stomach churn.
I’ve tried not to stare, tried to convince myself that it’s just a crush, but every time I see her, it’s like the world narrows down to just her and me.`, 
                [
                    ['wait', 'wait_on_intro'],
                    ['look', 'look_onIntro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                ],
                d
            ],
            'look_at_floor': [
                `The tiles stretch out in front of me, an endless sea of scuffed linoleum, each one a tiny, off-white rectangle of disappointment.
I’ve spent more time staring at these floors than I care to admit, but today, they feel different—like they’re judging me.
Every step echoes back, a rhythmic reminder of how tragically uncool I probably look right now.
Somewhere down there, hidden in the grime of forgotten gum and half-wiped spills, is the confidence I lost in middle school.
Maybe if I stare hard enough, I’ll find it again.`, 
                [
                    ['wait', 'wait_on_intro'],
                    ['look', 'look_onIntro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                ],
                d
            ],
    'walk_on_intro': [
        `I walk towards...`, 
        [
            ['girl', 'w_cr_g'],
            ['corridor', 'w_cr_c'],
        ],
        w
    ],
        'w_cr_g': [
            `She’s still there, talking with a group of her friends, her laughter cutting through the noise. I catch my breath, forcing myself to stay calm. I know what I have to do this time.

I approach with steady steps, careful not to seem too eager, slipping in beside her. The conversation around us dies down as they notice me. I glance at her friends, offering a quick smile.
“You girls don’t mind if I steal her for a second, do you? I promise I’ll bring her back in one piece.”

I expect the usual laughs, maybe a playful shrug, but instead, her friend crosses her arms.
“Actually, we do.”

The words hit me like a slap, my confidence wavering. I look at the girl, waiting for her to say something, to defend me. To agree to come along. But instead, she just smiles politely, almost apologetically.
“Yeah, I’m good here, thanks.”

The rejection is quiet, but it’s there, hanging heavy between us. Her friends’ eyes linger on me, judgmental, and I feel my pulse quicken, frustration bubbling under my skin. My mouth opens, some lame excuse forming on my tongue, but nothing comes out.
I turn to leave, feeling their eyes on my back, my fists clenching again.

I did everything right. They’re the ones holding her back. She’s supposed to want this.`, 
            [],
            e
        ],
        'w_cr_c': [
            `I start walking, following the river of students that are leaving the classroom.
It's my time to impress her.
I pull out my phone, bring it to my ear and start talking loud enough for her to overhear.

“Yeah, no, listen, I told them to wire the funds directly. It’s only a couple hundred grand. No big deal. I’ve got bigger investments on the way.”

I pause, glancing over to see if she’s listening. She’s still standing there, unmoved.

“Yeah, we’ll close the deal by the end of the month.” 

I laugh loudly, flashing a grin, confident that it’s only a matter of time before she takes the bait.
I glance her way again, she's actually looking at me now. Just waiting for some reaction—admiration, curiosity, anything. 
Instead, she rolls her eyes, turning her back to me, clearly annoyed. My heart skips a beat. She’s supposed to be impressed!

She starts walking away, and I rush to catch up. 
“Hey,” I call out, trying to keep my voice steady, “did you hear that? I’ve been busy with... uh, business, you know?”

She barely glances at me, her voice cold. 
“Cool.”

I fumble for a response. 
“Though, I'm pretty sure I can still manage to find some time to buy you a drink.”

She stops, turning to face me, her arms crossed. 
“What do you want with me? Leave me alone!”

I blink, words caught in my throat. This wasn’t how it was supposed to go.
Without waiting for an answer, she shakes her head and walks away. I’m left standing there, my hand still clutching the phone like a lifeline, my face burning.

What the hell? Isn’t that what all girls want?`, 
            [],
            e
        ],
        'w_cr_r': [
            `I’m making my way down the corridor, my heart thudding in my chest.
The restroom is right there, just a few steps from her, giving me an excuse to get close.
I walk slowly, glancing over, pretending not to care too much, but my eyes keep darting toward her.
And then, it happens.
She shifts, just a small movement, but enough to put some space between her and her group of friends.
It’s subtle, like she’s not even thinking about it, but to me, it feels like an opening—a chance.
My breath catches.
This is it.`, 
            [
                ['chatter', 'cr_chatter'], 
                ['compliment', 'cr_compliment'], 
                ['approach', 'cr_approach'],
            ],
            d
        ],
            'cr_chatter': [
                `I see her, just ahead, focused on her phone. My pulse quickens as I walk towards her, rehearsing the line in my head.

I reach her, putting on my most nonchalant expression. 
“Hey, I don't have much time, I can only talk for a minute—I’ve got to head out—but I just had to say hi.”

She glances at me, her expression blank, unimpressed. There’s a beat of silence. I wait for her to ask me to stay, to engage, but instead, she shrugs. 
“Then don’t waste your minute here.”

The words hit harder than I expect. My forced nonchalance cracks for a second, but I recover quickly, laughing awkwardly. 
“No, I mean—”

She’s already turning away. 
“Have a good one.” she says, walking past me without another glance.

I stand there, my stomach sinking. The casual exit I’d planned falls apart, and I watch her disappear into the crowd.

What went wrong?`, 
                [],
                e
            ],
            'cr_compliment': [
                `“You know, you’d be pretty cute if you didn’t always look so tired.”

There’s a pause. A moment where her eyes meet mine, and I think—this is it. But her expression doesn’t soften. Instead, her brow furrows, and the laughter in her eyes fades. Her friends grow quiet, watching, sensing the shift.

“Wow,” she says, voice dripping with sarcasm. “Thanks, I guess?” She turns to her friend, her attention already slipping away from me. “Did you hear that? Guess I should work on my beauty sleep.”

Her friends laugh, but it’s not the kind of laugh I was expecting. It’s sharp.
I’m left standing there, my words hanging useless in the air.
I swallow, my throat tight. My hand clenches into a fist at my side. I try to smile, to shrug it off.
What the hell? That was supposed to work.

My stomach churns as I turn away. The corridor feels colder, the laughter harsher. I had followed the advice, played the game. But here I am, empty-handed. Again.`, 
                [],
                e
            ],
            'cr_approach': [
                `She’s still standing there, leaning against the wall, her attention focused on her phone. I take a breath, steady my nerves, and walk over, this time with a plan that feels... normal.

“Hey,” I say softly, just loud enough for her to hear. She glances up, surprised but not annoyed.
“That exam was brutal, right?”

She chuckles, tucking her phone into her pocket.
“Yeah, tell me about it. I wasn’t sure if I’d make it.”

I nod, slipping into the flow of the conversation easily. “Honestly, I thought my brain was going to melt halfway through.” I laugh, and she laughs with me, a real one this time, not the nervous chuckle I’ve heard before. We talk a bit more—about the class, the exam, the relief of it all being over—and I can feel the tension easing. This feels... good, weirdly.

"Name's Sam by the way"

"I'm Jessica," she says with a slight smile.

The crowd around us has thinned to just a few stragglers. I glance at the hallway, then back at her.
“Want to get some fresh air? I could use a break from this place.”

She hesitates for a second, then nods.
“Yeah, actually, that sounds nice.”

She parts from her friends and joins my side.

We head outside, the conversation light but comfortable, and for the first time, I feel like I’m actually connecting with her. No games, no pressure. Just talking.`, 
                [
                    ['stop', 'ex_stop'], 
                    ['touch', 'ex_touch'], 
                    ['recall', 'ex_recall'],
                    ['compliment', 'ex_compliment'],
                ],
                d
            ],
                'ex_stop': [
                    `The streets are calm, the sun setting behind us as we make our way along the quiet path. She’s talking about the exam, the relief of it being over, but my thoughts are elsewhere. This is where I take control. Pull away just enough, let her feel the space between us, make her come to me.

My responses becoming more monosyllabic. “Yeah,” I say when she talks about her weekend plans. “Cool,” when she mentions her friends. I keep my eyes on the street ahead, barely glancing at her, letting the silence stretch longer than it should.

She notices. I can feel her eyes on me, her steps slowing to match mine. “You okay?” she asks, her tone softer now.

I shrug, not meeting her gaze.
“Yeah, just... got a lot on my mind.”

The air between us feels heavier now, and I sense her uncertainty, her need to fill the gap I’ve created. She tries again.
“What's going on? You were so talkative before.”

"Just... thinking.”

I don’t give her more than that, letting the tension build. I expect her to lean in, to ask more, to try harder.
But instead, her face shifts—disappointment settling into her eyes.
“You're just another one of those, huh? Well, I'm not here to play any games. Not interested”

I blink, thrown off.
“What? No, it’s not that, I—”

Before I can finish my thought, she speeds up her pace, putting distance between us. I watch her walk away, the weight of my own silence pressing harder on my chest than I expected.

It wasn’t supposed to end like this...`, 
                    [],
                    e
                ],
                'ex_touch': [
                    `We walk side by side, her footsteps soft against the pavement. The air outside is cool, refreshing after the stuffy hallway. She’s relaxed, smiling—everything seems to be falling into place. It feels right.

I brush my arm against hers, just lightly, and she doesn’t pull away. I take that as a good sign, a green light to move forward—start small, then gradually escalate—so I place my hand on the small of her back as we walk.
But something changes.

She stiffens slightly, her smile faltering, though she says nothing. Maybe she’s just shy. She’ll get used to it. I let my hand linger a little longer, then move to brush a strand of hair behind her ear. 
“You know, I like your hair down like this.”

She pulls away, suddenly, stepping out of reach. The smile is gone, replaced with a look I’ve seen before—a mixture of confusion and discomfort. 
“What are you doing?”

I freeze, the confidence draining from me in an instant. 
“I just thought—”

“You thought what?” Her voice sharpens, her eyes narrowing.

The silence between us is crushing, the lightness from earlier gone. She shakes her head, stepping back again.
“I think I’m going to head home.”

I watch as she turns and walks away, leaving me standing there, my hand still half-raised, my chest tight with frustration.

What the hell just happened? I was doing everything right.`, 
                    [],
                    e
                ],
                'ex_recall': [
                    `The sun’s setting, casting long shadows on the sidewalk as we walk side by side. It’s quiet between us, but not in an uncomfortable way. She’s smiling, looking up at the sky, the cool breeze brushing her hair.

I glance at her, then back at the street ahead. This is going well. But now... now it’s time to spice things up, make her want me more.

I fake a chuckle, shaking my head as if at some private joke.
“You know, it’s funny, this reminds me of last week. I was out with a friend—she’s kinda like you actually. Same laugh, same smile... but she was way too into me.”

Her smile falters for just a second, her eyes flicking toward me before she quickly hides it.

I keep going, my tone casual. 
“I had to let her down easy, of course. I mean, I like her, but I’m not looking for anything serious, you know?”

Her steps slow slightly, the smile gone now, replaced with something else. Something darker.
“Right, sounds like she had it bad for you.”

“Yeah, it happens. But I’ve got a lot going on—don’t really have time to deal with clingy girls.”

That should do it. Now she’ll be thinking about me, wondering if she’s special enough.
But her face isn’t showing the interest I was hoping for. Instead, there’s an edge in her voice as she says,
“Must be exhausting, having so many girls after you.”

Caught off guard by her tone, I reply
“Well, I wouldn’t say it’s a bad problem to have.”

She stops walking, turning to face me fully now.
“If your plan is to make me jealous, maybe I should let you get back to your... other options.”

Her words hit me hard, sharper than I expected. She steps away, her body language screaming frustration, and I realize too late that I pushed it too far. My heart sinks as I watch her walk away, my head spinning.

Why didn’t that work?`, 
                    [],
                    e
                ],
                'ex_compliment': [
                    `We’re walking down the street, the conversation flowing easily. She’s talking about how relieved she is that the exam’s finally over, and I’m nodding along, smiling at her jokes. It feels good—like we’re on the same wavelength.

I laugh with her, then shift my tone, trying to play it cool.
“You know, you’re kinda cool, but... I’m not sure if you’re really my type.”

She slows her pace, glancing at me with a raised eyebrow.
“Oh?”

I chuckle, trying to keep the balance.
“Yeah, I mean, you’re funny, but I usually go for... I don’t know, something a bit different.”

She stops walking entirely, turning to face me.
There’s no anger in her eyes—just a cold, unimpressed look.
“Why don’t you figure it out, and let me know when you do.”

Before I can say anything, she turns on her heel and walks away, her steps brisk, leaving me standing there with a pit growing in my stomach.
I watch her disappear into the crowd, the realization sinking in.

I played the game—pushing, pulling—but instead of making her want more, I just pushed her away.`, 
                    [],
                    e
                ],

    'reflection': () => getReflectionState(reflectionIndex)
};

export function getOriginalStoryStates() {
    return JSON.parse(JSON.stringify(storyStates)); // Return a copy of the original state
}