import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import { MAPBOX_STYLE } from "./style";

type Location = {
  latitude: number;
  longitude: number;
  label: string;
  image: string;
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGhlLWNpdHkiLCJhIjoiY2xhMWVsNDY3MDJoYTNya2ptYWZpZW15dyJ9.iv4eTGq5GylMTUcYH16Big";

const locations: Location[] = [
  {
    latitude: 33.3152,
    longitude: 44.3661,
    label: "Baghdad",
    image: "https://via.placeholder.com/200",
  },
  {
    latitude: 36.1919,
    longitude: 44.0096,
    label: "Erbil",
    image: "https://via.placeholder.com/200",
  },
  {
    latitude: 30.5081,
    longitude: 47.7835,
    label: "Basra",
    image: "https://via.placeholder.com/200",
  },
];

export default function IraqMap() {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [showImage, setShowImage] = useState<boolean>(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowImage(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % locations.length;
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([
            locations[newIndex].longitude - 0.1,
            locations[newIndex].latitude - 0.1,
          ]);
          bounds.extend([
            locations[newIndex].longitude + 0.1,
            locations[newIndex].latitude + 0.1,
          ]);

          if (mapRef.current) {
            mapRef.current.fitBounds(bounds, { padding: 50, duration: 7000 });
          }

          return newIndex;
        });
      }, 1000);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex >= 0) {
      setTimeout(() => setShowImage(true), 2000);
    }
  }, [currentIndex]);

  return (
    <div className="section">
      <div
        className="box"
        style={{ position: "relative", width: "100%", height: "100vh" }}
      >
        <Map
          initialViewState={{ latitude: 33.0, longitude: 44.0, zoom: 5 }}
          style={{ width: "100%", height: "100%" }}
          //@ts-ignore
          mapStyle={MAPBOX_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={(evt) => (mapRef.current = evt.target)}
        >
          {currentIndex >= 0 && (
            <Marker
              latitude={locations[currentIndex].latitude}
              longitude={locations[currentIndex].longitude}
              anchor="bottom"
            >
              📍
            </Marker>
          )}
        </Map>

        {showImage && currentIndex >= 0 && (
          <motion.img
            src={locations[currentIndex].image}
            alt={locations[currentIndex].label}
            className="image is-128x128 box"
            style={{ position: "absolute", top: "2rem", left: "2rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}

        <div
          className="buttons is-centered"
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <button
            className="button is-primary"
            onClick={() => setCurrentIndex(-1)}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
