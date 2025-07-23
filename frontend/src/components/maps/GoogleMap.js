import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 35.3753, // Default to Pakistan
  lng: 75.1755
};

const MapComponent = ({ center = defaultCenter, zoom = 8, markers = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
          icon={marker.icon}
        />
      ))}
    </GoogleMap>
  ) : <div className="h-96 bg-gray-200 flex items-center justify-center">Loading Map...</div>;
};

export default React.memo(MapComponent);
