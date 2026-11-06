// Pose library.
// Joint coordinates live in a 100 x 200 box (x: left -> right as seen on screen, y: top -> bottom).
// head, neck, sL/sR shoulders, eL/eR elbows, hL/hR hands, pL/pR hips,
// kL/kR knees, aL/aR ankles, tL/tR toes.  "L" = left side of the screen.
// frame: default size/position of the outline on the camera (s = scale, y = shift as a fraction of screen height).

window.POSES = [
  {
    id: 's-curve',
    name: 'The S-Curve',
    tag: 'Full body',
    level: 'Easy',
    why: 'Shifting weight onto one leg and popping the hip gives a natural waist curve and makes legs look longer than standing flat.',
    tilt: -6,
    j: { head:[52,20], neck:[51,32], sL:[39,39], sR:[62,37], eL:[33,64], hL:[36,88], eR:[72,62], hR:[60,88],
         pL:[44,93], pR:[60,89], kL:[50,138], aL:[44,180], tL:[40,189], kR:[57,137], aR:[54,183], tR:[59,190] },
    camera: { height: 'Her waist', distance: '3–4 big steps back', frame: 'Head to toe, feet at the very bottom' },
    steps: [
      'Put all your weight on your back leg.',
      'Bend your front knee in toward the other knee.',
      'Hand on your hip — leave a gap between your arm and waist.',
      'Push that hip out a little, and turn your body slightly away from me.',
      'Chin forward and a little down. Relax your shoulders.'
    ],
    you: [
      'Crouch until the phone is at her waist. Keep it straight up and down, not tipped back.',
      'Her feet should touch the bottom edge of the screen — no empty floor under her.',
      'Check the gap between her arm and waist is showing. If it closes up, ask her to move her elbow back.'
    ]
  },
  {
    id: 'walk',
    name: 'Walking Toward You',
    tag: 'Full body',
    level: 'Easy',
    why: 'Movement looks relaxed and candid instead of stiff, and the stride lengthens the legs.',
    j: { head:[50,20], neck:[50,32], sL:[38,38], sR:[62,38], eL:[34,63], hL:[38,86], eR:[65,64], hR:[64,88],
         pL:[42,92], pR:[58,92], kL:[44,138], aL:[46,184], tL:[45,193], kR:[57,136], aR:[60,175], tR:[61,183] },
    camera: { height: 'Her waist', distance: 'Start 6–8 steps away', frame: 'Head to toe, a little space above her head' },
    steps: [
      'Walk slowly toward me — slower than feels normal.',
      'Cross each foot slightly in front of the other, like a runway.',
      'Let your arms swing loosely, or touch your hair or bag as you walk.',
      'Look down at the ground, then off to the side, then at me — keep it moving.'
    ],
    you: [
      'Hold the shutter for a burst the whole time she walks. The best shot is mid-stride.',
      'Walk backwards slowly if she gets too close — keep her the same size as the outline.',
      'Pick the frames where her front leg is straight and closest to the camera.'
    ]
  },
  {
    id: 'over-shoulder',
    name: 'Over the Shoulder',
    tag: 'Full body',
    level: 'Easy',
    why: 'Turning the body away and looking back shows off the jawline and outfit and feels effortless.',
    face: 'right',
    j: { head:[53,20], neck:[51,32], sL:[40,39], sR:[61,38], eL:[36,64], hL:[40,88], eR:[64,63], hR:[60,86],
         pL:[43,92], pR:[57,92], kL:[45,138], aL:[46,183], tL:[44,190], kR:[53,138], aR:[55,182], tR:[57,190] },
    camera: { height: 'Her chest', distance: '3–4 steps back', frame: 'Head to toe, or crop mid-thigh' },
    steps: [
      'Turn your back to me and start walking away.',
      'Stop, and look back over your shoulder toward me.',
      'Drop the shoulder closest to me a little.',
      'Look past me first, then let your eyes find the camera.',
      'Soft smile — or a laugh, I’ll catch it.'
    ],
    you: [
      'Use the flip button (⇋) to match which shoulder she looks over.',
      'Shoot a burst as she turns — the moment just before she fully looks is often best.',
      'If her face is in shadow, move around until the light hits the side of her face that’s turned to you.'
    ]
  },
  {
    id: 'hair',
    name: 'Hand in Hair',
    tag: 'Full body',
    level: 'Easy',
    why: 'A raised arm lengthens the body and gives her hands something natural to do.',
    tilt: 5,
    j: { head:[50,20], neck:[50,32], sL:[38,38], sR:[62,38], eL:[34,64], hL:[40,88], eR:[73,23], hR:[59,12],
         pL:[41,90], pR:[57,93], kL:[44,137], aL:[47,183], tL:[43,190], kR:[53,138], aR:[52,181], tR:[57,189] },
    camera: { height: 'Her waist', distance: '3–4 steps back', frame: 'Head to toe' },
    steps: [
      'Weight on one leg, other knee relaxed.',
      'Run one hand slowly through your hair from the front.',
      'Keep your elbow up and out to the side — don’t cover your face.',
      'Tilt your head toward the raised arm, a little.',
      'Do it again slowly — I’m taking a burst.'
    ],
    you: [
      'Shoot the whole hair movement as a burst, then pick the frame where her face is open.',
      'If her elbow is blocking her face, ask her to lift it higher.',
      'Make sure the top of her raised hand isn’t cut off by the frame.'
    ]
  },
  {
    id: 'wall-lean',
    name: 'Wall Lean',
    tag: 'Full body',
    level: 'Medium',
    why: 'Leaning gives a relaxed, confident look and the crossed legs make a long diagonal line.',
    tilt: -4,
    props: [ { x1:24, y1:4, x2:24, y2:196 } ],
    j: { head:[44,22], neck:[45,34], sL:[33,40], sR:[57,42], eL:[28,66], hL:[36,90], eR:[62,66], hR:[52,86],
         pL:[41,94], pR:[57,94], kL:[48,138], aL:[58,182], tL:[62,190], kR:[56,138], aR:[52,182], tR:[48,190] },
    camera: { height: 'Her waist', distance: '3 steps back, slightly to the side', frame: 'Head to toe, wall on one side' },
    steps: [
      'Lean one shoulder against the wall.',
      'Step your feet a little away from the wall.',
      'Cross the leg that’s further from the wall over the other one.',
      'Hand nearest me rests on your thigh or in a pocket.',
      'Look away down the street, then back to me.'
    ],
    you: [
      'The dashed line is the wall. Flip the pose (⇋) if the wall is on her other side.',
      'Stand a little off to the side so the wall runs into the photo at an angle.',
      'Keep the wall’s edge straight up and down on your screen.'
    ]
  },
  {
    id: 'crossed',
    name: 'Crossed Ankles',
    tag: 'Full body',
    level: 'Easy',
    why: 'Crossing the legs narrows the stance and creates a slim, elegant line.',
    j: { head:[50,20], neck:[50,32], sL:[38,38], sR:[62,38], eL:[36,64], hL:[48,86], eR:[64,64], hR:[52,86],
         pL:[42,92], pR:[58,92], kL:[47,138], aL:[55,182], tL:[59,190], kR:[53,138], aR:[47,182], tR:[43,190] },
    camera: { height: 'Her waist', distance: '3–4 steps back', frame: 'Head to toe' },
    steps: [
      'Cross one leg over the other at the ankle.',
      'Point your front toe toward me.',
      'Hold your bag, drink, or hands loosely in front.',
      'Turn your shoulders a little to one side.',
      'Chin forward and down, then look at me.'
    ],
    you: [
      'Keep her feet right at the bottom of the frame.',
      'If she looks stiff, ask her to shift her weight and recross — then shoot right away.',
      'Check her hands aren’t clenched. Ask her to relax her fingers.'
    ]
  },
  {
    id: 'pockets',
    name: 'Hands in Pockets',
    tag: 'Full body',
    level: 'Easy',
    why: 'Casual and confident, and it solves the “what do I do with my hands” problem.',
    tilt: 4,
    j: { head:[50,20], neck:[50,32], sL:[38,38], sR:[62,38], eL:[31,66], hL:[42,90], eR:[69,66], hR:[58,90],
         pL:[42,92], pR:[58,92], kL:[45,138], aL:[44,183], tL:[40,190], kR:[56,137], aR:[59,182], tR:[63,190] },
    camera: { height: 'Her waist', distance: '3–4 steps back', frame: 'Head to toe' },
    steps: [
      'Thumbs or just your fingertips in your pockets — not the whole hand.',
      'Elbows out a little so there’s space by your waist.',
      'One foot slightly in front, knee soft.',
      'Small head tilt, relax your shoulders down.'
    ],
    you: [
      'Look for the gaps between her arms and waist — they make the pose read as slim.',
      'Crouch to her waist height and keep the phone upright.'
    ]
  },
  {
    id: 'candid',
    name: 'Candid Laugh (Close-up)',
    tag: 'Half body',
    level: 'Easy',
    kind: 'half',
    why: 'A real laugh looks better than a posed smile. Shooting from chest height and slightly above is flattering for faces.',
    tilt: -8,
    frame: { s: 1.9, y: 0.4 },
    j: { head:[50,20], neck:[50,32], sL:[38,38], sR:[62,38], eL:[30,62], hL:[45,44], eR:[66,64], hR:[62,88],
         pL:[42,92], pR:[58,92], kL:[44,138], aL:[45,183], tL:[42,190], kR:[56,138], aR:[55,183], tR:[58,190] },
    camera: { height: 'Her eye level or a bit above', distance: '2 steps back', frame: 'Top of head to mid-waist' },
    steps: [
      'Touch your collar, necklace or hair with one hand.',
      'Look down, then up at me.',
      'Now laugh — a fake laugh is fine, it turns real.',
      'Push your chin forward toward me a little.'
    ],
    you: [
      'Don’t zoom in from far away and don’t get super close — 2 steps is right.',
      'Crop at her waist, not at her elbows.',
      'Say something silly. Keep shooting through the laugh.'
    ]
  },
  {
    id: 'steps',
    name: 'Sitting on Steps',
    tag: 'Sitting',
    level: 'Medium',
    why: 'Angling the knees to one side looks relaxed and keeps legs from looking short.',
    frame: { s: 1.1, y: -0.05 },
    props: [ { x1:4, y1:134, x2:96, y2:134 }, { x1:4, y1:170, x2:96, y2:170 } ],
    j: { head:[50,60], neck:[50,72], sL:[38,78], sR:[62,78], eL:[40,104], hL:[58,112], eR:[66,100], hR:[62,112],
         pL:[43,128], pR:[57,128], kL:[62,112], aL:[56,160], tL:[60,168], kR:[70,118], aR:[70,162], tR:[75,168] },
    camera: { height: 'Her chest', distance: '2–3 steps back', frame: 'Whole body, feet included' },
    steps: [
      'Sit on a step, feet on the step below.',
      'Turn both knees together to one side.',
      'Rest your arms on your knees, hands loose.',
      'Sit up tall — don’t slouch. Lean forward a tiny bit.',
      'Look at me, then off to the side.'
    ],
    you: [
      'Get low — phone at her chest, not standing over her.',
      'The dashed lines show the steps. Flip (⇋) to match which way her knees point.',
      'Don’t let the frame cut through her feet.'
    ]
  },
  {
    id: 'ground',
    name: 'Seated, Legs to the Side',
    tag: 'Sitting',
    level: 'Medium',
    why: 'Folding the legs to one side makes a long, graceful shape — great for grass, sand or a picnic blanket.',
    frame: { s: 1.15, y: -0.1 },
    tilt: 6,
    props: [ { x1:4, y1:178, x2:96, y2:178 } ],
    j: { head:[46,92], neck:[47,104], sL:[36,110], sR:[58,112], eL:[30,134], hL:[28,158], eR:[60,134], hR:[64,152],
         pL:[42,158], pR:[56,160], kL:[70,156], aL:[82,170], tL:[88,172], kR:[66,166], aR:[80,176], tR:[86,176] },
    camera: { height: 'Her shoulders — kneel down', distance: '2–3 steps back', frame: 'Whole body' },
    steps: [
      'Sit down and fold both legs to one side.',
      'Plant one hand on the ground behind you.',
      'Other hand rests on your knee.',
      'Sit up tall through your back.',
      'Tilt your head toward the hand on the ground.'
    ],
    you: [
      'Kneel down — this shot fails if you shoot from standing.',
      'Keep her toes inside the frame.',
      'Flip (⇋) to match which side her legs go.'
    ]
  }
];

