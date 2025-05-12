import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ArticleCard, { ArticleData } from "../articleCard/ArticleCard";
import { COLORS, SIZES } from "../../constants/theme";

interface BigArticleListProps {
  articles: ArticleData[];
  scrollEnabled: boolean;
}

const BigArticleList: React.FC<BigArticleListProps> = ({
  articles,
  scrollEnabled,
}) => {
  const renderItem = ({ item }: { item: ArticleData }) => (
    <>
      <ArticleCard data={item} />
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={scrollEnabled}
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default BigArticleList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
  },
  button: {
    width: "47%",
    aspectRatio: 1,
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: SIZES.large,
  },
});
