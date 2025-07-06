import { Dimensions, StyleSheet } from 'react-native';
import { theme } from './theme';

const screenWidth = Dimensions.get('window').width;
const cardSpacing = 12;
const containerPadding = 24;
const cardWidth = (screenWidth - containerPadding * 2 - cardSpacing * 2) / 3;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl, // ✅ ajuste aplicado para SafeArea
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIntro: {
    marginBottom: 24,
  },
  imageWelcome: {
    width: 200,
    height: 200,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  titleWelcome: {
    fontSize: theme.fontSize.extralarge,
    fontWeight: '600',
    fontFamily: 'System',
    color: theme.colors.textDark,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  subtitleWelcome: {
    fontSize: theme.fontSize.medium,
    fontWeight: '400',
    fontFamily: 'System',
    color: theme.colors.textMedium,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: theme.spacing.lg,
    maxWidth: 280,
    alignSelf: 'center',
    letterSpacing: 0.2,
  },
  subtitleWelcomeStrong: {
    color: theme.colors.textMedium,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  descriptionWithSpacing: {
    color: theme.colors.textMedium,
    fontSize: theme.fontSize.medium,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.large,
    fontWeight: '700',
    fontFamily: 'serif',
    color: theme.colors.textDark,
    textAlign: 'left',
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: '300',
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
    maxWidth: 280,
    alignSelf: 'center',
    opacity: 1,
  },
  description: {
    color: theme.colors.textDark,
    fontSize: theme.fontSize.medium,
    marginBottom: theme.spacing.sm,
  },
  subtext: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.medium,
    marginBottom: theme.spacing.lg,
    color: theme.colors.textDark,
  },
  inputFocused: {
    borderColor: theme.colors.primary, // amarelo
    borderWidth: 1,
    backgroundColor: '#fff9e5',        // mesmo fundo dos cards selecionados
    borderRadius: theme.radius.md,     // igual aos cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  validationText: {
    color: 'red',
    //fontSize: theme.fontSize.small,
    fontSize: 12,

    marginTop: 4,
    marginBottom: 8,
    fontWeight: '500',
  },


  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textDark,
  },

  //cards do bloco conforto
  block: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: '#fff',
  },
  blockLabel: {
    fontWeight: 'bold',
    fontSize: theme.fontSize.medium,
    color: theme.colors.textDark,
  },
  blockDesc: {
    //fontSize: theme.fontSize.small,
    fontSize: 12,

    color: theme.colors.textLight,
    marginTop: 4,
  },

  contentWrapper: {
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },

  comfortBlockSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#fff9e5',
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  subtextItalic: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
  },
  homeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: theme.colors.textDark,
    flex: 1,
  },
  changeButton: {
    backgroundColor: '#e0ecf8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  cardhome: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginTop: 32,
    marginBottom: 12,
  }, weatherInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  weatherSecondary: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  weatherLabel: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  weatherInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },

  lookRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.9,
    resizeMode: 'contain',
  },
  lookText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textDark,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e7f0ff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  climateInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  climateInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  climateCard: {
    flex: 1,
    backgroundColor: '#f3f9ff',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  climateLabel: {
    fontSize: 13,
    color: theme.colors.textDark,
    marginTop: 2,
  },
  climateValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginTop: 2,
  },


  fakeSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  fakeSearchText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },



  hourlyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hourCard: {
    width: 70,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
  },
  hourLabel: {
    fontSize: 13,
    //fontSize: theme.fontSize.small,

    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.textDark,
  },
  hourTemp: {
    fontSize: 14,
    color: theme.colors.textDark,
    marginTop: 4,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 100,
  },
  detailCard: {
    width: '47%',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailCardFull: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: theme.colors.textDark,
  },
  detailValue: {
    fontSize: 13,
    color: theme.colors.textLight,
    lineHeight: 18,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFD23F',
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bottomButtonText: {
    fontWeight: 'bold',
    color: theme.colors.textDark,
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: theme.colors.textDark,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  cityName: {
    fontSize: 16,
    color: theme.colors.textDark,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  heroImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  suggestionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  accessoryColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  accessoryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  accessoryIconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  accessoryIcon: {
    width: 48,
    height: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },

  // Cards do bloco de moda

  preferenceCardContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },

  preferenceCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    margin: 4,
    flexDirection: 'column', // garante empilhamento vertical correto

  },
  preferenceCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#fff9e5',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  preferenceCardText: {
    fontSize: theme.fontSize.cardText,
    color: theme.colors.textDark,
    textAlign: 'center',
  },
  preferenceCardIcon: {
    fontSize: theme.fontSize.cardText,
    marginBottom: 4, // ↓ diminuir para reduzir o "vão" entre ícone e texto
    marginTop: 2, // ↑ acrescentar para centralizar melhor verticalmente
    color: theme.colors.textMedium,
    textAlign: 'center',
  },















  forecastHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: theme.colors.forecastBackground,
  },

  forecastHeaderLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },

  forecastHeaderCity: {
    fontSize: 16,
    color: theme.colors.textDark,
    fontWeight: 'bold',
  },

  forecastHeaderDate: {
    fontSize: 14,
    color: theme.colors.textDark,
    marginTop: 4,
  },

  forecastMainTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginTop: 8,
  },

  forecastWeatherLabel: {
    fontSize: 16,
    color: theme.colors.textDark,
    marginTop: 4,
  },

  weatherInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.textLight,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  currentWeatherBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  forecastHeaderIcon: {
    marginTop: 16,
    marginBottom: 8,
  },

  forecastHeaderTemperature: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginBottom: 8,
  },

  forecastHeaderCondition: {
    fontSize: 16,
    color: theme.colors.textDark,
  },

  forecastHeaderSmartPhrase: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.textDark,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  active: {
    backgroundColor: '#F9C700'
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
  },
  activeButtonText: {
    color: theme.colors.textDark,
  },
  langButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  langButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  langText: {
    color: theme.colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  langTextActive: {
    color: theme.colors.textDark,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  // Espaçamentos verticais padronizados
  sectionSpacing: {
    marginBottom: 24,
  },

  inputGap: {
    marginBottom: 16,
  },

  blockGap: {
    marginTop: 8,
    marginBottom: 8,
  },

  cardGroupSpacing: {
    marginTop: 12,
    marginBottom: 20,
  },

  infoTextSpacing: {
    marginTop: 4,
    marginBottom: 20,
  },

  gearIcon: {
    fontSize: 24,
    color: theme.colors.textDark,
  },

});