// Tips about the place / light. Shown alongside the pose tips.
window.SETTINGS = [
  { id:'golden', name:'🌅 Golden hour', tips: [
    { who:'you', text:'Put the sun behind her or off to the side for glowing hair. If her face looks dark, step around her until the light reaches it.' },
    { who:'you', text:'Golden hour is the hour before sunset. The light changes fast — shoot a lot.' }
  ]},
  { id:'sun', name:'☀️ Bright sun', tips: [
    { who:'you', text:'Midday sun makes squinting and dark eye shadows. Move her into open shade — the shadow of a building or tree.' },
    { who:'you', text:'No shade? Turn her back to the sun so she isn’t squinting.' }
  ]},
  { id:'shade', name:'☁️ Shade / cloudy', tips: [
    { who:'you', text:'Soft light is great. Turn her to face the brightest part of the sky.' }
  ]},
  { id:'city', name:'🏙️ City street', tips: [
    { who:'you', text:'Have her step a few feet away from walls so the background softens.' },
    { who:'you', text:'Use lines in the street (curbs, buildings) that lead to her. Keep buildings straight up and down.' },
    { who:'you', text:'Wait for people to walk out of the frame, or shoot a burst and pick a clear one.' }
  ]},
  { id:'beach', name:'🏖️ Beach / water', tips: [
    { who:'you', text:'Keep the horizon perfectly level, and never let it cut through her neck or head — put it at her waist or lower.' },
    { who:'you', text:'Bright sand fools the camera. If she looks dark, move so the sun is to her side.' }
  ]},
  { id:'nature', name:'🌿 Park / nature', tips: [
    { who:'you', text:'Check nothing is “growing” out of her head — trees, poles. Step sideways to move it.' },
    { who:'you', text:'Have her stand a few steps in front of greenery, not pressed against it.' }
  ]},
  { id:'indoor', name:'🪟 Indoors', tips: [
    { who:'you', text:'Face her toward a window. That’s the best light in any room.' },
    { who:'you', text:'Overhead lights give shadows under eyes. Turn them off if there’s window light.' }
  ]},
  { id:'night', name:'🌃 Night', tips: [
    { who:'you', text:'Find light for her face: a shop window, streetlight, or neon sign in front of her.' },
    { who:'you', text:'Tuck your elbows into your body and hold very still — night photos blur easily.' }
  ]}
];

