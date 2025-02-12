import React from 'react';
import {APIProvider, Map, MapCameraChangedEvent, AdvancedMarker, AdvancedMarkerProps} from '@vis.gl/react-google-maps';
interface GMapProps {
    apiKey: string;
}

const CENTER = { lat: 51.255943298339844, lng: 6.798919200897217 };

type Poi ={ key: string, location: google.maps.LatLngLiteral }

const locations: Poi[] = [
    {key: 'BadMatTon', location: { lat: 51.255941298339844, lng: 6.798933200897217 }},
];
const PoiMarkers = (props: {pois: Poi[]}) => {
    return (
      <>
        {props.pois.map( (poi: Poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            >
          </AdvancedMarker>
        ))}
      </>
    );
  };

const GMap: React.FC<GMapProps> = ({ apiKey }) => {
    return (
        <div className='map-container'>
            <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    mapId='BadMatTon'
                    defaultZoom={0}
                    defaultCenter={ CENTER }
                    onCameraChanged={ (ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }>
                    <PoiMarkers pois={locations} />
                </Map>
            </APIProvider>
        </div>
    );
};

export default GMap;