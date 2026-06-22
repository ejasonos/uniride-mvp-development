import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function Card({
  children,
  style,
}: CardProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.CARD,
      borderRadius: 12,
      padding: 12,
      marginVertical: 8,

      elevation: 2,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  });