import { React } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import icon from '../images/badmatton-icon.svg'

const CENTER = { lat: 51.255943298339844, lng: 6.798919200897217 };

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden'
};

// Custom icon configuration
const customIcon = {
    url: icon, // Replace with your icon URL
    scaledSize: new window.google.maps.Size(40, 40) // Adjust size as needed
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
                    <Marker
                        position={CENTER}
                        icon={customIcon}
                    />
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

Map.propTypes = {
    apiKey: PropTypes.string.isRequired
};

export default Map;