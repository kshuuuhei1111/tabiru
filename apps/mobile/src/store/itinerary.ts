import { useReducer, useCallback } from "react";
import type { Trip, Day, Spot } from "@tabiru/shared";
import { mockTrips } from "../mocks/trips";

type Action =
  | { type: "ADD_DAY"; date: string }
  | { type: "DELETE_DAY"; dayId: string }
  | { type: "ADD_SPOT"; dayId: string; name: string }
  | { type: "UPDATE_SPOT"; dayId: string; spot: Spot }
  | { type: "DELETE_SPOT"; dayId: string; spotId: string }
  | { type: "REORDER_SPOTS"; dayId: string; spots: Spot[] };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function reducer(trip: Trip, action: Action): Trip {
  switch (action.type) {
    case "ADD_DAY": {
      const newDay: Day = { id: uid(), date: action.date, spots: [] };
      const days = [...trip.days, newDay].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      return { ...trip, days };
    }
    case "DELETE_DAY":
      return { ...trip, days: trip.days.filter((d) => d.id !== action.dayId) };

    case "ADD_SPOT": {
      const newSpot: Spot = {
        id: uid(),
        name: action.name,
        location: { lat: 0, lng: 0 },
        order: 0,
      };
      const days = trip.days.map((d) => {
        if (d.id !== action.dayId) return d;
        const spots = [...d.spots, { ...newSpot, order: d.spots.length }];
        return { ...d, spots };
      });
      return { ...trip, days };
    }
    case "UPDATE_SPOT": {
      const days = trip.days.map((d) => {
        if (d.id !== action.dayId) return d;
        return {
          ...d,
          spots: d.spots.map((s) =>
            s.id === action.spot.id ? action.spot : s
          ),
        };
      });
      return { ...trip, days };
    }
    case "DELETE_SPOT": {
      const days = trip.days.map((d) => {
        if (d.id !== action.dayId) return d;
        return {
          ...d,
          spots: d.spots
            .filter((s) => s.id !== action.spotId)
            .map((s, i) => ({ ...s, order: i })),
        };
      });
      return { ...trip, days };
    }
    case "REORDER_SPOTS": {
      const days = trip.days.map((d) => {
        if (d.id !== action.dayId) return d;
        return {
          ...d,
          spots: action.spots.map((s, i) => ({ ...s, order: i })),
        };
      });
      return { ...trip, days };
    }
    default:
      return trip;
  }
}

export function useItinerary(tripId: string) {
  const initial = mockTrips.find((t) => t.id === tripId) ?? mockTrips[0];
  const [trip, dispatch] = useReducer(reducer, initial);

  const addDay = useCallback(
    (date: string) => dispatch({ type: "ADD_DAY", date }),
    []
  );
  const deleteDay = useCallback(
    (dayId: string) => dispatch({ type: "DELETE_DAY", dayId }),
    []
  );
  const addSpot = useCallback(
    (dayId: string, name: string) => dispatch({ type: "ADD_SPOT", dayId, name }),
    []
  );
  const updateSpot = useCallback(
    (dayId: string, spot: Spot) => dispatch({ type: "UPDATE_SPOT", dayId, spot }),
    []
  );
  const deleteSpot = useCallback(
    (dayId: string, spotId: string) =>
      dispatch({ type: "DELETE_SPOT", dayId, spotId }),
    []
  );
  const reorderSpots = useCallback(
    (dayId: string, spots: Spot[]) =>
      dispatch({ type: "REORDER_SPOTS", dayId, spots }),
    []
  );

  return { trip, addDay, deleteDay, addSpot, updateSpot, deleteSpot, reorderSpots };
}
