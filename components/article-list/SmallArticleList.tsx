import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ItemWatchLater, { ArticleData } from '../articleCard/SmallArticleCard';
// import { COLORS, SIZES } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

interface SmallArticleListProps {
    articles: ArticleData[];
}

const SmallArticleList: React.FC<SmallArticleListProps> = ({ articles: initialArticles }) => {
    const [articles, setArticles] = useState<ArticleData[]>(initialArticles);

    const handleRemove = async (id: number) => {
        // Remove from the front end
        setArticles(articles.filter(article => article.id !== id));

        // Remove from the back end
        let { data, error } = await supabase
            .rpc('delete_bookmark', {
                _id: id
            })
        if (error) console.error(error)
    };

    const renderItem = ({ item }: { item: ArticleData }) => (
        <>
            <ItemWatchLater article={item} onRemove={handleRemove} />
            {/* <View style={styles.separator} /> */}
        </>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={articles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default SmallArticleList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        backgroundColor: "white",
    },
});
