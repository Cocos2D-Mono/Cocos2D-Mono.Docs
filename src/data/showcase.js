// "Made with Cocos2D-Mono" showcase entries.
//
// Adding a title is a one-entry PR: drop key art (square icon or landscape
// capsule both render fine) into static/img/showcase/ and add an entry here.
// Set image to null to use the styled initials tile until art is available.
// links: first entry is the primary target (the card title links to it);
// every entry renders in the card's platform-links row.
const showcase = [
  {
    title: "Frutz",
    studio: "Broken Walls Studios",
    blurb: "A colorful retro arcade shoot-'em-up, out now on Steam.",
    image: "img/showcase/frutz.jpg",
    links: [
      { label: "Steam", url: "https://store.steampowered.com/app/4673470/Frutz/" },
    ],
  },
  {
    title: "NeuroNation",
    studio: "Synaptikon GmbH",
    blurb: "Scientific brain training used by millions worldwide.",
    image: "img/showcase/neuronation.jpg",
    links: [
      { label: "Website", url: "https://www.neuronation.com/" },
      { label: "App Store", url: "https://apps.apple.com/us/app/neuronation-brain-training/id821549680" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=air.nn.mobile.app.main" },
    ],
  },
  {
    title: "2048@Classic",
    studio: "Broken Walls Studios",
    blurb: "The classic sliding-tile puzzle, polished for iOS and tvOS.",
    image: "img/showcase/2048-classic.jpg",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/2048-classic/id957822053" },
    ],
  },
  {
    title: "An Indie Game",
    studio: "Broken Walls Studios",
    blurb: "Run, jump, shoot, and swing your way to a high score.",
    image: "img/showcase/an-indie-game.png",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/an-indie-game/id476114460" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=brokenwallsstudios.games.anindiegame_" },
    ],
  },
  {
    title: "An Indie Game 2",
    studio: "Broken Walls Studios",
    blurb: "The sequel — more action, more mayhem, higher scores.",
    image: "img/showcase/an-indie-game-2.png",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/an-indie-game-2/id879950297" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=brokenwallsstudios.games.anindiegame_2" },
    ],
  },
  {
    title: "sakuru",
    studio: "Broken Walls Studios",
    blurb: "Pop dots and chase high scores in quick, colorful rounds.",
    image: "img/showcase/sakuru.jpg",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/sakuru/id879936882" },
    ],
  },
];

export default showcase;
