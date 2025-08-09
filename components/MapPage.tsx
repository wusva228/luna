import React, { useMemo } from 'react';
import type { User } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';


interface MapPageProps {
  users: User[];
  currentUser: User;
}

const UserMarkerIcon = ({ url }: { url: string }) => (
    <div className="relative w-12 h-12">
        <img src={url} className="w-full h-full object-cover rounded-full border-2 border-indigo-400 shadow-lg" />
    </div>
);

export const MapPage: React.FC<MapPageProps> = ({ users, currentUser }) => {

  const usersOnMap = useMemo(() => {
    return users.filter(u => u.id !== currentUser.id && u.shareLocation && u.location && u.photoUrls && u.photoUrls.length > 0);
  }, [users, currentUser]);

  const centerPosition: LatLngExpression = currentUser.location ? [currentUser.location.lat, currentUser.location.lon] : [55.751244, 37.618423]; // Default to Moscow

  return (
    <div className="h-full w-full">
      <MapContainer center={centerPosition} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%", backgroundColor: '#111827' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {usersOnMap.map(user => {
           // Ensure there's a photo to display
           if (!user.photoUrls || user.photoUrls.length === 0) return null;

           const iconMarkup = ReactDOMServer.renderToString(<UserMarkerIcon url={user.photoUrls[0]} />);
           const customIcon = divIcon({
                html: iconMarkup,
                className: 'leaflet-div-icon'
            });

            return (
              <Marker key={user.id} position={[user.location!.lat, user.location!.lon]} icon={customIcon}>
                <Popup>
                    <div className="text-center font-sans w-32">
                        <img src={user.photoUrls[0]} alt={user.name} className="w-24 h-24 object-cover rounded-lg mx-auto" />
                        <p className="font-bold mt-2 truncate">{user.name}, {user.age}</p>
                        <p className="text-xs text-gray-500 truncate">{user.bio.slice(0, 50)}...</p>
                        {user.username && (
                            <a href={`https://t.me/${user.username}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Написать</a>
                        )}
                    </div>
                </Popup>
              </Marker>
            )
        })}
      </MapContainer>
    </div>
  );
};
