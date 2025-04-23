import * as React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { FONT, SIZES, COLORS } from "../../constants/index";
import { useRouter } from "expo-router";
import { Swipeable } from 'react-native-gesture-handler';

export interface HistoryArticleData {
  history_id: number;
  id_article: number;
  name: string;
  category_name: string;
  publish_time: string;
  image_url: string;
  description: string;
  day_of_reading?: string;
}

const ItemWatchLater = ({ article, onRemove }: { article: HistoryArticleData, onRemove: (id_article: number) => void }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/article/" + article.id_article);
  };

  const formatDate = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateTime.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    } else {
      return `${dateTime.getDate()}-${dateTime.getMonth() + 1}-${dateTime.getFullYear()}`;
    }
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        Alert.alert(
          "Remove Article",
          "Are you sure you want to remove this article from your history?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Remove", onPress: () => onRemove(article.history_id) }
          ]
        );
      }}
    >
      <Text style={styles.deleteButtonText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.itemWatchLaterLayout}>
          <Image
            style={styles.itemWatchLaterChild}
            resizeMode="cover"
            source={{ uri: article.image_url }}
          />
          <View style={styles.titleParent}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {article.name}
            </Text>
            {article.day_of_reading && (
              <Text style={styles.tagNTime} numberOfLines={1} ellipsizeMode="tail">
                Lần đọc cuối: {formatDate(article.day_of_reading)}
              </Text>
            )}
            <Text style={styles.tagNTime} numberOfLines={1}>
              {article.category_name} - Xuất bản: {formatDate(article.publish_time)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};


const styles = StyleSheet.create({
  itemWatchLaterLayout: {
    height: 100,
    flexDirection: "row",
    padding: 10,
    marginTop: 12,
    backgroundColor: 'white',
  },
  itemWatchLaterChild: {
    borderRadius: 5,
    width: '30%',
    height: '100%',
  },
  title: {
    fontFamily: FONT.heading,
    fontSize: SIZES.medium18,
    color: COLORS.textColor1,
    width: '100%',
  },
  tagNTime: {
    fontSize: SIZES.small,
    color: COLORS.textColor3,
    fontFamily: FONT.tag,
    marginTop: "auto",
  },
  titleParent: {
    marginLeft: 10,
    width: '67%',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: COLORS.darkRed,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    margin: 10,
    borderRadius: 15
  },
  deleteButtonText: {
    color: 'white',
    fontSize: SIZES.medium,
  },
});

export default ItemWatchLater;
