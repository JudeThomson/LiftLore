import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../constants/theme";
import { useProfile } from "../context/ProfileContext";
import XPBar from "../components/XPBar";
import { 
  getUserProfile, 
  calculateLevel, 
  getRank, 
  getWorkouts, 
  calculateStreak,
  getXPProgress,
  saveUserProfile
} from "../storage/storage";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { setHasProfile } = useProfile();

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const profileData = await getUserProfile();
    const workoutData = await getWorkouts();
    setProfile(profileData);
    setWorkouts(workoutData);
    
    if (profileData) {
      setEditName(profileData.name || "");
      setEditBio(profileData.bio || "");
      setEditAge(profileData.age || "");
      setEditHeight(profileData.height || "");
      setEditWeight(profileData.weight || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    const updatedProfile = {
      ...profile,
      name: editName.trim(),
      bio: editBio.trim(),
      age: editAge.trim(),
      height: editHeight.trim(),
      weight: editWeight.trim(),
    };

    const success = await saveUserProfile(updatedProfile);
    if (success !== false) {
      setProfile(updatedProfile);
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully.");
    } else {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const handleResetApp = () => {
    Alert.alert(
      "DEV ONLY: Reset App Data",
      "This will clear ALL your workouts, XP, and profile. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset Everything", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            setHasProfile(false);
          }
        }
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  const level = calculateLevel(profile.xp || 0);
  const rank = getRank(profile.xp || 0);
  const streak = calculateStreak(workouts);
  const progress = getXPProgress(profile.xp || 0);
  const xpInLevel = profile.xp % 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header (Hero Section) */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Ionicons name="pencil" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
          
          <Text style={styles.bioDisplay}>{profile.bio || "No bio added"}</Text>

          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLevelLabel}>Level {level}</Text>
              <Text style={styles.xpValueLabel}>{xpInLevel} / 100 XP</Text>
            </View>
            <XPBar progress={progress} level={level} />
          </View>
        </View>

        {/* Physical Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Physical Stats</Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{profile.age || "--"}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
            <View style={styles.statsCard}>
              <Ionicons name="resize-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{profile.height || "--"}</Text>
              <Text style={styles.statLabel}>Height (cm)</Text>
            </View>
            <View style={styles.statsCard}>
              <Ionicons name="speedometer-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{profile.weight || "--"}</Text>
              <Text style={styles.statLabel}>Weight (kg)</Text>
            </View>
          </View>
        </View>

        {/* Progress Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsCard}>
              <Ionicons name="fitness-outline" size={20} color="#4CD964" />
              <Text style={styles.statValue}>{workouts.length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statsCard}>
              <Ionicons name="flame-outline" size={20} color="#FF9500" />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statsCard}>
              <Ionicons name="trophy-outline" size={20} color="#FFD700" />
              <Text style={styles.statValue}>{profile.xp || 0}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.settingsButtonText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* DEV ONLY RESET BUTTON */}
        <View style={styles.devSection}>
          <Text style={styles.devLabel}>Developer Tools (DEV ONLY)</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetApp}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error || "#FF3B30"} />
            <Text style={styles.resetButtonText}>Reset App Data</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your Name"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="Tell us about your fitness journey"
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editAge}
                    onChangeText={setEditAge}
                    placeholder="24"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginHorizontal: SPACING.xs }]}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editHeight}
                    onChangeText={setEditHeight}
                    placeholder="180"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editWeight}
                    onChangeText={setEditWeight}
                    placeholder="85"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconWrapper}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  rankBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  rankText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bioDisplay: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  xpSection: {
    width: "100%",
    paddingHorizontal: SPACING.lg,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  xpLevelLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  xpValueLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  editActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  devSection: {
    marginTop: SPACING.xxl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  devLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    textAlign: "center",
    fontWeight: "700",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error || "#FF3B30",
  },
  resetButtonText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.error || "#FF3B30",
    marginLeft: SPACING.sm,
    fontWeight: "700",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: "90%",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  settingsButtonText: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    fontWeight: "600",
  },
});

export default ProfileScreen;
