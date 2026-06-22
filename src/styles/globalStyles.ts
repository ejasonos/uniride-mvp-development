import { StyleSheet } from 'react-native';

export const createGlobalStyles = (colors: any) =>
  StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.SECONDARY,
  },
  
  containerPadded: {
    flex: 1,
    backgroundColor: colors.SECONDARY,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Spacing
  marginVertical: {
    marginVertical: 8,
  },

  marginVerticalLarge: {
    marginVertical: 16,
  },

  marginHorizontal: {
    marginHorizontal: 8,
  },

  paddingVertical: {
    paddingVertical: 8,
  },

  paddingVerticalLarge: {
    paddingVertical: 16,
  },

  paddingHorizontal: {
    paddingHorizontal: 8,
  },

  // Typography
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },

  heading2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },

  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },

  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.TEXT_PRIMARY,
    lineHeight: 24,
  },

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.TEXT_PRIMARY,
    lineHeight: 20,
  },

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.TEXT_SECONDARY,
    lineHeight: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
  },

  // Buttons
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },

  buttonPrimary: {
    backgroundColor: colors.PRIMARY,
  },

  buttonSecondary: {
    backgroundColor: colors.LIGHT_GRAY,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.SECONDARY,
  },

  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    marginVertical: 8,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
    marginBottom: 4,
  },

  inputError: {
    borderColor: colors.ERROR,
    borderWidth: 1,
  },

  errorText: {
    fontSize: 12,
    color: colors.ERROR,
    marginTop: 4,
  },

  // Cards
  card: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: colors.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.GRAY,
    marginVertical: 12,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.SECONDARY,
  },

  // Maps
  mapContainer: {
    flex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
