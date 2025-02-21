import React from "react";
import parse from "html-react-parser";

import "../styles/app.scss";
import "react-lazy-load-image-component/src/effects/blur.css";
import IraqMap from "src/components/MapAlternate";

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
      <IraqMap />

      {/* <MapSequence
        slideContent={
          " {newParagraph} {newParagraph} {newParagraph} {newParagraph} "
        }
      /> */}
    </div>
  );
};
