import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FONT, SIZES, COLORS } from "../../constants/index";
import { useRouter } from "expo-router";
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export interface AuthorData {
    id: number;
    author_id: number;
    name: string;
    username: string;
    avatar_url: string;
    join_date: string;
    number_of_followers?: number; // Số lượng followers (tùy chọn)
    number_of_articles?: number; // Số lượng bài viết (tùy chọn)
    views?: number;
}

interface ItemFollowingAuthorProps {
    author: AuthorData;
    onRemove?: (id: number) => void; // Hàm xử lý khi xóa (tùy chọn)
}

const ItemFollowingAuthor: React.FC<ItemFollowingAuthorProps> = ({ author, onRemove }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push("/author/" + author.author_id);
    };

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove(author.id);
        }
    };

    const renderRightActions = () => (
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Ionicons name="trash-bin" size={24} color="white" />
        </TouchableOpacity>
    );

    return (
        <Swipeable containerStyle={{ flex: 1 }} renderRightActions={onRemove ? renderRightActions : undefined}>
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.itemFollowingAuthorLayout}>
                    <Image
                        style={styles.avatar}
                        resizeMode="cover"
                        source={{ uri: author.avatar_url }}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {author.name}
                        </Text>
                        <Text style={styles.username}>
                            @{author.username}
                        </Text>
                        <Text style={styles.joinDate}>
                            Joined on {formatJoinDate(author.join_date)}
                        </Text>
                        {(author.number_of_followers !== undefined && author.number_of_articles !== undefined) && (
                            <Text style={styles.additionalInfo}>
                                {author.number_of_followers} followers, {author.number_of_articles} articles
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    itemFollowingAuthorLayout: {
        height: 100,
        flex: 1,
        flexDirection: "row",
        paddingBottom: 10,
        paddingHorizontal: 15,
        marginTop: 12,
    },
    avatar: {
        borderRadius: 50,
        width: 90,
        height: 90,
    },
    infoContainer: {
        marginLeft: 10,
        justifyContent: "center",
    },
    name: {
        fontFamily: FONT.heading,
        fontSize: SIZES.medium18,
        color: COLORS.textColor1,
        width: 250,
    },
    username: {
        fontSize: SIZES.small,
        color: COLORS.textColor3,
        fontFamily: FONT.tag,
    },
    joinDate: {
        fontSize: SIZES.small,
        color: COLORS.textColor3,
        fontFamily: FONT.tag,
    },
    additionalInfo: {
        fontSize: SIZES.small,
        color: COLORS.textColor3,
        fontFamily: FONT.tag,
        // marginTop: 5,
    },
    removeButton: {
        backgroundColor: COLORS.darkRed,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '95%',
        borderRadius: 15
    },
});

export default ItemFollowingAuthor;
