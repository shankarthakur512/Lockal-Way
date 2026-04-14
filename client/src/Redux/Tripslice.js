import { createSlice } from "@reduxjs/toolkit";
import { createLogger } from "../shared/lib/logger";

const tripsLogger = createLogger("trips-slice");

const initialState = {
  trips: [] 
};

const TripSlice = createSlice({
  name: "Trips",
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload.trips;
    },
    addTrip: (state, action) => {
    
      state.trips.push(action.payload.tripData);
    },
    updateTrip: (state, action) => {
      state.trips = state.trips.map((trip) =>
        (trip._id || trip.id) === (action.payload.trip._id || action.payload.trip.id)
          ? { ...trip, ...action.payload.trip }
          : trip
      );
    },
    removeTrip: (state, action) => {
      
      state.trips = state.trips.filter(
        (trip) => (trip._id || trip.id) !== action.payload.id
      );
    }
  }
});



const tripsArrayInitialState = {
  tripsArray: [], 
};

const TripsArraySlice = createSlice({
  name: "TripsArray",
  initialState: tripsArrayInitialState,
  reducers: {
    setTripsArray: (state, action) => {
      tripsLogger.debug("setTripsArray", action.payload.trips);
      state.tripsArray = action.payload.trips;
    },
    clearTripsArray: (state) => {
      state.tripsArray = [];
    },
  },
});

export const { setTrips, addTrip, updateTrip, removeTrip } = TripSlice.actions;
export const { setTripsArray, clearTripsArray } = TripsArraySlice.actions;

export const tripReducer = TripSlice.reducer;
export const tripsArrayReducer = TripsArraySlice.reducer;
