import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  TripList: undefined;
  TripDetail: { tripId: string };
};

export type TripDetailTabParamList = {
  Itinerary: { tripId: string };
  Record: { tripId: string };
  Memory: { tripId: string };
};

export type TripListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TripList"
>;

export type TripDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TripDetail"
>;

export type ItineraryScreenProps = BottomTabScreenProps<
  TripDetailTabParamList,
  "Itinerary"
>;

export type RecordScreenProps = BottomTabScreenProps<
  TripDetailTabParamList,
  "Record"
>;

export type MemoryScreenProps = BottomTabScreenProps<
  TripDetailTabParamList,
  "Memory"
>;
