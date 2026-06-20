import { View, Text, SectionList } from "react-native";
import type { ItineraryScreenProps } from "../../navigation/types";
import { mockTrips } from "../../mocks/trips";
import type { Spot } from "@tabiru/shared";

export function ItineraryScreen({ route }: ItineraryScreenProps) {
  const trip = mockTrips.find((t) => t.id === route.params.tripId);

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">旅行が見つかりません</Text>
      </View>
    );
  }

  const sections = trip.days.map((day) => ({
    title: day.date,
    data: day.spots,
  }));

  if (sections.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400 text-base">旅程がまだありません</Text>
        <Text className="text-gray-400 text-sm mt-1">
          スポットを追加して旅程を作りましょう
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        renderSectionHeader={({ section }) => (
          <Text className="text-sm font-semibold text-gray-500 mb-2 mt-4">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => <SpotRow spot={item} />}
      />
    </View>
  );
}

function SpotRow({ spot }: { spot: Spot }) {
  return (
    <View className="bg-white rounded-xl p-3 mb-2 flex-row items-center gap-3">
      <View className="w-10 items-center">
        {spot.plan?.scheduledAt ? (
          <Text className="text-xs text-blue-500 font-medium">
            {spot.plan.scheduledAt}
          </Text>
        ) : null}
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{spot.name}</Text>
        {spot.category ? (
          <Text className="text-xs text-gray-400 mt-0.5">{spot.category}</Text>
        ) : null}
        {spot.plan?.notes ? (
          <Text className="text-xs text-gray-500 mt-1">{spot.plan.notes}</Text>
        ) : null}
      </View>
    </View>
  );
}
