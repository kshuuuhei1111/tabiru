import { View, Text } from "react-native";
import type { RecordScreenProps } from "../../navigation/types";
import { mockTrips } from "../../mocks/trips";

export function RecordScreen({ route }: RecordScreenProps) {
  const trip = mockTrips.find((t) => t.id === route.params.tripId);

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">旅行が見つかりません</Text>
      </View>
    );
  }

  const allSpots = trip.days.flatMap((day) => day.spots);
  const recordedSpots = allSpots.filter(
    (s) => s.record && (s.record.photos.length > 0 || s.record.memo)
  );

  if (recordedSpots.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400 text-base">記録がまだありません</Text>
        <Text className="text-gray-400 text-sm mt-1">
          写真やメモを追加しましょう
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-gray-500 text-sm">
        {recordedSpots.length}件の記録
      </Text>
    </View>
  );
}
