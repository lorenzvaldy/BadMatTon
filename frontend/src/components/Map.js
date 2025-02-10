import {  React } from 'react';
import { GoogleMap, LoadScript} from '@react-google-maps/api';
import PropTypes from 'prop-types';

const CENTER = { lat: 51.255943298339844, lng: 6.798919200897217 };

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden'
};

const Map = ({ apiKey }) => {
    if (!apiKey) {
        return <div className="map-error">Google Maps API key is missing</div>;
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={CENTER}
                    zoom={19}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        mapId: '8f348cfe78e21a73'
                    }}
                >
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

Map.propTypes = {
    apiKey: PropTypes.string.isRequired
};

export default Map;
