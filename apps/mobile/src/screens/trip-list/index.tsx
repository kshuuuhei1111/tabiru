import { View, Text, FlatList, TouchableOpacity } from "react-native";
import type { TripListScreenProps } from "../../navigation/types";
import { mockTrips } from "../../mocks/trips";
import type { Trip } from "@tabiru/shared";

export function TripListScreen({ navigation }: TripListScreenProps) {
  if (mockTrips.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400 text-base">旅行がまだありません</Text>
        <Text className="text-gray-400 text-sm mt-1">
          ＋ボタンで旅行を作成しましょう
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={mockTrips}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3"
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() =>
              navigation.navigate("TripDetail", { tripId: item.id })
            }
          />
        )}
      />
    </View>
  );
}

function TripCard({
  trip,
  onPress,
}: {
  trip: Trip;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className="text-lg font-bold text-gray-900">{trip.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">
        {trip.startDate} 〜 {trip.endDate}
      </Text>
      <Text className="text-xs text-gray-400 mt-2">
        {trip.members.length}人
      </Text>
    </TouchableOpacity>
  );
}
