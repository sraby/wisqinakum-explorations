import React, { createRef, useEffect, useRef, useState } from "react";
import { Layer, Map, MapRef, Source } from "react-map-gl";
import maplibregl from "maplibre-gl";
import {
  isMapboxURL,
  transformMapboxUrl,
} from "maplibregl-mapbox-request-transformer";
import "intersection-observer";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/app.scss";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Paragraph, splitParagraphs } from "src/pages/Homepage";
import { MAPBOX_STYLE } from "./style";

/**
 * This is a public access token connected to THE CITY's MapBox account:
 */
export const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGhlLWNpdHkiLCJhIjoiY2xhMWVsNDY3MDJoYTNya2ptYWZpZW15dyJ9.iv4eTGq5GylMTUcYH16Big";
/**
 * Since our custom style does not include links for map sprites, let's specify a fallback map style to load in:
 */
const FALLBACK_STYLE_URL_ROOT =
  "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite@2x";

export const transformStyleRequest = (url: string, resourceType: string) => {
  if (resourceType === "SpriteImage") {
    return {
      url: `${FALLBACK_STYLE_URL_ROOT}.png`,
    };
  }
  if (resourceType === "SpriteJSON") {
    return {
      url: `${FALLBACK_STYLE_URL_ROOT}.json`,
    };
  }
  if (isMapboxURL(url)) {
    return transformMapboxUrl(url, resourceType, MAPBOX_TOKEN);
  }
  return { url };
};

export const MapLoadingScreen = () => (
  <div className="loading-screen map">
    <div>
      <p className="mb-2">Loading...</p>
      <progress className="progress is-medium" max="100" />
    </div>
  </div>
);

const NUMBER_OF_MAP_SLIDES = 5;
/**
 * When each paragraph gets within this distance (in px) of the top of the viewport, animations are triggered.
 */
const ANIMATION_TRIGGER_BUFFER = 500;

/**
 * Total length of time map animations take, in milliseconds.
 */
const ANIMATION_DURATION = 1000;

/**
 * A "blank" set of x and y scroll coordinates to initialize our react states with.
 * The values here are meaningless, just making sure the y coordinate is larger than our trigger buffer.
 */
const BLANK_SCROLL_POSITION = {
  x: 0,
  y: ANIMATION_TRIGGER_BUFFER + 100,
};

