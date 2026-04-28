const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

export function calculateQiblaBearing(params: { latitude: number; longitude: number }): number {
  const lat1 = toRadians(params.latitude);
  const lat2 = toRadians(KAABA_LATITUDE);
  const deltaLongitude = toRadians(KAABA_LONGITUDE - params.longitude);
  const y = Math.sin(deltaLongitude);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLongitude);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}
