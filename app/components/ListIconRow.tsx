import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const ListIconRow = ({ label, value, icon: Icon }: any) => {
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon size={20} color={colors.tertiary} />
                <Text style={{ marginLeft: 12, color: colors.onSurfaceVariant }}>{label}</Text>
            </View>
            <Text style={{ fontWeight: '600', color: colors.onSurface }}>{value}</Text>
        </View>
    )
}