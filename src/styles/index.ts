// import { StyleSheet } from 'react-native';
// import { COLORS } from '@constants/index';

// export const globalStyles = StyleSheet.create({
//   // Containers
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.SECONDARY,
//   },

//   containerPadded: {
//     flex: 1,
//     backgroundColor: COLORS.SECONDARY,
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },

//   // Layout
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   rowCenter: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   column: {
//     flexDirection: 'column',
//   },

//   columnCenter: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Spacing
//   marginVertical: {
//     marginVertical: 8,
//   },

//   marginVerticalLarge: {
//     marginVertical: 16,
//   },

//   marginHorizontal: {
//     marginHorizontal: 8,
//   },

//   paddingVertical: {
//     paddingVertical: 8,
//   },

//   paddingVerticalLarge: {
//     paddingVertical: 16,
//   },

//   paddingHorizontal: {
//     paddingHorizontal: 8,
//   },

//   // Typography
//   heading1: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: COLORS.TEXT_PRIMARY,
//   },

//   heading2: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.TEXT_PRIMARY,
//   },

//   heading3: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: COLORS.TEXT_PRIMARY,
//   },

//   bodyLarge: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: COLORS.TEXT_PRIMARY,
//     lineHeight: 24,
//   },

//   bodyMedium: {
//     fontSize: 14,
//     fontWeight: '400',
//     color: COLORS.TEXT_PRIMARY,
//     lineHeight: 20,
//   },

//   bodySmall: {
//     fontSize: 12,
//     fontWeight: '400',
//     color: COLORS.TEXT_SECONDARY,
//     lineHeight: 18,
//   },

//   label: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: COLORS.TEXT_SECONDARY,
//     textTransform: 'uppercase',
//   },

//   // Buttons
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: 48,
//   },

//   buttonPrimary: {
//     backgroundColor: COLORS.PRIMARY,
//   },

//   buttonSecondary: {
//     backgroundColor: COLORS.LIGHT_GRAY,
//   },

//   buttonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.SECONDARY,
//   },

//   buttonTextSecondary: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.TEXT_PRIMARY,
//   },

//   // Inputs
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.GRAY,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     color: COLORS.TEXT_PRIMARY,
//     marginVertical: 8,
//   },

//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.TEXT_PRIMARY,
//     marginBottom: 4,
//   },

//   inputError: {
//     borderColor: COLORS.ERROR,
//     borderWidth: 1,
//   },

//   errorText: {
//     fontSize: 12,
//     color: COLORS.ERROR,
//     marginTop: 4,
//   },

//   // Cards
//   card: {
//     backgroundColor: COLORS.SECONDARY,
//     borderRadius: 12,
//     padding: 12,
//     marginVertical: 8,
//     elevation: 2,
//     shadowColor: COLORS.DARK,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },

//   // Dividers
//   divider: {
//     height: 1,
//     backgroundColor: COLORS.GRAY,
//     marginVertical: 12,
//   },

//   // Header
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.PRIMARY,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   headerText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.SECONDARY,
//   },

//   // Maps
//   mapContainer: {
//     flex: 1,
//   },

//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/index';

export const createGlobalStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0B0F14' : COLORS.SECONDARY,
    },

    textPrimary: {
      color: isDark ? '#FFFFFF' : COLORS.TEXT_PRIMARY,
    },

    textSecondary: {
      color: isDark ? '#A0A0A0' : COLORS.TEXT_SECONDARY,
    },
    containerPadded: {
      flex: 1,
      backgroundColor: COLORS.SECONDARY,
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
      color: COLORS.TEXT_PRIMARY,
    },

    heading2: {
      fontSize: 24,
      fontWeight: '700',
      color: COLORS.TEXT_PRIMARY,
    },

    heading3: {
      fontSize: 20,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
    },

    bodyLarge: {
      fontSize: 16,
      fontWeight: '400',
      color: COLORS.TEXT_PRIMARY,
      lineHeight: 24,
    },

    bodyMedium: {
      fontSize: 14,
      fontWeight: '400',
      color: COLORS.TEXT_PRIMARY,
      lineHeight: 20,
    },

    bodySmall: {
      fontSize: 12,
      fontWeight: '400',
      color: COLORS.TEXT_SECONDARY,
      lineHeight: 18,
    },

    label: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.TEXT_SECONDARY,
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
      backgroundColor: COLORS.PRIMARY,
    },

    buttonSecondary: {
      backgroundColor: COLORS.LIGHT_GRAY,
    },

    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.SECONDARY,
    },

    buttonTextSecondary: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
    },

    // Inputs
    input: {
      borderWidth: 1,
      borderColor: COLORS.GRAY,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 14,
      color: COLORS.TEXT_PRIMARY,
      marginVertical: 8,
    },

    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
      marginBottom: 4,
    },

    inputError: {
      borderColor: COLORS.ERROR,
      borderWidth: 1,
    },

    errorText: {
      fontSize: 12,
      color: COLORS.ERROR,
      marginTop: 4,
    },

    // Cards
    card: {
      backgroundColor: COLORS.SECONDARY,
      borderRadius: 12,
      padding: 12,
      marginVertical: 8,
      elevation: 2,
      shadowColor: COLORS.DARK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    // Dividers
    divider: {
      height: 1,
      backgroundColor: COLORS.GRAY,
      marginVertical: 12,
    },

    // Header
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: COLORS.PRIMARY,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    headerText: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.SECONDARY,
    },

    // Maps
    mapContainer: {
      flex: 1,
    },

    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });