import { View, Text } from "react-native";
import type { MemoryScreenProps } from "../../navigation/types";
import { mockTrips } from "../../mocks/trips";

export function MemoryScreen({ route }: MemoryScreenProps) {
  const trip = mockTrips.find((t) => t.id === route.params.tripId);

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">旅行が見つかりません</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-gray-400 text-base">思い出はここに表示されます</Text>
      <Text className="text-gray-400 text-sm mt-1">{trip.title}</Text>
    </View>
  );
}
