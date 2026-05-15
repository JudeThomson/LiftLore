import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../constants/theme";
import { saveUserProfile } from "../storage/storage";

const OnboardingScreen = ({ onFinish }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bio, setBio] = useState("");

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name to continue.");
      return;
    }

    const profileData = {
      name: name.trim(),
      age: age.trim(),
      height: height.trim(),
      weight: weight.trim(),
      bio: bio.trim(),
      xp: 0,
      onboarded: true,
      createdAt: new Date().toISOString(),
    };

    const success = await saveUserProfile(profileData);
    if (success !== false) {
      onFinish();
    } else {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Ionicons name="fitness" size={48} color={COLORS.primary} />
            <Text style={styles.title}>Welcome to LiftLore</Text>
            <Text style={styles.subtitle}>
              Forge your legacy. Let's start by setting up your profile.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Name - Required */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                selectionColor={COLORS.primary}
              />
            </View>

            <View style={styles.row}>
              {/* Age - Optional */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="24"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  selectionColor={COLORS.primary}
                />
              </View>

              {/* Weight - Optional */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="85"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  selectionColor={COLORS.primary}
                />
              </View>
            </View>

            {/* Height - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="180"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                selectionColor={COLORS.primary}
              />
            </View>

            {/* Bio - Optional */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What is your fitness goal?"
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                value={bio}
                onChangeText={setBio}
                selectionColor={COLORS.primary}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 56,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.md,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
});

export default OnboardingScreen;
