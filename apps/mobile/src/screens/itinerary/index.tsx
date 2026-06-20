import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SpotDetailSheet } from "../../components/SpotDetailSheet";
import { useItinerary } from "../../store/itinerary";
import type { ItineraryScreenProps } from "../../navigation/types";
import type { Spot } from "@tabiru/shared";

export function ItineraryScreen({ route }: ItineraryScreenProps) {
  const { tripId } = route.params;
  const { trip, addDay, deleteDay, addSpot, updateSpot, deleteSpot, reorderSpots } =
    useItinerary(tripId);

  const [selectedSpot, setSelectedSpot] = useState<{ spot: Spot; dayId: string } | null>(null);
  const [addSpotModal, setAddSpotModal] = useState<{ dayId: string } | null>(null);
  const [newSpotName, setNewSpotName] = useState("");
  const [addDayModal, setAddDayModal] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date>(() => {
    const d = new Date(trip.startDate);
    return isNaN(d.getTime()) ? new Date() : d;
  });
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  const handleAddSpot = useCallback(() => {
    if (!addSpotModal || !newSpotName.trim()) return;
    addSpot(addSpotModal.dayId, newSpotName.trim());
    setNewSpotName("");
    setAddSpotModal(null);
  }, [addSpotModal, newSpotName, addSpot]);

  const handleDeleteDay = useCallback(
    (dayId: string, hasSpots: boolean) => {
      if (hasSpots) {
        Alert.alert("日を削除", "このDayのスポットもすべて削除されます。よろしいですか？", [
          { text: "キャンセル", style: "cancel" },
          { text: "削除", style: "destructive", onPress: () => deleteDay(dayId) },
        ]);
      } else {
        deleteDay(dayId);
      }
    },
    [deleteDay]
  );

  const handleAddDay = useCallback(() => {
    const dateStr = pickedDate.toISOString().slice(0, 10);
    if (dateStr < trip.startDate || dateStr > trip.endDate) {
      Alert.alert("日付エラー", `${trip.startDate} 〜 ${trip.endDate} の範囲で選んでください`);
      return;
    }
    if (trip.days.some((d) => d.date === dateStr)) {
      Alert.alert("日付エラー", "その日はすでに追加されています");
      return;
    }
    addDay(dateStr);
    setAddDayModal(false);
  }, [pickedDate, trip, addDay]);

  if (trip.days.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400 text-base">旅程がまだありません</Text>
        <Text className="text-gray-400 text-sm mt-1">日を追加して旅程を作りましょう</Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 rounded-full px-6 py-3"
          onPress={() => setAddDayModal(true)}
        >
          <Text className="text-white font-semibold">＋ 日を追加</Text>
        </TouchableOpacity>
        <AddDayModal
          visible={addDayModal}
          date={pickedDate}
          showPicker={showDatePicker}
          onChangeDate={(d) => { setPickedDate(d); if (Platform.OS === "android") setShowDatePicker(false); }}
          onShowPicker={() => setShowDatePicker(true)}
          onConfirm={handleAddDay}
          onCancel={() => setAddDayModal(false)}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="p-4 pb-24">
        {trip.days.map((day) => (
          <View key={day.id} className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-500">
                {formatDate(day.date)}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteDay(day.id, day.spots.length > 0)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-xs text-red-400">削除</Text>
              </TouchableOpacity>
            </View>

            <DraggableFlatList
              data={day.spots}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => reorderSpots(day.id, data)}
              scrollEnabled={false}
              renderItem={({ item, drag, isActive }: RenderItemParams<Spot>) => (
                <ScaleDecorator>
                  <TouchableOpacity
                    className={`bg-white rounded-xl p-3 mb-2 flex-row items-center gap-3 ${isActive ? "opacity-80 shadow-md" : ""}`}
                    onPress={() => setSelectedSpot({ spot: item, dayId: day.id })}
                    onLongPress={drag}
                    activeOpacity={0.7}
                  >
                    <View className="w-10 items-center">
                      {item.plan?.scheduledAt ? (
                        <Text className="text-xs text-blue-500 font-medium">
                          {item.plan.scheduledAt}
                        </Text>
                      ) : null}
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-900">{item.name}</Text>
                      {item.plan?.notes ? (
                        <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
                          {item.plan.notes}
                        </Text>
                      ) : null}
                    </View>
                    <Text className="text-gray-300 text-lg">⠿</Text>
                  </TouchableOpacity>
                </ScaleDecorator>
              )}
            />

            {day.spots.length === 0 && (
              <Text className="text-xs text-gray-400 text-center py-2">
                スポットを追加しましょう
              </Text>
            )}

            <TouchableOpacity
              className="border border-dashed border-gray-300 rounded-xl py-2.5 items-center mt-1"
              onPress={() => setAddSpotModal({ dayId: day.id })}
            >
              <Text className="text-sm text-gray-400">＋ スポットを追加</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          className="border border-dashed border-blue-300 rounded-xl py-3 items-center mt-2"
          onPress={() => setAddDayModal(true)}
        >
          <Text className="text-sm text-blue-400">＋ 日を追加</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!addSpotModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40 px-8">
          <View className="bg-white rounded-2xl p-5 w-full">
            <Text className="text-base font-bold text-gray-900 mb-3">スポットを追加</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-base mb-4"
              value={newSpotName}
              onChangeText={setNewSpotName}
              placeholder="スポット名を入力"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddSpot}
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-200 rounded-xl py-3 items-center"
                onPress={() => { setAddSpotModal(null); setNewSpotName(""); }}
              >
                <Text className="text-gray-500">キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl py-3 items-center"
                onPress={handleAddSpot}
              >
                <Text className="text-white font-semibold">追加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddDayModal
        visible={addDayModal}
        date={pickedDate}
        showPicker={showDatePicker}
        onChangeDate={(d) => { setPickedDate(d); if (Platform.OS === "android") setShowDatePicker(false); }}
        onShowPicker={() => setShowDatePicker(true)}
        onConfirm={handleAddDay}
        onCancel={() => setAddDayModal(false)}
      />

      <SpotDetailSheet
        spot={selectedSpot?.spot ?? null}
        onSave={(updated) => {
          if (selectedSpot) updateSpot(selectedSpot.dayId, updated);
        }}
        onDelete={(spotId) => {
          if (selectedSpot) deleteSpot(selectedSpot.dayId, spotId);
        }}
        onClose={() => setSelectedSpot(null)}
      />
    </View>
  );
}

function AddDayModal({
  visible,
  date,
  showPicker,
  onChangeDate,
  onShowPicker,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  date: Date;
  showPicker: boolean;
  onChangeDate: (d: Date) => void;
  onShowPicker: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-8">
        <View className="bg-white rounded-2xl p-5 w-full">
          <Text className="text-base font-bold text-gray-900 mb-3">日を追加</Text>
          {Platform.OS === "android" && !showPicker && (
            <TouchableOpacity
              className="border border-gray-200 rounded-xl px-3 py-2.5 mb-4"
              onPress={onShowPicker}
            >
              <Text className="text-base text-gray-700">
                {date.toISOString().slice(0, 10)}
              </Text>
            </TouchableOpacity>
          )}
          {showPicker && (
            <DateTimePicker
              mode="date"
              value={date}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, d) => d && onChangeDate(d)}
            />
          )}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              className="flex-1 border border-gray-200 rounded-xl py-3 items-center"
              onPress={onCancel}
            >
              <Text className="text-gray-500">キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-xl py-3 items-center"
              onPress={onConfirm}
            >
              <Text className="text-white font-semibold">追加</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}
