import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { globalStyles } from '@styles/index';
import { COLORS } from '@constants/index';

interface SignUpRoleScreenProps {
  navigation: any;
}

export const SignUpRoleScreen: React.FC<SignUpRoleScreenProps> = ({ navigation }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>Select how you want to use UniRide</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {/* Student Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('StudentSignUp')}
          activeOpacity={0.7}
        >
          <Card style={styles.optionCard}>
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>👨‍🎓</Text>
              <Text style={styles.optionTitle}>Student</Text>
              <Text style={styles.optionDescription}>
                Request rides and connect with campus drivers
              </Text>
              <View style={styles.optionFeatures}>
                <Text style={styles.feature}>• Find rides easily</Text>
                <Text style={styles.feature}>• Negotiate prices</Text>
                <Text style={styles.feature}>• Safe & convenient</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Driver Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('DriverSignUp')}
          activeOpacity={0.7}
        >
          <Card style={styles.optionCard}>
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>🚗</Text>
              <Text style={styles.optionTitle}>Driver</Text>
              <Text style={styles.optionDescription}>
                Earn money by offering rides to students
              </Text>
              <View style={styles.optionFeatures}>
                <Text style={styles.feature}>• Earn on your schedule</Text>
                <Text style={styles.feature}>• Set your own prices</Text>
                <Text style={styles.feature}>• Connect with students</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('Login')}
          variant="secondary"
          style={styles.signInButton}
          textStyle={styles.signInText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  optionCard: {
    marginVertical: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  optionFeatures: {
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
  },
  feature: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  signInButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  signInText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
});