export const MapSequence: React.FC<{
  slideContent: string;
}> = ({ slideContent }) => {
  const slideElements = splitParagraphs(slideContent);

  // Map data that goes on the map:

  const [boundaryData, setBoundaryData] = useState(null);
  const [oilSpillData, setOilSpillData] = useState(null);
  const [responsiblePartiesData, setResponsiblePartiesData] = useState(null);
  const [homesBusinessesData, setHomesBusinessesData] = useState(null);

  /**
   * The number of the current slide the user is looking at, starting with 0:
   */
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * The scroll positions of each of the paragraphs overlayed on the map:
   */
  const [paragraphPosition, setParagraphPosition] = useState({
    0: BLANK_SCROLL_POSITION,
    1: BLANK_SCROLL_POSITION,
    2: BLANK_SCROLL_POSITION,
    3: BLANK_SCROLL_POSITION,
    4: BLANK_SCROLL_POSITION,
  });

  /**
   * Add data to map on initial mount of the react component:
   */
  useEffect(() => {
    fetch("./data/meeker_plume_superfund.geojson", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        setBoundaryData(json);
        console.log("Loaded boundary data");
      })
      .catch((err) => console.error("Could not load boundary data", err));
    fetch("./data/greenpoint_oil_spill.geojson", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        setOilSpillData(json);
        console.log("Loaded oil spill data");
      })
      .catch((err) => console.error("Could not load oil spill data", err));
    fetch("./data/responsible_parties.geojson", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        setResponsiblePartiesData(json);
        console.log("Loaded responsible parties data");
      })
      .catch((err) =>
        console.error("Could not load responsible parties data", err)
      );
    fetch("./data/meeker_plume_units.geojson", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        setHomesBusinessesData(json);
        console.log("Loaded homes and businesses data");
      })
      .catch((err) =>
        console.error("Could not load homes and businesses data", err)
      );
  }, []);

  const mapRef = useRef<MapRef>();
  const paragraphRefs = useRef([
    createRef(),
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ]);

  /**
   * This custom React hook keeps track of a specific paragraph in our scrolly
   * and continuously updates its scroll position saved in state.
   */
  const useParagraphTracker = (paragraphNumber: number) =>
    useScrollPosition(
      ({ currPos }) => {
        setParagraphPosition((prevValues) => ({
          ...prevValues,
          [paragraphNumber]: currPos,
        }));
      },
      [],
      //@ts-ignore
      paragraphRefs.current[paragraphNumber]
    );

  // Sadly, the `useScrollPosition` hook can only be used one at a time to update
  // states based on the position of an HTML element. Therefore, we need to implement
  // this hook once for each paragraph we are tracking the location of:
  useParagraphTracker(0);
  useParagraphTracker(1);
  useParagraphTracker(2);
  useParagraphTracker(3);
  useParagraphTracker(4);

  /**
   * This hook determines which "current slide" the user is viewing by
   * looking at the scroll positions of each paragraph:
   */
  useEffect(() => {
    const currentSlide =
      (paragraphPosition[0].y < ANIMATION_TRIGGER_BUFFER ? 1 : 0) +
      (paragraphPosition[1].y < ANIMATION_TRIGGER_BUFFER ? 1 : 0) +
      (paragraphPosition[2].y < ANIMATION_TRIGGER_BUFFER ? 1 : 0) +
      (paragraphPosition[3].y < ANIMATION_TRIGGER_BUFFER ? 1 : 0) +
      (paragraphPosition[4].y < ANIMATION_TRIGGER_BUFFER ? 1 : 0);
    setCurrentSlide(currentSlide);
  }, [paragraphPosition]);

  /**
   * This hook triggers custom animations based on when the current slide changes:
   */
  useEffect(() => {
    // Animate zoom level change when the first paragraph scrolls by:
    if (currentSlide === 1) {
      mapRef.current?.fitBounds(
        // Newtown Creek Bounds:
        [-73.947498, 40.714181, -73.923933, 40.732695],
        {
          duration: ANIMATION_DURATION,
        }
      );
    }
    if (currentSlide === 0) {
      mapRef.current?.zoomTo(10, { duration: ANIMATION_DURATION });
    }
  }, [currentSlide]);

  console.log();

  return !!boundaryData &&
    !!oilSpillData &&
    !!responsiblePartiesData &&
    !!homesBusinessesData ? (
    <div
      className="scrolly-container is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center is-doubled"
      style={{
        height: `${200 + NUMBER_OF_MAP_SLIDES * 100}vh`,
      }}
    >
      <div className="scrolly-image">
        <div className="map-container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
          <Map
            //@ts-ignore
            ref={mapRef}
            mapLib={maplibregl}
            initialViewState={{
              longitude: 44.088292409319294,
              latitude: 33.11625705653691,
              zoom: 7,
            }}
            //@ts-ignore
            mapStyle={MAPBOX_STYLE}
            transformRequest={transformStyleRequest}
            mapboxAccessToken={MAPBOX_TOKEN}
            interactive={false}
            cursor="auto"
          >
            <Source id="boundary-data" type="geojson" data={boundaryData}>
              <Layer
                id="superfund-boundary"
                type="fill"
                source="boundary-data"
                paint={{
                  "fill-color": "#0086be",
                  "fill-opacity": currentSlide === 0 ? 1 : 0.3,
                }}
              />
              <Layer
                id="superfund-boundary-line"
                type="line"
                source="boundary-data"
                paint={{
                  "line-color": "#0086be",
                  "line-width": 6,
                  "line-opacity":
                    currentSlide === 0 ? 0 : currentSlide < 3 ? 1 : 0.5,
                }}
              />
            </Source>
            <Source id="oil-spill-data" type="geojson" data={oilSpillData}>
              <Layer
                id="oil-spill"
                type="fill"
                source="oil-spill-data"
                paint={{
                  "fill-color": "#8AD306",
                  "fill-opacity":
                    currentSlide === 3 ? 1 : currentSlide === 4 ? 0.3 : 0,
                }}
              />
            </Source>
            <Source
              id="responsible-parties-data"
              type="geojson"
              data={responsiblePartiesData}
            >
              <Layer
                id="responsible-parties"
                type="circle"
                source="responsible-parties-data"
                paint={{
                  "circle-color": "#d02d3c",
                  "circle-radius": (currentSlide === 4 ? 1 : 0) * 10,
                  "circle-opacity": currentSlide === 4 ? 1 : 0,
                  "circle-radius-transition": {
                    duration: 1500,
                  },
                }}
              />
            </Source>
            <Source
              id="homes-businesses-data"
              type="geojson"
              data={homesBusinessesData}
            >
              <Layer
                id="homes-businesses"
                type="fill"
                source="homes-businesses-data"
                paint={{
                  "fill-color": "#fdbe2b",
                  "fill-opacity": currentSlide < 5 ? 0 : 1,
                }}
              />
              <Layer
                id="homes-businesses-line"
                type="line"
                source="homes-businesses-data"
                paint={{
                  "line-color": "#0086be",
                  "line-width": 1,
                  "line-opacity": currentSlide < 5 ? 0 : 0.5,
                }}
              />
            </Source>
          </Map>
        </div>
      </div>
      {slideElements.map((slide, i) => (
        <div
          key={i}
          className="scrolly-caption is-flex-direction-column is-justify-content-center p-3 mx-2"
          style={{
            marginTop: `${i + 1}00vh`,
          }}
          //@ts-ignore
          ref={paragraphRefs.current[i]}
        >
          <Paragraph text={slide} />
        </div>
      ))}
    </div>
  ) : (
    <MapLoadingScreen />
  );
};
