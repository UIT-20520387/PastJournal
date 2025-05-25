import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import ItemWatchLater, { HistoryArticleData } from '../articleCard/HistoryArticleCard';

interface HistoryArticleListProps {
    articles: HistoryArticleData[];
}

const HistoryArticleList: React.FC<HistoryArticleListProps> = ({ articles: initialArticles }) => {
    const [articles, setArticles] = useState<HistoryArticleData[]>(initialArticles);

    const handleRemove = async (id: number) => {
        // Remove from the front end
        setArticles(articles.filter(article => article.history_id !== id));

        // Remove from the back end
        // console.log(id)
        let { data, error } = await supabase
            .rpc('delete_history_row', {
                history_id: id
            })
        if (error) console.error(error)
    };

    const renderItem = ({ item }: { item: HistoryArticleData }) => (
        <ItemWatchLater article={item} onRemove={handleRemove} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={articles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_article.toString()} // Sử dụng id_article thay vì id
            />
        </View>
    );
};

export default HistoryArticleList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
        backgroundColor: "white",
    },
});
