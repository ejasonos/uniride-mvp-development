import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';

import { useTheme } from '@hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export default function Input({
  label,
  error,
  containerStyle,
  ...props
}: InputProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor={colors.TEXT_SECONDARY}
        {...props}
      />

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginBottom: 4,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.BORDER,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 14,
      color: colors.TEXT_PRIMARY,
      marginVertical: 8,
      backgroundColor: colors.CARD,
    },

    inputError: {
      borderColor: colors.ERROR,
      borderWidth: 1.5,
    },

    errorText: {
      fontSize: 12,
      color: colors.ERROR,
      marginTop: 4,
    },
  });