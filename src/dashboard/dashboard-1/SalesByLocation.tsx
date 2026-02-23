/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useJsApiLoader } from "@react-google-maps/api";
import "react-tooltip/dist/react-tooltip.css";
import Cookies from "js-cookie";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import salesLocations from "../../demoData/table-data.json";
import { Cards } from "@/components/cards/frame/cards-frame";
import { getEngineers } from "@/functions/engineer";

interface SalesLocationData {
  engineer: string[][];
  device: string[][];
}

interface Geo {
  rsmKey: string;
  properties: {
    name: string;
  };
}
interface Engineer {
  position: any;
  mainPhone: string;
  fullName: string;
}

const { salesLocation } = salesLocations;

// const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const regionColumns = [
  {
    title: "Top Region",
    dataIndex: "region",
    key: "region",
    className:
      "px-4 py-2.5 last:text-end text-dark dark:text-white/[.87] text-15 font-medium border-none before:hidden",
  },
  {
    title: "Order",
    dataIndex: "order",
    key: "order",
    className:
      "px-4 py-2.5 last:text-end text-body dark:text-white/60 border-none before:hidden",
  },
  {
    title: "Revenue",
    dataIndex: "revenue",
    key: "revenue",
    className:
      "px-4 py-2.5 min-3xl:last:text-center text-body dark:text-white/60 border-none before:hidden",
  },
];

interface RootState {
  ChangeLayoutMode: {
    rtlData: string;
  };
}

const SaleByLocation = React.memo(() => {
  const token = Cookies.get("access_token");
  const [state, setState] = useState({
    locationTab: "engineer",
  });
  const [engineer, setEngineer] = useState([]);
  const [device, setDevice] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    // getEngineers("created_at", "desc", page, token).then(
    getEngineers({
      authtoken: token,
      page,
      limit: 100,
      order: "created_at",
      sort: "desc",
      search: "",
    }).then((res: { data: React.SetStateAction<never[]> }) => {
      console.log("ENGINEER", res.data);
      setEngineer(res.data);
    });
  }, []);

  const { rtl } = useSelector((state: RootState) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });
  const { isLoaded } = useJsApiLoader({
    id: "google-map-api",
    region: "ID",
    googleMapsApiKey: "AIzaSyBSsPrc2tC9DfleTfMnvks5CrEtd2oOSTY",
  });
  // let icon = ""
  // if(isLoaded){
  //   let icon = {
  //     url: "../../../public/icon/dashboard/engineer.png", // url
  //     scaledSize: new google.maps.Size(50, 50), // scaled size
  //     origin: new google.maps.Point(0,0), // origin
  //     anchor: new google.maps.Point(0, 0) // anchor
  //   };
  // }
  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const center = {
    lat: -6.206664253839927,
    lng: 106.83845080409377,
  };
  function renderThumb({ style }: any) {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: "#F1F2F6",
    };
    return <div style={{ ...style, ...thumbStyle }} />;
  }
  const renderTrackVertical = () => {
    const thumbStyle: any = {
      position: "absolute",
      width: "6px",
      transition: "opacity 200ms ease 0s",
      opacity: 0,
      [rtl ? "left" : "right"]: "2px",
      bottom: "2px",
      top: "2px",
      borderRadius: "3px",
    };
    return (
      <div
        className="[&>div]:bg-regular dark:[&>div]:bg-[#32333f]"
        style={thumbStyle}
      />
    );
  };
  function renderView({ style }: any) {
    const customStyle = {
      marginRight: rtl && "auto",
      [rtl ? "marginLeft" : "marginRight"]: "-17px",
    };
    return <div style={{ ...style, ...customStyle }} />;
  }

  /* State destructuring */
  const { locationTab } = state;
  const handleChangeLocation = (
    value: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setState({
      ...state,
      locationTab: value,
    });
  };
  // Make Data Array for Table
  const saleLocationData: Array<{
    key: number;
    region: string;
    order: string;
    revenue: string;
  }> = [];

  // Map Configuration
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [content, setContent] = useState("");

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = () => {
    setPosition(position);
  };

  return (
    <div className="h-full">
      <Cards
        isbutton={
          <ul className="flex items-center mb-0">
            <li>
              <Link
                className={
                  locationTab === "engineer"
                    ? "inline-flex items-center bg-primary-transparent dark:bg-white/10 px-3 h-8 text-primary dark:text-white/[.87] text-13 font-medium rounded-md"
                    : "inline-flex items-center px-3 h-8 text-light dark:text-white/60 hover:text-primary text-13"
                }
                onClick={(e) => handleChangeLocation("engineer", e)}
                href="#"
              >
                Engineer
              </Link>
            </li>
            <li>
              <Link
                className={
                  locationTab === "device"
                    ? "inline-flex items-center bg-primary-transparent dark:bg-white/10 px-3 h-8 text-primary dark:text-white/[.87] text-13 font-medium rounded-md"
                    : "inline-flex items-center px-3 h-8 text-light dark:text-white/60 dark:hover:text-white hover:text-primary text-13 font-medium rounded-md"
                }
                onClick={(e) => handleChangeLocation("device", e)}
                href="#"
              >
                Device
              </Link>
            </li>
          </ul>
        }
        title="Engineer Location"
        size="large"
        className="h-full [&>.ant-card-body]:pb-[30px] [&>.ant-card-body]:pt-[25px] [&>.ant-card-body]:px-[25px] ant-card-head-px-25 ant-card-head-title-base border-none"
      >
        <Row>
          <Col xxl={24} md={24} xs={24}>
            <div className="border-1 border-solid border-regular dark:border-white/10 dark:border-none rounded-[4px]">
              {isLoaded ? (
                <APIProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
                >
                  <Map
                    style={{
                      width: "100%",
                      height: "500px",
                    }}
                    defaultCenter={center}
                    defaultZoom={10}
                    gestureHandling={"greedy"}
                    mapId={"sales"}
                  >
                    {/* Child components, such as markers, info windows, etc. */}

                    {engineer.length > 0 &&
                      engineer.map((tek: Engineer, index) => {
                        const latit =
                          tek.position.latitude == null
                            ? 106.8271692
                            : tek.position.latitude;
                        const longit =
                          tek.position.longitude == null
                            ? -6.1754024
                            : tek.position.longitude;
                        // console.log("LAT", latit, "LONG", longit);
                        const options = {
                          closeBoxURL: "",
                          enableEventPropagation: true,
                        };
                        return (
                          <div key={index}>
                            <AdvancedMarker
                              position={{
                                lat: latit,
                                lng: longit,
                              }}
                              key={tek.mainPhone}
                              //   visible={true}
                              //   icon={
                              //     "https://servicehub.id/icons/dashboard/engineer.png"
                              //   }
                            >
                              <Image
                                src="/icon/dashboard/engineer.png"
                                alt=""
                                width={32}
                                height={32}
                              />
                            </AdvancedMarker>
                          </div>
                        );
                      })}
                  </Map>
                </APIProvider>
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
      </Cards>
    </div>
  );
});
SaleByLocation.displayName = "SaleByLocation";
export default SaleByLocation;
