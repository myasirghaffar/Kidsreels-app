import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radii, spacing, typography} from '../../theme';
import {AddVideosButton} from '../AddVideosButton';
import {Icon} from '../Icon';

export function EmptyState({
  title = "Let's add some videos!",
  subtitle = "Choose videos from your phone and build your own kids' video library.",
  onAdd,
  loading,
  icon = 'film',
  primaryLabel = 'Add Videos',
  secondaryLabel,
  onSecondary,
}) {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.iconBadge}>
        <Icon name={icon} size={42} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onAdd ? (
        <AddVideosButton
          onPress={onAdd}
          loading={loading}
          label={primaryLabel}
        />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <Pressable
          onPress={onSecondary}
          style={styles.secondaryBtn}
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}>
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceMuted,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: radii.xl,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  secondaryBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  secondaryText: {
    ...typography.subtitle,
    color: colors.primary,
  },
});
