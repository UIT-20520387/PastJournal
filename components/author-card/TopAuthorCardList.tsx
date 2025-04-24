import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ItemFollowingAuthor, { AuthorData } from './AuthorCard';
import { COLORS, FONT, SIZES } from '../../constants';

interface TopAuthorCardListData {
    authors: AuthorData[];
}

const TopAuthorCardList: React.FC<TopAuthorCardListData> = ({ authors }) => {
    const renderItem = ({ item }: { item: AuthorData }) => (
       <View style={styles.ListContainer}>
           <ItemFollowingAuthor author={item} />
           <Text style={styles.number}>{item.views}</Text>
       </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={authors}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
        // paddingRight: 5,
        marginHorizontal: 5,
        backgroundColor: "white"
    },
    ListContainer: {
        display: 'flex',
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
    },
    number:{
        color: "#c8355d",
        fontFamily: FONT.tag,
        fontSize: SIZES.large,
        alignItems:'center',
        textAlign:'center',
        marginRight: 15,
    }
});

export default TopAuthorCardList;
