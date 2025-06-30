export function getPreferredCityName(city: any): string {
  return city?.local_names?.pt || city.name;
}