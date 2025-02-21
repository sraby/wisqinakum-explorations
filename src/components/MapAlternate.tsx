import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
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
    image:
      "https://adventure.com/wp-content/uploads/2019/03/Hero-Tourist-in-Baghdad-Al-Rashid-Street-in-the-old-city-of-Baghdad-Photo-credit-Leon-McCarron.jpg",
  },
  {
    latitude: 36.1919,
    longitude: 44.0096,
    label: "Erbil",
    image:
      "https://adventure.com/wp-content/uploads/2019/03/Hero-Tourist-in-Baghdad-Al-Rashid-Street-in-the-old-city-of-Baghdad-Photo-credit-Leon-McCarron.jpg",
  },
  {
    latitude: 30.5081,
    longitude: 47.7835,
    label: "Basra",
    image:
      "https://adventure.com/wp-content/uploads/2019/03/Hero-Tourist-in-Baghdad-Al-Rashid-Street-in-the-old-city-of-Baghdad-Photo-credit-Leon-McCarron.jpg",
  },
];

export default function IraqMap() {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [showImage, setShowImage] = useState<boolean>(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const startAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec before starting
      for (let i = 0; i < locations.length; i++) {
        setCurrentIndex(i);
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([
          locations[i].longitude - 0.01,
          locations[i].latitude - 0.01,
        ]);
        bounds.extend([
          locations[i].longitude + 0.01,
          locations[i].latitude + 0.01,
        ]);
        if (mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: 50, duration: 7000 });
        }
        await new Promise((resolve) => setTimeout(resolve, 8000)); // Wait 7 sec pan + 1 sec pause
        setShowImage(true);
        await new Promise((resolve) => setTimeout(resolve, 6000)); // Show image for 6 sec
        setShowImage(false);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec before next pan
      }
    };
    startAnimation();
  }, []);

  return (
    <div className="section">
      <div
        className="box"
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <Map
          initialViewState={{ latitude: 33.0, longitude: 44.0, zoom: 6 }}
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
              anchor="center"
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                }}
              />
            </Marker>
          )}
        </Map>

        <AnimatePresence>
          {showImage && currentIndex >= 0 && (
            <motion.img
              key={locations[currentIndex].image}
              src={locations[currentIndex].image}
              alt={locations[currentIndex].label}
              className="image"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                border: "none",
              }}
              initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
              animate={{ opacity: 1, clipPath: "circle(100% at 50% 50%)" }}
              exit={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>

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
            onClick={() => window.location.reload()} // Restart the full sequence
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
