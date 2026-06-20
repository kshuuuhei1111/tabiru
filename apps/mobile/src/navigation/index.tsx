import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, TripDetailTabParamList } from "./types";
import { TripListScreen } from "../screens/trip-list";
import { ItineraryScreen } from "../screens/itinerary";
import { RecordScreen } from "../screens/record";
import { MemoryScreen } from "../screens/memory";
import { mockTrips } from "../mocks/trips";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TripDetailTabParamList>();

function TripDetailTabs({ route }: { route: { params: { tripId: string } } }) {
  const { tripId } = route.params;
  const trip = mockTrips.find((t) => t.id === tripId);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        initialParams={{ tripId }}
        options={{ tabBarLabel: "旅程" }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        initialParams={{ tripId }}
        options={{ tabBarLabel: "記録" }}
      />
      <Tab.Screen
        name="Memory"
        component={MemoryScreen}
        initialParams={{ tripId }}
        options={{ tabBarLabel: "思い出" }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TripList"
          component={TripListScreen}
          options={{ title: "旅行一覧" }}
        />
        <Stack.Screen
          name="TripDetail"
          component={TripDetailTabs}
          options={({ route }) => {
            const trip = mockTrips.find((t) => t.id === route.params.tripId);
            return { title: trip?.title ?? "旅行詳細" };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