// Always-on reminders.
window.BASICS = [
  { who:'you', only:'full', text:'Hold the phone at her waist or chest height — not your eye level. Shooting down from above makes legs look short.' },
  { who:'you', only:'full', text:'Her feet should be right at the bottom edge. Empty ground under her feet makes her look shorter.' },
  { who:'you', text:'Never crop at a joint (knees, elbows, wrists, ankles). Crop mid-thigh or mid-arm instead.' },
  { who:'you', text:'Step back instead of getting close. Wide phone lenses up close stretch faces and arms.' },
  { who:'you', text:'Take a lot. Hold the shutter or tap fast — 20 shots of one pose is normal.' },
  { who:'you', text:'Check the background: no bins, poles or people right behind her head.' },
  { who:'her', text:'“Chin forward and a little down.” (Kills double chins — looks weird in person, great on camera.)' },
  { who:'her', text:'“Drop your shoulders and breathe out.”' },
  { who:'her', text:'“Leave a little space between your arms and your waist.”' },
  { who:'her', text:'“You look great — one more.” (Seriously. Say it.)' }
];

window.REF_TIPS = [
  { who:'you', text:'Pinch and drag the photo so the person in it is the same size as her on screen.' },
  { who:'you', text:'Match where your phone was: if the example looks up at the person, crouch lower.' },
  { who:'her', text:'Turn the screen so she can see the example for a second before you start.' }
];
