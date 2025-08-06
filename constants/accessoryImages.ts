export const accessoryImages = {
  beanie: require('../assets/accessories/beanie.png'),
  bucket_hat: require('../assets/accessories/bucket_hat.png'),
  cap: require('../assets/accessories/cap.png'),
  cooling_neck_bands: require('../assets/accessories/cooling_neck_bands.png'),
  face_covering_scarf: require('../assets/accessories/face_covering_scarf.png'),
  faux_fur_earmuffs: require('../assets/accessories/faux_fur_earmuffs.png'),
  gloves: require('../assets/accessories/gloves.png'),
  head_bandana: require('../assets/accessories/head_bandana.png'),
  head_scarf: require('../assets/accessories/head_scarf.png'),
  lined_raincoat: require('../assets/accessories/lined_raincoat.png'),
  panama_hat: require('../assets/accessories/panama_hat.png'),
  portable_handheld_fan: require('../assets/accessories/portable_handheld_fan.png'),
  rain_boots: require('../assets/accessories/rain_boots.png'),
  raincoat: require('../assets/accessories/raincoat.png'),
  scarfChunky: require('../assets/accessories/scarfChunky.png'),
  scarfLight: require('../assets/accessories/scarfLight.png'),
  scarfMedium: require('../assets/accessories/scarfMedium.png'),
  sunglasses: require('../assets/accessories/sunglasses.png'),
 
  thermal_socks: require('../assets/accessories/thermal_socks.png'),
  thermal_vest: require('../assets/accessories/thermal_vest.png'),
  umbrella: require('../assets/accessories/umbrella.png'),
  waterBottle: require('../assets/accessories/waterBottle.png'),
  windbreaker: require('../assets/accessories/windbreaker.png'),


sun_protection_sleeves: require('../assets/accessories/sun_protection_sleeves.png'),

ear_cover_band: require('../assets/accessories/ear_cover_band.png'),
cooling_towel: require('../assets/accessories/cooling_towel.png'),
} as const;

export type AccessoryName = keyof typeof accessoryImages;
