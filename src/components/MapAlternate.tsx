import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import mapboxgl from "mapbox-gl";
import { MAPBOX_STYLE } from "./style";

import Image1 from "../assets/images/scrolly-photos/1.jpg";
import Image2 from "../assets/images/scrolly-photos/2.jpg";
import Image3 from "../assets/images/scrolly-photos/3.jpg";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGhlLWNpdHkiLCJhIjoiY2xhMWVsNDY3MDJoYTNya2ptYWZpZW15dyJ9.iv4eTGq5GylMTUcYH16Big";

const locations = [
  { latitude: 32.5319, longitude: 44.2295, label: "Hindiyah", image: Image1 },
  { latitude: 31.9148, longitude: 44.4928, label: "Najaf", image: Image2 },
  { latitude: 30.9636, longitude: 46.6948, label: "Dhi Qar", image: Image3 },
];

const BOUNDING_BOX_SIZE = 0.003;
const UNIT_OF_TIME = 1000;
const FINAL_TEXT = `

روي: هل تحتوي القرية على بيوت أو مساحات... أو بلدية؟ * كلام غير مفهوم*
وليد: لا، لا، توجد على مسافة بعيدة. لا يوجد ذلك.
روي: هل تقصد قبل السد؟
وليد: نعم، كل هذا كان قبل السد.
روي: هل كان الماء هنا عميقًا قبل السد؟
وليد: لا.
روي: ماذا كان الوضع إذًا؟`;

const FINAL_TEXT_EN = `
Roi: Does the village have houses or spaces... or a municipality? *Unclear speech*
Waleed: No, no, it's a distant area. There is none.
Roi: Are you referring to before the dam?
Waleed: Yes, all of this was before the dam.
Roi: Was the water deep here before the dam?
Waleed: No.
Roi: What was the situation then?`;

export default function IraqMap() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showImage, setShowImage] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [typedTextEN, setTypedTextEN] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    const startAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, UNIT_OF_TIME));
      for (let i = 0; i < locations.length; i++) {
        setCurrentIndex(i);
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([
          locations[i].longitude - BOUNDING_BOX_SIZE,
          locations[i].latitude - BOUNDING_BOX_SIZE,
        ]);
        bounds.extend([
          locations[i].longitude + BOUNDING_BOX_SIZE,
          locations[i].latitude + BOUNDING_BOX_SIZE,
        ]);
        if (mapRef.current) {
          //@ts-ignore
          mapRef.current.fitBounds(bounds, {
            padding: 50,
            duration: 10 * UNIT_OF_TIME,
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 11 * UNIT_OF_TIME));
        setShowImage(true);
        await new Promise((resolve) => setTimeout(resolve, 6 * UNIT_OF_TIME));
        setShowImage(false);
        await new Promise((resolve) => setTimeout(resolve, 1 * UNIT_OF_TIME));
      }
      setShowCanvas(true);
      await new Promise((resolve) => setTimeout(resolve, UNIT_OF_TIME));
      for (
        let i = 0;
        i <= Math.max(FINAL_TEXT.length, FINAL_TEXT_EN.length);
        i++
      ) {
        setTypedText(FINAL_TEXT.substring(0, i));
        setTypedTextEN(FINAL_TEXT_EN.substring(0, i));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
    startAnimation();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <motion.div
        className="map-container"
        style={{
          position: "relative",
          width: showCanvas ? "50%" : "100%",
          height: "100vh",
          transition: "width 1s ease-in-out",
        }}
      >
        <Map
          initialViewState={{ latitude: 33.0, longitude: 44.0, zoom: 6 }}
          style={{ width: "100%", height: "100%" }}
          //@ts-ignore
          mapStyle={MAPBOX_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          //@ts-ignore
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
                boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)",
                border: "none",
              }}
              initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
              animate={{ opacity: 1, clipPath: "circle(100% at 50% 50%)" }}
              exit={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {showCanvas && (
        <motion.div
          className="canvas-container"
          style={{
            width: "50%",
            height: "100vh",
            textAlign: "right",
            backgroundColor: "#D7C0B0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div
            style={{
              height: "50%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
              alignItems: "flex-end",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                textAlign: "right",
                fontFamily: "monospace",
                fontWeight: "900",
              }}
            >
              جواد صياد السمك
            </p>
            <motion.p
              style={{
                width: "80%",
                fontSize: "1.2rem",
                textAlign: "right",
                fontFamily: "monospace",
                fontWeight: "400",
                whiteSpace: "pre-wrap",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {typedText}
            </motion.p>
          </div>
          <div
            style={{
              height: "50%",
              width: "100%",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                textAlign: "left",
                fontFamily: "monospace",
                fontWeight: "900",
              }}
            >
              Jawad fisherman
            </p>
            <motion.p
              style={{
                width: "80%",
                fontSize: "1.2rem",
                textAlign: "left",
                fontFamily: "monospace",
                fontWeight: "400",
                whiteSpace: "pre-wrap",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {typedTextEN}
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
