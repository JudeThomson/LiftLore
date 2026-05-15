import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "../constants/theme";
import { saveWorkout } from "../storage/storage";

const AddWorkoutScreen = () => {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleSave = async () => {
    if (!exercise || !weight || !reps) {
      Alert.alert(
        "Missing Info",
        "Please fill in all fields to log your workout.",
      );
      return;
    }

    const workoutData = {
      id: Date.now().toString(),
      name: exercise,
      weight: parseFloat(weight),
      reps: parseInt(reps, 10),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timestamp: new Date().toISOString(),
    };

    const success = await saveWorkout(workoutData);

    if (success) {
      // Reset form
      setExercise("");
      setWeight("");
      setReps("");

      Alert.alert("Success", "Workout logged successfully!");
    } else {
      Alert.alert("Error", "Failed to save workout. Please try again.");
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Workout</Text>
            <Text style={styles.subtitle}>
              Track your progress and level up.
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.form}>
            {/* Exercise Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Exercise</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="fitness-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Bench Press"
                  placeholderTextColor={COLORS.textMuted}
                  value={exercise}
                  onChangeText={setExercise}
                  selectionColor={COLORS.primary}
                />
              </View>
            </View>

            <View style={styles.row}>
              {/* Weight Input */}
              <View
                style={[
                  styles.inputGroup,
                  { flex: 1, marginRight: SPACING.sm },
                ]}
              >
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                    selectionColor={COLORS.primary}
                  />
                </View>
              </View>

              {/* Reps Input */}
              <View
                style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}
              >
                <Text style={styles.label}>Reps</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                    selectionColor={COLORS.primary}
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Workout</Text>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.primary} />
            <Text style={styles.tipsText}>
              Consistency is key. Even a small session contributes to your rank
              progress.
            </Text>
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
    padding: SPACING.md,
    flexGrow: 1,
  },
  header: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  form: {
    flex: 1,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 56,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
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
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  tipsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xxl,
    alignItems: "center",
  },
  tipsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});

export default AddWorkoutScreen;
