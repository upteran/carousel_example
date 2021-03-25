import { useRef } from "react";

import SectionTouchCarousel from "./Carousel";
import "./styles.css";

const arr = [
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1900788/989b899c-ee81-4c4b-9186-9ac2a3407ce1/140x210"
  },
  {
    src:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/ba79433c-84c0-4ce7-b4a4-bfcfe89ca3bf/140x210"
  }
];

export default function App() {
  const renderList = () =>
    arr.map((item) => (
      <img src={item.src} style={{ paddingRight: "20px" }} alt="" />
    ));
  return (
    <div className="App">
      <div className="centered">
        <SectionTouchCarousel
          totalSlides={arr.length}
          titleProps={{}}
          slidePadding={20}
          slideSize={160}
          getSlideWidth={() => {}}
        >
          {renderList()}
        </SectionTouchCarousel>
      </div>
    </div>
  );
}
