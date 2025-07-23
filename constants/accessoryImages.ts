export const accessoryImages = {
  beanie: require('../assets/accessories/beanie.png'),
  bracelet: require('../assets/accessories/bracelet.png'),
  earrings: require('../assets/accessories/earrings.png'),
  glasses: require('../assets/accessories/glasses.png'),
  gloves: require('../assets/accessories/gloves.png'),
  hairTie: require('../assets/accessories/hairTie.png'),
  hairUp: require('../assets/accessories/hairUp.png'),
  hat: require('../assets/accessories/hat.png'),
  cap: require('../assets/accessories/cap.png'),
  hatTight: require('../assets/accessories/hatTight.png'),
  hatWool: require('../assets/accessories/hatWool.png'),
  headscarfhaircontrol: require('../assets/accessories/headscarfhaircontrol.png'),
  necklace: require('../assets/accessories/necklace.png'),
  scarf: require('../assets/accessories/scarf.png'),
  scarfDecorative: require('../assets/accessories/scarfDecorative.png'),
  scarfLight: require('../assets/accessories/scarfLight.png'),
  scarfMedium: require('../assets/accessories/scarfMedium.png'),
  scarfNeck: require('../assets/accessories/scarfNeck.png'),
  scarfThick: require('../assets/accessories/scarfThick.png'),
  sunglasses: require('../assets/accessories/sunglasses.png'),
  watch: require('../assets/accessories/watch.png'),
  waterBottle: require('../assets/accessories/waterBottle.png'),
  rain_boots: require('../assets/accessories/rain_boots.png'),
  raincoat: require('../assets/accessories/raincoat.png'),
  scarfHead: require('../assets/accessories/scarfHead.png'),
  umbrella: require('../assets/accessories/umbrella.png'),
  windbreaker: require('../assets/accessories/windbreaker.png'),
  hair_control: require('../assets/accessories/hair_control.png'),
  simpleNecklace: require('../assets/accessories/simpleNecklace.png'),
  femaleSunHat: require('../assets/accessories/femaleSunHat.png') 
 

} as const;

export type AccessoryName = keyof typeof accessoryImages;
