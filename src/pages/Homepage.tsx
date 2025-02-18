import React from "react";
import { PageLayout } from "../components/PageLayout";
import parse from "html-react-parser";
import { pageContent } from "../page-content";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "../styles/app.scss";
import "react-lazy-load-image-component/src/effects/blur.css";
import { OutboundLink } from "src/components/OutboundLink";
import { VideoContainer } from "src/components/Video";
import classnames from "classnames";
import { SocialShareButtons } from "src/components/SocialShareButtons";
import { NewsletterSignup } from "src/components/NewsletterSignup";
import { MapSequence } from "src/components/Map";
import widont from "widont";

type Author = {
  name: string;
  url: string;
};

export const LINKS_TO_CONTENT = {
  stories: {
    landingPage: "https://projects.thecity.nyc/hazard-nyc/",
    gowanusCanal: "https://projects.thecity.nyc/hazard-nyc-gowanus-canal",
    wolffAlport:
      "https://projects.thecity.nyc/hazard-nyc-wolff-alport-chemical-company/",
    newtownCreek: "https://projects.thecity.nyc/hazard-nyc-newtown-creek ",
  }
};

const getDatePublished = () => {
  const timestamp = process.env.REACT_APP_PUB_DATE;
  if (!timestamp) {
    throw new Error("No publication date defined in .env file!");
  } else {
    const date = new Date(timestamp.replace(/-/g, "/"));
    const dateFormatted = date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return dateFormatted;
  }
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

type Slide = {
  slideContent: string;
  photoFileName?: string;
  photoPosition?: string;
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

const { slideX, slide0, ...slideContent } = pageContent;

const introSlide = slide0 as Slide;
const slides = Object.entries(slideContent).map((entry) => entry[1]) as Slide[];

export const Homepage = () => {
  const byline = JSON.parse(process.env.REACT_APP_AUTHOR as string) as Author[];

  return (
    <PageLayout>
      <div className="app">
        <div className="scrolly-container">
          <div className="scrolly-image">
            <LazyLoadImage
              alt=""
              height="100vh"
              src={require(`../assets/images/scrolly-photos/${introSlide.photoFileName}`)}
              width="100%"
              effect="blur"
              style={{
                objectPosition: introSlide.photoPosition || "50% 50%",
              }}
            />
          </div>
          <div className="hero is-fullheight is-flex is-flex-direction-column is-justify-content-flex-end">
            <div className="landing-content mx-4">
              <h1 className="headline mb-0">
                The Meeker Avenue Plume Lurks Beneath North Brooklyn
              </h1>
              <div className="deck mt-3 mb-3">
                A reservoir of toxic chemicals lies below hundreds of homes in
                Greenpoint and East Williamsburg. The feds first need to find
                out if any dangerous fumes have surfaced, but that means getting
                property owners on board.
              </div>
              <div className="attribution mt-0">
                <p className="byline mt-1">
                  By{" "}
                  {byline.map((author, i) => (
                    <span key={i} className="author">
                      {/* <OutboundLink to={author.url}>{author.name}</OutboundLink> */}
                      {i === 0 ? (
                        <OutboundLink to={author.url}>
                          {author.name}
                        </OutboundLink>
                      ) : i === 1 ? (
                        <>
                          <br />
                          Photos by{" "}
                          <OutboundLink to={author.url}>
                            {author.name}
                          </OutboundLink>
                        </>
                      ) : i < byline.length - 1 ? (
                        <>
                          {", "}
                          <OutboundLink to={author.url}>
                            {author.name}
                          </OutboundLink>
                          {","}
                        </>
                      ) : i < byline.length ? (
                        <>
                          {" and "}
                          <OutboundLink to={author.url}>
                            {author.name}
                          </OutboundLink>
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  ))}
                  {" | "}
                  {getDatePublished()}
                </p>
              </div>
              <SocialShareButtons />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "black",
            paddingTop: "1em",
            paddingBottom: "1em",
            alignItems:"center",
            flexWrap:"wrap"
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontFamily: "Sharp Grotesk, Helvetica, sans-serif",
              fontWeight: "700",
              marginRight:"10px",
              marginLeft:"10px",
              marginBottom:"10px"
            }}
          >
            <a
              className="button is-warning is-outlined"
              href={"https://www.thecity.nyc/?p=35731"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen to a podcast version of this story
            </a>
          </div>
        </div>

        <NewsletterSignup />

        {slides.map((slide, i) => {
          const { slideContent, photoFileName, photoPosition } = slide;

          // CASE 1: No Photo
          if (!photoFileName) {
            return (
              <React.Fragment key={i}>
                <div className="hero is-medium">
                  <div className="hero-body" />
                </div>
                <div className="hero">
                  <div
                    className="hero-body container"
                    style={{
                      maxWidth: "600px",
                    }}
                  >
                    {formatContent(slideContent)}
                  </div>
                </div>
                <div className="hero is-medium">
                  <div className="hero-body" />
                </div>
              </React.Fragment>
            );
          }

          // CASE 2: VIDEO
          if (photoFileName.endsWith(".mp4")) {
            return (
              <VideoContainer
                videoUrl={photoFileName}
                slideContent={slideContent}
                key={i}
              />
            );
          }

          // CASE 3: MAP
          if (photoFileName.startsWith("MAP")) {
            return <MapSequence slideContent={slideContent} key={i} />;
          }

          // CASE 4: PHOTO
          return (
            <div
              key={i}
              className={classnames(
                "scrolly-container",
                "is-flex",
                "is-flex-direction-column",
                "is-justify-content-space-between",
                "is-align-items-center",
                splitParagraphs(slideContent).length > 1 && "is-doubled"
              )}
              style={{
                height: `${
                  200 + (splitParagraphs(slideContent).length || 1) * 100
                }vh`,
              }}
            >
              <div className="scrolly-image">
                <LazyLoadImage
                  alt=""
                  height="100vh"
                  src={require(`../assets/images/scrolly-photos/${photoFileName}`)}
                  width="100%"
                  effect="blur"
                  style={{
                    objectPosition: photoPosition || "50% 50%",
                  }}
                />
              </div>
              {splitParagraphs(slideContent).map((slideText, i) => (
                <div
                  className="scrolly-caption is-flex-direction-column is-justify-content-center p-3 mx-2"
                  style={{
                    marginTop: `${i + 1}00vh`,
                  }}
                  key={i}
                >
                  <Paragraph text={slideText} />
                </div>
              ))}
            </div>
          );
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "black",
            paddingTop: "1em",
            paddingBottom: "1em",
            alignItems:"center",
            flexWrap:"wrap"
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontFamily: "Sharp Grotesk, Helvetica, sans-serif",
              fontWeight: "700",
              marginRight:"10px",
              marginLeft:"10px",
              marginBottom:"10px"
            }}
          >
            <a
              className="button is-warning is-outlined"
              href={"https://www.thecity.nyc/?p=35731"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen to a podcast version of this story
            </a>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "25px",
            fontFamily: "Sharp Grotesk, Helvetica, sans-serif",
            fontWeight: "700",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "1em",
            paddingLeft: "1em",
            paddingRight: "1em",
          }}
        >
          <div style={{ paddingBottom: "10px", fontSize: "20px" }}>
            <h2>{widont("More HazardNYC Visual Stories")}</h2>
          </div>

          <div className="button-links">
            <a
              className="button is-warning is-outlined"
              href={LINKS_TO_CONTENT.stories.landingPage}
              target="_blank"
              rel="noopener noreferrer"
            >
              HazardNYC
            </a>
            <a
              className="button is-warning is-outlined"
              href={LINKS_TO_CONTENT.stories.gowanusCanal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Gowanus Canal
            </a>
            <a
              className="button is-warning is-outlined"
              href={LINKS_TO_CONTENT.stories.wolffAlport}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wolff-Alport Chemical Company
            </a>
            <a
              className="button is-warning is-outlined"
              href={LINKS_TO_CONTENT.stories.newtownCreek}
              target="_blank"
              rel="noopener noreferrer"
            >
              Newtown Creek
            </a>
          </div>
        </div>

        <div className="hero is-small">
          <div className="hero-body">
            <div
              className="copy"
              style={{
                maxWidth: "900px",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <p>
                Written and reported by{" "}
                <OutboundLink to="https://www.thecity.nyc/author/samantha-maldonado/">
                  Samantha Maldonado
                </OutboundLink>
                . Design and development by{" "}
                <OutboundLink to="https://www.thecity.nyc/author/sam-rabiyah/">
                  Sam Rabiyah
                </OutboundLink>
                . Editing by{" "}
                <OutboundLink to="https://www.thecity.nyc/author/harry-siegel/">
                  Harry Siegel
                </OutboundLink>
                . Photos by{" "}
                <OutboundLink to="https://www.thecity.nyc/author/ben-fractenberg/">
                  Ben Fractenberg
                </OutboundLink>{" "}
                and{" "}
                <OutboundLink to="https://www.alexkrales.com/">
                  Alex Krales
                </OutboundLink>
                . Additional development by{" "}
                <OutboundLink to="https://www.thecity.nyc/author/sujin-shin/">
                  Sujin Shin
                </OutboundLink>
                . Additional reporting by{" "}
                <OutboundLink to="https://jgasspoore.com/">
                  Jordan Gass-Pooré
                </OutboundLink>
                .
              </p>
              <p
                style={{
                  marginTop: "1rem",
                }}
              >
                Data sources:{" "}
                <OutboundLink to="https://cimc.epa.gov/ords/cimc/f?p=CIMC:MAP:0::NO::P71_IDSEARCH:SF_SITE_ID%7C0206282">
                  superfund site boundaries
                </OutboundLink>{" "}
                via the EPA.{" "}
                <OutboundLink to="https://www.resgroup.net/projects/commercial-real-estate-market-overview-and-public-private-partnership-strategies/">
                  Oil spill approximation
                </OutboundLink>{" "}
                via RESGroup.{" "}
                <OutboundLink to="https://extapps.dec.ny.gov/data/der/factsheet/224121revavaileng.pdf">
                  Responsible parties
                </OutboundLink>{" "}
                identified by the DEC.{" "}
                <OutboundLink to="https://www.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page">
                  Residential lots
                </OutboundLink>{" "}
                via NYC Planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

