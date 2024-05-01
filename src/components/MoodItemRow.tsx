import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import { format } from 'date-fns/format';
import { MoodOptionWithTimestamp } from '../types';
import { theme } from '../theme';
import { useAppContext } from '../App.provider';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type MoodItemRowProps = {
  item: MoodOptionWithTimestamp;
};

const maxPan = 100;

export const MoodItemRow: React.FC<MoodItemRowProps> = ({ item }) => {
  const appContext = useAppContext();
  const pressed = useSharedValue(false);
  const shouldRemove = useSharedValue(false);
  const position = useSharedValue(0);

  const handlePress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    appContext.handleDeleteMood(item);
  }, [appContext, item]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const removeWithDelay = React.useCallback(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      appContext.handleDeleteMood(item);
    }, 250);
  }, [appContext, item]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange(event => {
      const xVal = Math.floor(event.translationX);
      position.value = xVal;

      if (Math.abs(xVal) <= maxPan) {
        shouldRemove.value = false;
      } else {
        shouldRemove.value = true;
      }
    })
    .onEnd(_ => {
      if (shouldRemove.value) {
        // if the item should be removed, animate it off the screen first
        position.value = withTiming(Math.sign(position.value) * 2000);

        // then trigger the remove mood item with a small delay
        runOnJS(removeWithDelay)();
      } else {
        // otherwise, animate the item back to the start
        position.value = withTiming(0);
      }
    });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <Reanimated.View style={[styles.moodItem, animatedStyle]}>
          <View style={styles.iconAndDescription}>
            <Text style={styles.moodValue}>{item.mood.emoji}</Text>
            <Text style={styles.moodDescription}>{item.mood.description}</Text>
          </View>
          <Text style={styles.moodDate}>
            {format(new Date(item.timestamp), "dd MMM, yyyy 'at' h:mmaaa")}
          </Text>
          <Pressable hitSlop={16} onPress={handlePress}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </Reanimated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  moodValue: {
    textAlign: 'center',
    fontSize: 40,
    marginRight: 10,
  },
  moodDate: {
    textAlign: 'center',
    color: theme.colorLavender,
    fontFamily: theme.fontFamilyRegular,
  },
  moodItem: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodDescription: {
    fontSize: 18,
    color: theme.colorPurple,
    fontFamily: theme.fontFamilyBold,
  },
  iconAndDescription: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    fontFamily: theme.fontFamilyBold,
    color: theme.colorBlue,
  },
});
