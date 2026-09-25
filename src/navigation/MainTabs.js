import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeScreen} from '../screens/HomeScreen';
import {FavoritesScreen} from '../screens/FavoritesScreen';
import {LibraryScreen} from '../screens/LibraryScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {useVideos} from '../hooks/useVideos';
import {Icon} from '../components/Icon';
import {colors, shadows, typography} from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({name, focused, label}) {
  return (
    <View style={styles.tabItem}>
      <Icon
        name={name}
        size={22}
        color={focused ? colors.primary : colors.tabInactive}
      />
      <Text
        style={[
          styles.tabLabel,
          {color: focused ? colors.primary : colors.tabInactive},
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function HomeTabIcon({focused}) {
  return <TabIcon name="home" focused={focused} label="Home" />;
}

function FavoritesTabIcon({focused}) {
  return (
    <TabIcon
      name={focused ? 'heart' : 'heartOutline'}
      focused={focused}
      label="Favorites"
    />
  );
}

function LibraryTabIcon({focused}) {
  return <TabIcon name="library" focused={focused} label="Library" />;
}

function SettingsTabIcon({focused}) {
  return <TabIcon name="settings" focused={focused} label="Settings" />;
}

function AddTabButton({onPress}) {
  return (
    <View style={styles.addSlot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Add videos"
        style={({pressed}) => [styles.addButton, pressed && styles.addPressed]}>
        <Text style={styles.addLabel}>+</Text>
      </Pressable>
    </View>
  );
}

function AddPlaceholder() {
  return <View />;
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const {addFromPicker} = useVideos();
  const bottomPad = Math.max(insets.bottom, 10);

  const onAddTabPress = useCallback(
    e => {
      e.preventDefault();
      addFromPicker();
    },
    [addFromPicker],
  );

  const renderAddButton = useCallback(
    props => <AddTabButton onPress={props.onPress} />,
    [],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 68 + bottomPad,
            paddingBottom: bottomPad,
            paddingTop: 8,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeTabIcon,
          tabBarAccessibilityLabel: 'Home feed',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: FavoritesTabIcon,
          tabBarAccessibilityLabel: 'Favorite videos',
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddPlaceholder}
        listeners={{tabPress: onAddTabPress}}
        options={{
          tabBarButton: renderAddButton,
          tabBarAccessibilityLabel: 'Add videos',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: LibraryTabIcon,
          tabBarAccessibilityLabel: 'Video library',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: SettingsTabIcon,
          tabBarAccessibilityLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.soft,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 56,
  },
  tabLabel: {
    ...typography.small,
    fontSize: 10,
  },
  addSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  addButton: {
    top: -16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  addPressed: {
    transform: [{scale: 0.96}],
  },
  addLabel: {
    color: colors.textOnDark,
    fontSize: 32,
    fontWeight: '600',
    marginTop: -2,
  },
});
