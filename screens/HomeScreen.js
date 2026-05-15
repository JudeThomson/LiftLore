import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../components/StatCard";
import WorkoutCard from "../components/WorkoutCard";
import XPBar from "../components/XPBar";
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "../constants/theme";
import {
  calculateLevel,
  calculateStreak,
  getRank,
  getUserProfile,
  getWorkouts,
  getXPProgress,
} from "../storage/storage";

const HomeScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "User", xp: 0 });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const workoutData = await getWorkouts();
    const profileData = await getUserProfile();

    setWorkouts(workoutData);
    if (profileData) {
      setUserProfile(profileData);
    }
  };

  const level = calculateLevel(userProfile.xp);
  const rank = getRank(userProfile.xp);
  const progress = getXPProgress(userProfile.xp);
  const xpInLevel = userProfile.xp % 100;
  const streak = calculateStreak(workouts);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userProfile.name}</Text>
          </View>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.textPrimary}
          />
        </View>

        {/* Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <View>
              <Text style={styles.rankTitle}>{rank}</Text>
              <Text style={styles.rankLevel}>Level {level}</Text>
            </View>
            <Ionicons name="trophy" size={32} color={COLORS.primary} />
          </View>
          <XPBar progress={progress} level={level} />
          <Text style={styles.xpText}>{xpInLevel} / 100 XP to next level</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Current Streak"
            value={`${streak} ${streak === 1 ? "Day" : "Days"}`}
            icon={<Ionicons name="flame" size={20} color="#FF9500" />}
            subtitle={streak > 0 ? "Keep it up!" : "Start your streak!"}
          />
          <StatCard
            title="Workouts"
            value={workouts.length.toString()}
            icon={<Ionicons name="fitness" size={20} color={COLORS.primary} />}
            subtitle="Total"
          />
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Ionicons
            //  change the name into quote if we need later
            name="chatbubble"
            size={20}
            color={COLORS.primary}
            style={styles.quoteIcon}
          />
          <Text style={styles.quoteText}>"Strength is forged daily."</Text>
        </View>

        {/* Recent Workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No workouts logged yet.</Text>
          </View>
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  greeting: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  rankCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  rankTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  rankLevel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  xpText: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.xs,
  },
  quoteCard: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  quoteIcon: {
    marginRight: SPACING.sm,
    opacity: 0.8,
  },
  quoteText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontStyle: "italic",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  seeAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyStateText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
