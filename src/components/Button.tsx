import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { useTheme } from '@hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variant === 'primary'
          ? styles.primaryButton
          : styles.secondaryButton,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? colors.SECONDARY
              : colors.TEXT_PRIMARY
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color:
                variant === 'primary'
                  ? colors.SECONDARY
                  : colors.TEXT_PRIMARY,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    primaryButton: {
      backgroundColor: colors.PRIMARY,
    },

    secondaryButton: {
      backgroundColor: colors.CARD,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },

    disabled: {
      opacity: 0.5,
    },

    text: {
      fontSize: 16,
      fontWeight: '600',
    },
  });