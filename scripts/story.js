import { getReflectionState } from './reflections.js';

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
    d,
    [
        `title_for_history`,
        `action`,
        `description`,
    ],
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
            ['look', 'look_on_intro'],
            ['walk', 'walk_on_intro'],
            ['talk', 'talk_on_intro'],
            ['stare', 'stare_on_intro'],
        ],
        "What do you do? (start typing here and match the options)"
    ],
        'wait_on_intro': [
            `I wait for a moment, uncertain of what to do. 
Jackson comes from behind me, friendly punches me in the shoulder and happily asks
"So how was it?"

Still surprised I answer
"It was alright."

As I look back at the corridor, the girl is not there anymore. I've lost my chance...`, 
            [],
            e,
            [
                `It's Jackson time`,
                `Wait`,
                `You hesitate, and by the time you stop talking to Jackson, the chance is gone.`,
            ],
        ],
        'stare_on_intro': [
            `I freeze, rooted in place in the crowded hallway, my eyes locked on her. Maybe if I just... look. Maybe that’ll show her I’m interested. Something deep down will click, right?
I stare, trying to focus. It’s not creepy—it’s intentional. I’m showing interest, not desperation.
She’s still laughing with her friends, oblivious to me, and the longer I stare, the weirder it feels. I glance away, then back at her, hoping for eye contact, some kind of sign. But nothing.
But then, one of her friends catches me staring. They exchange glances, and suddenly, the entire group is whispering.
Her laughter fades, replaced by a frown as she turns her head slightly, catching me in the act.
There’s no spark, no connection.
Her eyes widen in discomfort, and she quickly looks back at her friends, who are now shooting me awkward, suspicious glances.
Oh no. That didn’t work at all.

I stand there, feeling like an idiot.`, 
            [],
            e,
            [
                `Creepy Gaze`,
                `Stare`,
                `You try to show interest by staring, but it creeps her out.`,
            ],
        ],
        'scream_on_intro': [
        `"JESSICA!"
I scream it with a grin, excitement bubbling in my chest—until I realize what I’ve just done.

Shit.

It seems like the corridor goes silent. Conversations halt. Dozens of heads turn, including hers. Far down the hall, Jessica freezes mid-laugh, her friends’ eyes darting between her and the guy who just screamed her name like a lunatic. 
She doesn’t know me... yet.
My stomach drops. I wasn’t supposed to say that. I wasn’t supposed to know that.
I panic.
“Wait—no, it’s not weird! I just—”
I take a step forward, trying to close the distance.
“Hey, Jessica, I know it sounds... weird... but we know each other... we talked...”

Jessica’s expression shifts, her body tensing. She steps back.
“Who are you?”
She’s not curious. She’s freaked out.

“It’s complicated, but I know you, I—”

Her friends murmur, one of them nudging her arm. She’s looking at me like I’m dangerous. Then, without another word, she turns—and bolts. Her friends follow, throwing glances back at me as they disappear down the corridor.
I stand there, breathless.
What the hell was that? What did I just do?
The whispers around me return. Someone laughs nervously. I catch a muttered "What a freak" before my ears tune everything out.

I have to reset. NOW.`, 
            [],
            e,
            [
                `The Big Mistake`,
                `Scream`,
                `You scream Jessica's name before you were supposed to know it. What are you doing?`,
            ],
        ],
        'talk_on_intro': [
            `I stand there, frozen for a second, my heart pounding. I open my mouth, the word "talk" swirling in my head as if it’s the answer to everything. But instead of saying something clever, or even remotely coherent, I mutter...

“Okay, just... talk. You can do this. You’re talking... to yourself now. Perfect.”

No one else hears it, of course. The crowd flows around me, oblivious to my internal monologue. And the girl? Yeah, she’s still there, still laughing, still... not talking to me.

Great start, really.`, 
            [
                ['wait', 'wait_on_intro'],
                ['look', 'look_on_intro'],
                ['walk', 'walk_on_intro'],
                ['stare', 'stare_on_intro'],
            ],
            d,
            [
                `Awkward Monologue`,
                `Talk`,
                `You attempt to talk, but end up muttering awkwardly to yourself.`,
            ],
        ],
        'talk_again': [
            `"Talk, it's not that hard... I'm talking to myself again, am I not? Nice."

This time, a random guy walking near by hears it.
"Weirdo."

Great.`, 
            [
                ['wait', 'wait_on_intro'],
                ['look', 'look_on_intro'],
                ['walk', 'walk_on_intro'],
                ['stare', 'stare_on_intro'],
            ],
            d,
            [
                `Public Weirdo`,
                `Talk...again`,
                `You try again, but someone overhears and calls you out as a weirdo.`,
            ],
        ],
        'look_on_intro': [
            `I look at the...`, 
            [
                ['corridor', 'look_at_corridor'],
                ['girl', 'look_at_girl'],
                ['floor', 'look_at_floor'],
            ],
            l,
        ],
            'look_at_corridor': [
                `The corridor is bustling with students, backpacks slung over their shoulders as they chatter about the final exam.
Toward the other side of the hallway, a sign marks the restroom door, just a few feet away from where she stands with her friends, their laughter mingling with the noise. 
The crowd swirls past, but all I can see is her.`, 
                [
                    ['wait', 'wait_on_intro'],
                    ['look', 'look_on_intro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                    ['stare', 'stare_on_intro'],
                ],
                d,
                [
                    `Restroom Close Call`,
                    `Look at the corridor`,
                    `You scan the corridor, noticing the restroom near Jessica and her friends.`,
                ],
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
                    ['look', 'look_on_intro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                    ['stare', 'stare_on_intro'],
                ],
                d,
                [
                    `Unreachable Dream`,
                    `Look at the girl`,
                    `You focus entirely on Jessica, thinking about how much space she occupies in your thoughts.`,
                ],
            ],
            'look_at_floor': [
                `The tiles stretch out in front of me, an endless sea of scuffed linoleum, each one a tiny, off-white rectangle of disappointment.
I’ve spent more time staring at these floors than I care to admit, but today, they feel different—like they’re judging me.
Every step echoes back, a rhythmic reminder of how tragically uncool I probably look right now.
Somewhere down there, hidden in the grime of forgotten gum and half-wiped spills, is the confidence I lost in middle school.
Maybe if I stare hard enough, I’ll find it again.`, 
                [
                    ['wait', 'wait_on_intro'],
                    ['look', 'look_on_intro'],
                    ['walk', 'walk_on_intro'],
                    ['talk', 'talk_on_intro'],
                    ['stare', 'stare_on_intro'],
                ],
                d,
                [
                    `Judgmental Tiles`,
                    `Look at the floor`,
                    `You stare at the floor, feeling like the tiles are mocking your lack of confidence.`,
                ],
            ],
            'look_at_jackson': [
                `I glance over and catch Jackson’s eye. He flashes me a grin. I smirk back, but then he notices where my gaze drifts—to her.
Jackson raises an eyebrow, his grin widening, the kind that says "you’ve got this", and gives me a playful nod. For a moment, everything feels easy. He knows what’s up, always the confident one, never overthinking like I do. .
With an exaggerated look, he tilts his head towards her, mouthing, "just go."
I can almost hear his voice echoing in my head: 
"Don’t overthink it, man. Just be casual, be honest. No games, no tricks. Just talk to her."

But what does he know? That loser advice might work for him, but girls... girls like games. They need to be played. That’s the only way to win. Honesty? That’s a surefire way to blow it.`, 
                [
                    ['look', 'look_on_intro'],
                    ['walk', 'walk_on_intro'],
                    ['stare', 'stare_on_intro'],
                    ['talk', 'talk_on_intro']
                ],
                d,
                [
                    `Unwanted Encouragement`,
                    `Look at Jackson`,
                    `Jackson catches your eye, smiles, and silently encourages you to talk to her—"just go for it."`,
                ],
            ],
    'walk_on_intro': [
        `I walk towards...`, 
        [
            ['girl', 'w_cr_g'],
            ['corridor', 'w_cr_c'],
        ],
        w,
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
            e,
            [
                `Denied by Friends`,
                `Walk to the girl - Isolation Tactic`,
                `You try to steal Jessica away from her friends, but they shut you down, leaving you frustrated.`,
            ],
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
            e,
            [
                `Big Talk`,
                `Walk to the corridor - Peacocking`,
                `You loudly brag about business on the phone, trying to impress her, but she rolls her eyes and walks away.`,
            ],
        ],
        'w_cr_friends': [
            `Maybe I can make her jealous. Yeah, that’s it.

I approach the group, putting on what I hope is a confident smile. They’re laughing about something—no idea what, but I join in anyway.
“Hey, you all look like you're having more fun than anyone else here, mind if I join in?”

One of her friends, the one with the glasses, looks at me with mild curiosity.
“We were just talking about the exam.”

I nod, trying to sound interested.
“Yeah, brutal, right? What do you girls plan to do know that it's all over?”

The conversation drags on, but I can feel it—nothing’s working. They’re talking to me, but it’s polite, distant.
I glance over at her, waiting for a reaction, for anything that shows she’s noticed me. But she doesn’t. In fact, she doesn’t even seem to care.
She barely glances in my direction, and then, just like that, she turns and walks away.
No jealousy. No interest. Just... nothing.
I’m left standing there, pretending to laugh at a joke I didn’t hear, surrounded by people who don’t care. 
My stomach twists.
This was supposed to work.

It always works... doesn’t it?`, 
            [],
            e,
            [
                `Ignored Flirtation`,
                `Walk to the friends - Jealousy Play`,
                `You try to flirt with Jessica’s friends to make her jealous, but she leaves without even noticing.`,
            ],
        ],
        'w_cr_outside': [
            `I step outside the school, the cool evening breeze hitting my face.
My mind is focused. She’ll be leaving any minute now. I’ve seen this play out before. I already know the path she takes—down the quiet street, past the park, where there’s rarely anyone around. It’s perfect.
This time, I have the advantage. I know her, even if she doesn’t know me—yet.
I stop at the corner near the park entrance, pretending to check my phone, but my eyes keep darting toward the school.
Finally, I see her. She steps out of the building. I know she’ll take a left at the next block.
I fall into step behind her, keeping my distance at first.
She’s alone, just like always.
She turns down the path toward the park, exactly as I expected. I pick up my pace, drawing closer with every step, though I make sure to stay just far enough back that she won’t hear me. Not yet.
I speed up, closing the gap between us. I call out.
“Hey, uh, excuse me!”

My voice comes out a little louder than I intended, and she turns around, startled, her eyes widening in confusion.

“Do I... know you?”
She takes a small step back, eyeing me cautiously.

“No, no, we’ve never met,”
I say, though the words feel strange in my mouth, because it’s not true—not really
“I just... I don’t know, thought you looked like someone I might know.”

Her expression shifts—she’s not buying it.
“Right... okay. Well, I’m kinda in a hurry.”

I step a little closer.
“You’re Jessica, right?”

Her face pales slightly.
“How do you...?”

I shrug, trying to laugh it off, but it sounds hollow.
“Just a guess. I think I’ve heard your name before.”

She shakes her head, clearly uneasy now, taking another step back.
“Look, I don’t know who you are, but this is getting weird. Please... just leave me alone.”

The words sting, but I push on, stepping even closer.
“No, wait, I didn’t mean to scare you. I just thought maybe we could, I don’t know, talk?”

Her eyes dart around, looking for a way out, and she clutches her bag tightly.
“No. Leave me alone.”

Before I can say anything else, she turns and walks quickly away, her pace almost a jog.
I stand there, watching her disappear down the path, my heart sinking.

I blew it. Again.`, 
            [],
            e,
            [
                `Creepy Pursuit`,
                `Walk outside - Stalking`,
                `You wait for Jessica to leave, follow her, and try to talk, but she’s creeped out and walks away.`,
            ],
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
                ['confess', 'cr_confess'],
                ['hide', 'cr_hide'],
            ],
            d,
            [
                `Heart-Pounding Moment`,
                `Walk to the restroom`,
                `You prepare yourself as Jessica moves slightly from her group, and you see an opening to approach her.`,
            ],
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
                e,
                [
                    `Pretend Urgency`,
                    `Chatter - False Time Constraint`,
                    `You pretend you’re in a rush to impress Jessica, but she brushes you off with a dismissive comment, not taking your false nonchalance seriously.`,
                ],
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
                e,
                [
                    `Backhanded Compliment`,
                    `Compliment - Negging`,
                    `You try to "neg" the girl, offering a backhanded compliment, but it only makes her annoyed and distances her even more.`,
                ],
            ],
            'cr_confess': [
                `I close the distance quickly, my pulse racing. Before I can stop myself, the words tumble out, awkward and sudden.
“Hey, um, I know we haven’t really talked much... or at all, but I’ve been, uh, noticing you for a while, and... well, I think I might love you.”

She blinks, caught completely off guard.
Her friends stop chatting, all of them glancing over at me.
There’s a moment of stunned silence before she smiles—kind, but confused.
“Oh... uh, wow. That’s... really sweet, but I don’t even know you.”

I feel a rush of panic. This wasn’t supposed to go like this.
“No, no, I get that, but... I’ve just been watching you from afar, you know? I think you’re amazing, and I can tell we’d be great together. You just... haven’t had a chance to see it yet.”

She shifts uncomfortably, glancing toward her friends for support.
“I... appreciate the compliment, really, but I don’t think that’s how this works. I’m sorry, but I’m not interested.”

My heart sinks, but I push forward, my voice growing more desperate.
“Wait, no, just hear me out! We don’t need to know each other right away. We can get to know each other! I can show you who I really am, and you’ll see—everything I’m saying is true!”

Her smile falters, replaced by a look of growing unease. She takes a small step back, shaking her head softly.
“I don’t think that’s a good idea. I’m flattered, but... this is a little too much, okay? Please... stop.”

I reach out, my voice trembling now.
“But you haven’t given us a chance! You haven’t even—”

She cuts me off, her tone firm but still polite.
“I’ve said no. Please... just let it go.”

I oblige.`,
                [],
                e,
                [
                    `Desperate Declaration`,
                    `Confess - Insist`,
                    `You blurt out a sudden confession of love, but it’s pushy and catches the girl off guard, leading to her rejection.`,
                ],
            ],
            'cr_confess_alt': [
                `I close the distance quickly, my pulse racing. Before I can stop myself, the words tumble out, awkward and sudden.
“Hey, um, I know we haven’t really talked much... or at all, but I’ve been, uh, noticing you for a while, Jessica, and... well, I think I might love you.”

She freezes, blinking in surprise, and her friends immediately stop talking, all of them glancing at me in confusion. There’s an awkward silence..

“Wait... how do you know my name? Who are you?”

I feel a cold sweat break out. I didn’t mean to say her name. My heart starts pounding even harder.
“Oh, uh... it just slipped out. I... I think I overheard it somewhere.”

Her expression hardens, and her friends exchange uncomfortable glances.
“Okay... but we’ve never spoken before, and you just said you love me?”

“No, no, it’s not like that. I mean, I’ve just been... watching you, not in a creepy way!”

“That’s... weird.”

“No, wait, Jessica, you don’t understand! This isn’t the first time I’ve tried this. I’ve... I’ve been doing this over and over. It’s like a loop—I can reset time! That’s why I know your name, and that’s why I know we’re perfect for each other.”

Her eyes widen further, and now she’s visibly uncomfortable. Her friends step in closer.
“You... reset time? That’s... insane. You need to stop. This is way too much. I don’t know you, and this is just... please, leave me alone.”

But I can’t stop. My voice shakes as I reach out desperately.
“No, you don’t get it! I’ve tried everything to make this work, Jessica! I’ve seen you walk away a dozen times, and every time I reset, I try to get it right, but you never—”

She cuts me off, her tone firm and full of alarm now.
“Stop saying my name! This is crazy. Please, just leave me alone.”

Her friends are already pulling her away, and I’m left standing there, watching as she disappears into the crowd.
My heart sinks, knowing I’ve ruined it.
Again.

Reset. I have to reset.`,
                [],
                e,
                [
                    `Unwanted Familiarity`,
                    `Confess your power`,
                    `You accidentally say Jessica’s name during your confession, making her uncomfortable, and when you try to explain the time loops, it makes things worse—now you sound like a creep and a nutcase.`,
                ],
            ],
            'cr_hide': [
                `I walk toward her, my heart racing, but as I get closer, the panic creeps in. My mind spins. What if I mess it up? Suddenly, I freeze. I can't do it. Not like this.
Without thinking, I veer off, ducking into the restroom, my breath coming in short bursts.
I lean against the wall, wiping my sweaty palms on my jeans.
I have no balls.
As I stand there, silently cursing myself, I overhear a conversation coming from one of the stalls. Two voices, speaking just loud enough for me to catch.
“Did you hear about Paul Naso? Idiot went and cheated on his girlfriend.”

“No way!”

“Get this, he read some garbage about how he’s in his prime, that he should enjoy his body while it lasts. His girlfriend’s heartbroken, and the guy’s still acting like he did the right thing. Unbelievable.”

“Ugh, those guys are a joke. It’s like they’re trying to ruin their own lives.”

I stay quiet, listening to the conversation die down.
My heart sinks as the weight of the situation hits me.
Is that what I’m doing? Am I just another Paul Naso, following some dumb advice to try and get what I want?
Nah.

I push open the restroom door, stepping back into the corridor, but she’s gone.
I missed it. Again.

Time to reset.`,
                [],
                e,
                [
                    `Coward’s Retreat`,
                    `Hide in the restroom`,
                    `After chickening out, you hide in the restroom and overhear a conversation about someone who cheated due to bad advice. When you emerge, Jessica is gone.`,
                ],
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
                d,
                [
                    `Easy Connection`,
                    `Approach`,
                    `You approach Jessica with a normal conversation about the exam, and for once, everything feels natural. No games, no pressure—just a comfortable, genuine interaction.`,
                ],
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
                    e,
                    [
                        `Mixed Signals`,
                        `Stop - Freeze-Out`,
                        `You ignore her after she doesn’t immediately reciprocate interest, thinking she’ll chase you for attention. She doesn't.`,
                    ],
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
                    e,
                    [
                        `Touching Boundaries`,
                        `Touch - Kino Escalation`,
                        `You attempt to slowly increase physical contact, but she becomes visibly uncomfortable and rejects your advances.`,
                    ],
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
                    e,
                    [
                        `Jealousy Backfire`,
                        `Recall - Jealousy play`,
                        `You try to make Jessica jealous by mentioning other girls, but it backfires completely. Instead of drawing her in, it frustrates her, and she walks away.`,
                    ],
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
                    e,
                    [
                        `Mixed Signals`,
                        `Compliment outside - Push-Pull Technique`,
                        `You alternate between showing interest and disinterest, trying to keep her guessing, but she becomes frustrated and tells you to figure it out, walking away.`,
                    ],
                ],
                'ex_gossip': [
                    `“You know, I’ve been thinking a lot about relationships lately. How some people just don’t appreciate what they have. It’s sad, really.”

Jessica glances at me, curious but cautious.
“Yeah?”

“Yeah, like, take this guy Paul Naso for example. I heard he cheated on his girlfriend because some website told him he’s ‘in his prime’ or whatever. Can you believe that? I would never do that. I don’t get how some guys can be so heartless.”

She gives a polite nod but doesn’t say much, so I push on.

“Honestly, I think it’s rare these days to find a partner who’s actually kind, you know? Someone who really cares about the person they’re with, who’s loyal, who’s willing to put in the effort. Someone like... well, me.”

I glance at her, hoping for some kind of reaction.
“I mean, I don’t want to sound cocky or anything, but I’m not like those others out there.”

Jessica chuckles awkwardly, trying to stay polite.
“I guess it’s good to be confident in yourself.”

“Exactly! It’s just that, you know, if you were with me, you’d never have to worry about being cheated on or lied to. I’d treat you like you deserve. Like, I’ve seen some of the people around here... trust me, you’d be making a mistake with anyone but me.”

Jessica’s polite smile fades completely and she glances away, clearly uncomfortable.
“That’s... uh, good to know.”

I feel a pang of frustration, but I try to keep my tone light.
“You deserve the best, right? And I can give you that. You wouldn’t regret it.”

Jessica takes a small step away, her body language shifting.
“I think... maybe we should just keep things casual, you know? It’s good to talk, but I’m not really looking for anything like that right now. Well... I need to go.”

I stand there, my heart sinking as I realize I’ve pushed too hard.

How could she not see I’m exactly what she needs?`, 
                    [],
                    e,
                    [
                        `Nice Guy Syndrome`,
                        `Gossip - Be a nice guy`,
                        `You trash-talk Paul Naso and his girlfriend, trying to show Jessica how much better you are, but the more you talk about yourself, the more uncomfortable she becomes.`,
                    ],
                ],
    'final': [
        `I’ve tried almost everything.
My chest feels tight as I weave through the crowd, my heart pounding in frustration. Nothing’s working.
Every line, every move, it’s all falling apart, no matter how many times I start over.
I need help—Jackson might be my last chance to make sense of this mess, even if his advice never felt like the good thing for me.
I spot him leaning casually against the wall, chatting with someone, but I push through, determined.
“Hey, Jackson,” I blurt, my voice more desperate than I’d like.

He looks up, eyebrows raised, sensing the urgency in my tone.
“Whoa, you alright, man? Did you bomb the test so badly?”

I hesitate, the weight of the secret I’m carrying gnawing at me. How can I explain this without sounding insane?
I’ve reset this moment over and over, trying to crack the code, to win her over... but I can’t tell him that. He’d never believe me.
I take a breath.
“I’ve... I’ve tried everything,” I say, avoiding his eyes.
“But nothing’s working. I keep screwing it up. It’s like no matter what I do, I can’t get it right.”

Jackson frowns, confused.
“Everything? Dude, you’re just talking about a girl, right? Why do you sound like you’re in some kind of life-or-death situation?”

I swallow hard, glancing back toward the girl, Jessica, still standing with her friends, laughing, completely oblivious to the storm raging in my mind.
“It’s... complicated,” I mumble, choosing my words carefully. 
“I keep trying, you know? Trying different things, but... I don’t know. It feels like I’m stuck. Like no matter what I do, it doesn’t change.”

Jackson’s eyes narrow, but he doesn’t push. His tone softens.
“Look, you’re overthinking this. You’re making it harder than it has to be. Just talk to her, man. Be yourself. Stop trying all these weird tactics or whatever. It’s not some game.”

I want to argue, to tell him he doesn’t understand, but I bite my tongue.
The time resets, the failures, the endless cycles—he can’t know.
Instead, I clench my fists, trying to keep my frustration from boiling over.

Jackson continues, his voice calm and steady.
“You’ve got to stop putting so much pressure on this. Just go talk to her like you’d talk to anyone else. Be honest. You’ve got nothing to lose, right?”

I open my mouth to protest, but he holds up a hand to stop me.
“If you keep playing these games, man, you’re gonna lose way more than just her.”
He pauses, locking eyes with me.
“You might get her attention for a minute, but you’ll never get something real if you keep this up. You’ll lose whatever chemistry you might end up having. And worse, you’re gonna lose yourself in the process.”

The words hit harder than I expect, cutting through my confusion.
“What do you mean, lose myself?”

Jackson shrugs.
“You think you’re in control with all these tricks, but really, they’re controlling you. The more you play the game, the less you’re... you. And then what’s left?”

I stare at him, the words settling into my mind like stones sinking to the bottom of a lake. There’s a moment where I almost believe him—almost. But a part of me can’t let go. A part of me still thinks I need the edge, the tactics, I need their support, their security.

I force a smile, nodding.
“Yeah, maybe you’re right.”

He claps me on the shoulder.
“Of course I’m right. Now go.”

I turn, my heart sinking as I look toward the corridor again.
But she’s not there anymore. The space where she stood is empty, her laughter gone. I blink, panic creeping in again.

I missed it. Again.

Jackson glances over, then back at me with a sympathetic smile.
“You'll get another chance; I know it.”

Oh, Jackson, if you knew how many chances I had.
What do I do now? I'm so lost.`, 
        [],
        "Press ENTER to rewind... or... what if you just stop?",
        [
            `Jackson's clutch`,
            `Walk to Jackson`,
            `After seeking advice from Jackson, you reflect on how nothing is working. He urges you to stop playing games, but as you turn back, Jessica is gone once again. Another missed chance—what now?`,
        ],
    ],
    'the_end': [
        `I stand frozen in the corridor, my eyes still fixed on the empty space where she stood just moments ago. The sound of the school buzzing around me fades into the background, and all I can hear is the echo of my own heartbeat.
I lost her again.
For a moment, I feel that familiar pit of frustration, the one that always comes after another failed attempt, another reset.

I’ve been so focused on winning her, on playing every move perfectly, like she’s some kind of puzzle to be solved. But with every reset, every manipulation, I’ve felt myself slipping further away—from her, from reality, from myself.
I glance at the corridor again, the empty space where she was.
This wasn’t the way to find her. It never was.

Jackson is right, I’ll get another chance, but not like this.
I shake my head, breathing deeply as a sense of clarity washes over me. Not like this, I think again.
I’m not going to force another reset, not going to twist reality just to try some new trick.
If there’s going to be a chance, it’ll be real. It has to be real. No more lies. No more tricks. No more games.

I turn to leave, but before I can take a step, I feel a hand on my shoulder. It’s Jackson.
“You okay?”

For a second, I almost laugh. He’s been there this whole time, giving me advice I was too stubborn to hear. I look at him, this time really look at him, and I see the concern in his eyes—the kind of concern that’s genuine. The kind that comes from someone who actually cares.

I nod, breathless but sure. 
“Yeah. I’m good.”

I don’t waste another second. I break into a run, bursting through the school doors and into the cool evening air. The sun is setting, casting a warm glow over everything, and there, in the distance, I see her.
Jessica.

She's walking down the street, unaware of the storm that’s been brewing inside me.
My heart races, but this time it’s not from anxiety or fear of failure. It’s something different—hope.

I keep running, closing the distance between us, my mind clear for the first time in what feels like years.
I don’t know what I’ll say when I catch up to her, and for the first time, that doesn’t scare me. I’ll figure it out. I’ll be me—no more lines, no more tricks, no more resets. Just me.

And whatever happens next... it will be real.`, 
        [],
        'Press ENTER to break the loop',
        [
            `A Real Chance`,
            `Break the loop`,
            `You decide to stop manipulating, run after Jessica, and plan to be genuine for once, ending the time loops for good.`,
        ],
    ],

    'ee1': [
        `I walk up to her. Jessica’s there at her locker, pulling out a couple of books with that usual look on her face—uninterested, like I don’t even exist. No big deal. I lean against the lockers nearby, cross my arms and legs, and without even glancing at her, I throw out a casual:
“Hey.” -Pistol finger-. “Jessica, right?”

She blinks, surprised, like I caught her off guard or something.
“Yeah, hi, sorry, I thought you knew my name because we’ve interacted so many times, but maybe I was just being stupid,”
she stammers, twirling a strand of hair around her finger.
“Sorry, I’m Jessica. That’s me.”

She lets out this awkward chuckle.
I don’t even really listen to all of it. Over her voice, I just respond,
“Cool, see you around.”

As I turn and walk away, I hear her stumbling over her words,
“Yes, I hope I see you... around.”

I stop, just for a second, glance over my shoulder, and with the faintest of smirks, I throw back,
“Guess we’ll see,” before I keep walking, not even waiting for her reaction.

I can hear it though—the moment I’m out of sight, she’s basically screaming, like a lovesick teenager.

Nailed it.

Now let's jump into a vat of acid.`,
        [],
        e,
        [
            `Easter-Egg - Acid`,
            `Jump into a vat of acid`,
            `Reference to Rick and Morty S04 E08, one of the inspirations for the game.`,
        ],
    ],
    'ee2': [
        `The gnocchi pulls out all those happy holiday Rome memories. It almost feels sunny. So you smile.
 
Clare is at your shoulder with a pack of biscuits and some chocolate, "Why the big smile?" She sees the brunette at the end of aisle, "Oh I see..." and slaps your wrist playfully. You roll your eyes, "I was remembering Rome actually." She rolls her eyes, "Really, you're such an old romantic..."

Wait? Where am I? What was this text? Some sort of Golden Ending from another reality?`,
        [],
        e,
        [
            `Easter-Egg - Gnocchi`,
            `Remember Clare`,
            `Reference to Aisle, the game that served as the main inspiration for this game.`,
        ],
    ],
    'ee3': [
        `Maybe her rejecting me is a Nexus Event or something.
        I'm just waiting for The Watcher or the TVA to confirm it.`,
        [],
        e,
        [
            `Easter-Egg - Nexus Event`,
            `Waiting for The Watcher`,
            `Reference to What If's Evil Strange's tragedic story, a minor inspiration for the mechanics of this game.`,
        ],
    ],

    'reflection': () => getReflectionState(reflectionIndex)
};

export function getOriginalStoryStates() {
    return JSON.parse(JSON.stringify(storyStates)); // Return a copy of the original state
}