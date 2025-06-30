export function formatLocationName(name: string, state?: string, country?: string): string {
  if (!name) return '';

  // 🇧🇷 Exibe estado apenas se for Brasil
  if (country?.toLowerCase() === 'brasil' && state) {
    return `${name}, ${state}`;
  }

  // 🌍 Para os demais, exibe apenas cidade e país
  if (country) {
    return `${name}, ${country}`;
  }

  return name;
}
