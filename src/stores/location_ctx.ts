import { create } from "zustand";

type Coordinates = {
  latitude: number;
  longitude: number;
};

interface LocationState {
  isHaveGeoLocation: boolean;
  isHaveGeoLocationAccess: boolean;
  isCanGetGeoLocation: boolean;
  coordinates: Coordinates;
  init: () => Promise<void>;
  getGeoLocation: () => Promise<boolean>;
}

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const useLocationStore = create<LocationState>((set, get) => {
  const _browserApiGetGeoLocationGetCurrentPosition = async (): Promise<Coordinates | GeolocationPositionError> =>
    new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          resolve(error);
        }
      );
    });

  const handlePermissionsQuery = async () => {
    const result = await navigator.permissions.query({ name: "geolocation" });

    switch (result.state) {
      case "granted":
        await get().getGeoLocation();
        break;
      case "denied":
        set({ isHaveGeoLocationAccess: false, isCanGetGeoLocation: false });
        break;
      case "prompt":
        // In Safari we cannot process the Permissions request and always get state = prompt, we can only get the permission code by navigator.geolocation.getCurrentPosition
        if (!isSafari) {
          set({ isHaveGeoLocationAccess: false, isCanGetGeoLocation: true });
        } else {
          await get().getGeoLocation();
        }
        break;
      default:
        await get().getGeoLocation();
        break;
    }
  };

  return {
    isHaveGeoLocation: Boolean(navigator.geolocation),
    isHaveGeoLocationAccess: false,
    isCanGetGeoLocation: false,
    coordinates: {
      latitude: 55.75,
      longitude: 37.57
    },
    init: async () => {
      if (!navigator.geolocation) return;
      set({ isHaveGeoLocation: true });
      await handlePermissionsQuery();
    },
    getGeoLocation: async () => {
      if (!get().isHaveGeoLocation || !get().isCanGetGeoLocation) return false;
      const result = await _browserApiGetGeoLocationGetCurrentPosition();
      if (result instanceof GeolocationPositionError) {
        switch (result.code) {
          case result.PERMISSION_DENIED:
            set({ isHaveGeoLocationAccess: false, isCanGetGeoLocation: false });
            break;
          default:
            set({ isHaveGeoLocationAccess: false });
            break;
        }
        return false;
      }
      set({ isHaveGeoLocationAccess: true, coordinates: result });
      return true;
    }
  };
});

export { useLocationStore };
