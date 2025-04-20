import { COLORS, FONT } from "../../constants/theme";
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        padding: 25,
        flex: 1,
        backgroundColor: COLORS.primary
    },
    imageContainer: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    card: {
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 20,
        marginTop: 20,
        borderColor: COLORS.gray,
        borderWidth: 1
    },
    oneRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    },
    fontSize: {
        fontSize: 18
    },
    formCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        backgroundColor: COLORS.darkRed,
        borderRadius: 20,
        width: 328,
        height: 56
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.gray,
        marginBottom: 10,
    },
    changeAvatar: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 3,
        borderRadius: 30,
    },
    changePassword: {
        color: COLORS.darkRed,
        fontFamily: FONT.bold,
        alignSelf: "center",
        marginTop: 20
    }
})

export default styles