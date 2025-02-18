import React from "react";
import parse from "html-react-parser";

import "../styles/app.scss";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MapSequence } from "src/components/Map";

export const LINKS_TO_CONTENT = {
  stories: {
    landingPage: "https://projects.thecity.nyc/hazard-nyc/",
    gowanusCanal: "https://projects.thecity.nyc/hazard-nyc-gowanus-canal",
    wolffAlport:
      "https://projects.thecity.nyc/hazard-nyc-wolff-alport-chemical-company/",
    newtownCreek: "https://projects.thecity.nyc/hazard-nyc-newtown-creek ",
  },
};

const convertToHtml = (text: string) => {
  let formattedText = text;

  // Make links outbound:
  formattedText = formattedText.replace(
    "<a href=",
    '<a target="_blank" rel="noopener noreferrer" href='
  );

  // Make italics (photo credits) have space above:
  formattedText = formattedText.replace(
    "<em>",
    '<em style="display: inline-block; margin-top: 1rem;">'
  );

  // Fix double spaces and non-spaced commas:
  formattedText = formattedText.replace("  ", " ").replace(",", ", ");

  return parse(formattedText);
};

export const Paragraph: React.FC<{ text: string }> = ({ text }) => (
  <p className="copy">{convertToHtml(text)}</p>
);

export const splitParagraphs = (content: string) =>
  content.split("{newParagraph}");

export const formatContent = (content: string) => (
  <>
    {splitParagraphs(content).map((paragraph, i) => (
      <Paragraph key={i} text={paragraph} />
    ))}
  </>
);

export const Homepage = () => {
  return (
    <div className="app">
      <div className="scrolly-container" style={{ backgroundColor: "#D7C0B0" }}>
        <div
          className="hero is-fullheight is-flex is-flex-direction-column is-justify-content-center"
          style={{ backgroundColor: "#D7C0B0" }}
        >
          <div className="landing-content mx-4">
            <h1 className="headline mb-0 has-text-right">
              وأسقيناكم ماء فراتاً
            </h1>
            <h1 className="headline mb-0">and we gave you euphrates water</h1>
          </div>
        </div>
      </div>

      <MapSequence
        slideContent={
          " {newParagraph} {newParagraph} {newParagraph} {newParagraph} "
        }
      />
    </div>
  );
};
