import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../constants/theme";

const WorkoutCard = ({ workout }) => {
  const category = workout.category || "General";
  
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.details}>{workout.date}</Text>
          </View>
          <View style={[styles.detailItem, { marginLeft: SPACING.md }]}>
            <Ionicons name="stats-chart-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.details}>
              {workout.weight}kg × {workout.reps} reps
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <View style={styles.volumeContainer}>
          <Text style={styles.volumeValue}>
            {(workout.weight * workout.reps).toLocaleString()}
          </Text>
          <Text style={styles.volumeLabel}>VOLUME</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leftContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: "700",
    flexShrink: 1,
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  volumeContainer: {
    alignItems: "flex-end",
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 70,
  },
  volumeValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
  },
  volumeLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: -2,
  },
});

export default WorkoutCard;
