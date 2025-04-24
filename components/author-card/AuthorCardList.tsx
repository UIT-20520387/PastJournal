import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ItemFollowingAuthor, { AuthorData } from '../author-card/AuthorCard';
import { COLORS, SIZES } from '../../constants/theme';
import { supabase } from '../../lib/supabase';

interface AuthorCardListData {
    authors: AuthorData[];
}

const AuthorCardList: React.FC<AuthorCardListData> = ({ authors }) => {
    const [authorList, setAuthorList] = useState(authors);

    const removeAuthor = async (id: number) => {
        try {
            // Remove from backend
            let { data, error } = await supabase
                .rpc('delete_following', {
                    _id: id
                })
            if (error) console.error(error)

            // Remove from frontend
            setAuthorList(prevAuthors => prevAuthors.filter(author => author.id !== id));
        } catch (error) {
            console.error('Failed to remove author:', error);
        }
    };

    const renderItem = ({ item }: { item: AuthorData }) => (
        <>
            <ItemFollowingAuthor author={item} onRemove={removeAuthor} />
        </>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={authorList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default AuthorCardList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        paddingVertical: 5,
        paddingRight: 5,
        backgroundColor: "white"
    },
    button: {
        width: '47%',
        aspectRatio: 1,
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
    },
    imageContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: SIZES.large
    }
});
