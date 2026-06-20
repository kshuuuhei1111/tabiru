import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { Spot } from "@tabiru/shared";

interface Props {
  spot: Spot | null;
  onSave: (spot: Spot) => void;
  onDelete: (spotId: string) => void;
  onClose: () => void;
}

export function SpotDetailSheet({ spot, onSave, onDelete, onClose }: Props) {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);

  const [name, setName] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");
  const [nameError, setNameError] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (spot) {
      setName(spot.name);
      setScheduledAt(spot.plan?.scheduledAt);
      setNotes(spot.plan?.notes ?? "");
      setUrl(spot.plan?.url ?? "");
      setNameError(false);
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [spot]);

  const handleSave = useCallback(() => {
    if (!spot) return;
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onSave({
      ...spot,
      name: name.trim(),
      plan: {
        scheduledAt: scheduledAt || undefined,
        notes: notes.trim() || undefined,
        url: url.trim() || undefined,
      },
    });
    onClose();
  }, [spot, name, scheduledAt, notes, url, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (!spot) return;
    Alert.alert("スポットを削除", `「${spot.name}」を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          onDelete(spot.id);
          onClose();
        },
      },
    ]);
  }, [spot, onDelete, onClose]);

  const timeDate = useMemo(() => {
    if (!scheduledAt) return new Date();
    const [h, m] = scheduledAt.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }, [scheduledAt]);

  const renderBackdrop = useCallback(
    (props: Parameters<typeof BottomSheetBackdrop>[0]) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} onPress={onClose} />
    ),
    [onClose]
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1 px-5 pt-2 pb-8">
        <Text className="text-lg font-bold text-gray-900 mb-4">スポット詳細</Text>

        <Text className="text-xs font-medium text-gray-500 mb-1">スポット名 *</Text>
        <TextInput
          className={`border rounded-xl px-3 py-2.5 text-base mb-1 ${nameError ? "border-red-400" : "border-gray-200"}`}
          value={name}
          onChangeText={(v) => { setName(v); setNameError(false); }}
          placeholder="例：金閣寺"
          returnKeyType="done"
        />
        {nameError && (
          <Text className="text-xs text-red-500 mb-2">スポット名を入力してください</Text>
        )}

        <Text className="text-xs font-medium text-gray-500 mb-1 mt-3">予定時刻</Text>
        <TouchableOpacity
          className="border border-gray-200 rounded-xl px-3 py-2.5 mb-1"
          onPress={() => setShowTimePicker(true)}
        >
          <Text className={scheduledAt ? "text-base text-gray-900" : "text-base text-gray-400"}>
            {scheduledAt ?? "時刻を選択（任意）"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={timeDate}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, date) => {
              setShowTimePicker(Platform.OS === "ios");
              if (date) {
                const h = String(date.getHours()).padStart(2, "0");
                const m = String(date.getMinutes()).padStart(2, "0");
                setScheduledAt(`${h}:${m}`);
              }
            }}
          />
        )}

        <Text className="text-xs font-medium text-gray-500 mb-1 mt-3">メモ</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-base mb-1 h-20"
          value={notes}
          onChangeText={setNotes}
          placeholder="メモを入力（任意）"
          multiline
          textAlignVertical="top"
        />

        <Text className="text-xs font-medium text-gray-500 mb-1 mt-3">URL</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-base mb-1"
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          keyboardType="url"
          autoCapitalize="none"
          returnKeyType="done"
        />

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="flex-1 bg-red-50 rounded-xl py-3 items-center"
            onPress={handleDelete}
          >
            <Text className="text-red-500 font-medium">削除</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-2 flex-grow-[2] bg-blue-500 rounded-xl py-3 items-center"
            onPress={handleSave}
          >
            <Text className="text-white font-semibold">保存</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
