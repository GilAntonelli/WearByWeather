export function formatLocationName(name: string, state?: string, country?: string): string {
  if (!name) return '';


  // 🌍 Para os demais, exibe apenas cidade e país
  if (country) {
    return `${name}, ${country}`;
  }

  return name;
}
