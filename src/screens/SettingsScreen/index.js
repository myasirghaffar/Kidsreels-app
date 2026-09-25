import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSettings} from '../../context/SettingsContext';
import {useVideos} from '../../hooks/useVideos';
import {Icon} from '../../components/Icon';
import {colors, radii, shadows, spacing, typography} from '../../theme';

function SectionLabel({children}) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function SettingToggle({icon, iconColor, iconBg, label, hint, value, onValueChange, accessibilityLabel}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.iconBadge, {backgroundColor: iconBg}]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      <View style={styles.switchWrap}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{false: colors.border, true: colors.secondary}}
          thumbColor={colors.surface}
          accessibilityLabel={accessibilityLabel || label}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

function ActionTile({icon, label, color, bg, onPress, accessibilityLabel}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({pressed}) => [styles.actionTile, pressed && styles.actionPressed]}>
      <View style={[styles.actionIcon, {backgroundColor: bg}]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.actionLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {settings, setAutoplay, setMuteByDefault} = useSettings();
  const {videos, clearVideos, addFromPicker, importing} = useVideos();
  const favoritesCount = videos.filter(v => v.isFavorite).length;

  const confirmClear = () => {
    Alert.alert(
      'Remove all videos?',
      'This will remove videos from KidsReels only. Original files stay on your phone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove all',
          style: 'destructive',
          onPress: async () => {
            await clearVideos();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + 48,
        },
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Icon name="film" size={28} color={colors.primary} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Make KidsReels feel just right</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{videos.length}</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {settings.autoplay ? 'On' : 'Off'}
          </Text>
          <Text style={styles.statLabel}>Autoplay</Text>
        </View>
      </View>

      <SectionLabel>Quick actions</SectionLabel>
      <View style={styles.actionsRow}>
        <ActionTile
          icon="home"
          label="Home"
          color={colors.primary}
          bg={colors.accentSoft}
          onPress={() => navigation.navigate('Home')}
        />
        <ActionTile
          icon="heart"
          label="Favorites"
          color={colors.favorite}
          bg="#FFE4EA"
          onPress={() => navigation.navigate('Favorites')}
        />
        <ActionTile
          icon="add"
          label="Add"
          color={colors.textOnDark}
          bg={colors.primary}
          onPress={addFromPicker}
          accessibilityLabel="Add videos"
        />
        <ActionTile
          icon="library"
          label="Library"
          color={colors.secondaryDark}
          bg="#D8F5F2"
          onPress={() => navigation.navigate('Library')}
        />
        <ActionTile
          icon="trash"
          label="Clear"
          color={colors.danger}
          bg="#FFE8EE"
          onPress={confirmClear}
          accessibilityLabel="Clear all videos"
        />
      </View>

      <SectionLabel>Playback</SectionLabel>
      <View style={[styles.card, shadows.card]}>
        <SettingToggle
          icon="play"
          iconColor={colors.primary}
          iconBg={colors.accentSoft}
          label="Autoplay"
          hint="Play the next video automatically"
          value={settings.autoplay}
          onValueChange={setAutoplay}
          accessibilityLabel="Autoplay videos"
        />
        <View style={styles.divider} />
        <SettingToggle
          icon={settings.muteByDefault ? 'mute' : 'unmute'}
          iconColor={colors.secondaryDark}
          iconBg="#D8F5F2"
          label="Mute videos"
          hint="Start every video without sound"
          value={settings.muteByDefault}
          onValueChange={setMuteByDefault}
          accessibilityLabel="Mute videos"
        />
      </View>

      <SectionLabel>Library</SectionLabel>
      <View style={[styles.card, shadows.card]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Manage videos"
          onPress={() => navigation.navigate('Library')}
          style={({pressed}) => [styles.linkRow, pressed && styles.rowPressed]}>
          <View style={[styles.iconBadge, {backgroundColor: colors.surfaceSoft}]}>
            <Icon name="library" size={18} color={colors.primary} />
          </View>
          <View style={styles.settingCopy}>
            <Text style={styles.rowLabel}>Manage videos</Text>
            <Text style={styles.rowHint}>
              {videos.length === 0
                ? 'No videos yet — add some to start'
                : `${videos.length} video${videos.length === 1 ? '' : 's'} in your library`}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear all videos"
          onPress={confirmClear}
          disabled={videos.length === 0}
          style={({pressed}) => [
            styles.linkRow,
            pressed && styles.rowPressed,
            videos.length === 0 && styles.disabledRow,
          ]}>
          <View style={[styles.iconBadge, {backgroundColor: '#FFE8EE'}]}>
            <Icon name="trash" size={18} color={colors.danger} />
          </View>
          <View style={styles.settingCopy}>
            <Text style={[styles.rowLabel, styles.danger]}>Clear all videos</Text>
            <Text style={styles.rowHint}>Removes from app only, not your phone</Text>
          </View>
        </Pressable>
      </View>

      <SectionLabel>About</SectionLabel>
      <View style={[styles.aboutCard, shadows.card]}>
        <Text style={styles.aboutBrand}>KidsReels</Text>
        <Text style={styles.aboutBody}>
          A private, offline kids video player. Videos stay on your device. The
          app only stores references and thumbnails locally — never uploads,
          tracks, or syncs to the cloud.
        </Text>
        <View style={styles.aboutMeta}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.offlineChip}>100% offline</Text>
        </View>
      </View>

      {importing ? (
        <Text style={styles.importHint}>Adding videos…</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  title: {
    ...typography.brand,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.title,
    fontSize: 20,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: 6,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  actionPressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  settingRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  linkRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rowPressed: {
    opacity: 0.85,
  },
  disabledRow: {
    opacity: 0.45,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  switchWrap: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    alignSelf: 'center',
  },
  rowLabel: {
    ...typography.subtitle,
    color: colors.text,
  },
  rowHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
    marginTop: -2,
    alignSelf: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 52,
  },
  danger: {
    color: colors.danger,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  aboutBrand: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  aboutBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  aboutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
  },
  offlineChip: {
    ...typography.small,
    color: colors.secondaryDark,
    backgroundColor: '#D8F5F2',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    fontWeight: '700',
  },
  importHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
