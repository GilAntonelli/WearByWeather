import * as Location from 'expo-location';

export async function getdetectedCity() : Promise<string | undefined> {
    const location = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    });

    if (geocode.length > 0) {
        const detectedCity = geocode[0].city || geocode[0].subregion || 'Cidade não identificada';
        console.log('Cidade detectada getdetectedCity:', detectedCity);
        return detectedCity;     
    }
}