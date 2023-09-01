import React from "react";
import { useState } from "react";
import { useEffect } from "react";
// import { API_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { getCookie, removeCookie } from "../../../config/cookies";
import { handleLogout } from "../../../redux/slices/authSlice";
// Import Swiper React components
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/scss";
import "swiper/scss/autoplay";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
SwiperCore.use([Autoplay, Pagination, Navigation]);

const Home = () => {
  // ** Illustrations Imports
  const loginSlider1 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/1500X450+B-1.png";
  const loginSlider2 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/1500X450+B-2.png";
  const loginSlider3 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/1500X450+B-3.png";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getCookie("token");

  //   useEffect(() => {
  //     setLoading(true);
  //     const requestOptions = {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     };
  //     let apiUrl = `${API_URL}/newdat/yojnanames/`;

  //     fetch(apiUrl, requestOptions)
  //       .then((res) => res.json())
  //       .then((response) => {
  //         setData(response.filter((item, index) => index < 8));
  //         setLoading(false);
  //       });
  //   }, []);
  const style = {
    // Adding media query..
    "@media (max-width: 1200px)": {
      maxWidth: "1140px",
    },
    "@media (max-width: 768px)": {
      maxWidth: "720px",
    },
    "@media (max-width: 576)": {
      maxWidth: "540px",
    },
    width: "100%",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
  };

  const style2 = {
    // Adding media query..
    "@media (max-width: 1200px)": {
      fontSize: "18px",
    },
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
    "@media (max-width: 576)": {
      fontSize: "18px",
    },
    color: "#0f106d",
  };

  const [singleRecordViewModal, setSingleRecordViewModal] = useState(false);
  const [newId, setNewId] = useState();

  const navigate = useNavigate();

  const handleOpenViewAllModal = () => {
    navigate("/viewallscheme");
  };

  const handleOpenSingleRecordModel = (id) => {
    setNewId(id);
    setSingleRecordViewModal(true);
  };

  return (
    <>
      {/* {header} */}
      <div className="navigation">
        <div
          className="container-fuild"
          style={{ borderBottom: "1px solid #ebe8e8", padding: "5px" }}
        >
          <div className="conatainer">
            <div className="row m-0">
              <div className="col-md-12" style={{ color: "#2c3b42" }}>
                Government of Gujarat
                {
                  !token ?
                    <>
                      <Link to='/login' style={{ float: " right", color: "#ff5c01" }}>Login</Link>
                    </>
                    :
                    <>
                      <Link to='/login' style={{ float: " right", color: "#ff5c01" }} onClick={() => {
                        removeCookie("token");
                        removeCookie("role");
                      }}>Logout</Link>
                      <Link to='/dashboard' className="me-2" style={{ float: " right", color: "#ff5c01" }}>Dashboard</Link>
                    </>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={style}>
          <div className="row">
            <div className="col-md-6">
              <nav className="navbar navbar-expand-lg d-flex justify-content-center justify-content-md-start">
                <a className="navbar-brand" href="#">
                  <img
                    src="https://gandhinagardm.in/newassets/images/coat_arms_india.png"
                    alt="Logo"
                  />
                  {/* <span style={style2}> જિલ્લા વહીવટીતંત્ર, ગાંધીનગર</span> */}
                </a>
              </nav>
            </div>
            <div className="col-md-6">
              <nav
                className="navbar navbar-expand-lg d-flex justify-content-center justify-content-md-end">
                <a className="navbar-brand" href="/">
                  <img
                    src="https://gandhinagardm.in/newassets/images/digital-india.png"
                    alt="Logo"
                  />
                </a>
                <a className="navbar-brand" href="/">
                  <img
                    src="https://gandhinagardm.in/newassets/images/aajadi_logo.png"
                    alt="Logo"
                  />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay
        pagination={{ clickable: true }}
        navigation
        onSlideChange={() => { }}
        onSwiper={(swiper) => { }}
      >
        <SwiperSlide>
          <img
            className="img-fluid"
            width="100%"
            src={loginSlider1}
            alt="Login Cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="img-fluid"
            width="100%"
            src={loginSlider2}
            alt="Login Cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="img-fluid"
            width="100%"
            src={loginSlider3}
            alt="Login Cover"
          />
        </SwiperSlide>
      </Swiper>
      {/* header2 */}
      {/* <div className="h-25">
        <div
          id="parallax"
          className="header-content d-flex align-items-center img-fluid justify-content-center"
        >
          <img
            src="https://blp.gujarat.gov.in/images/har-ghar-tiranga-web-banner-download-section-english-version.jpg"
            alt="Logo"
            className="img-fluid"
          />
        </div>
      </div> */}
      {/* COntent */}
      <div
        className="services-area gray-bg mt-2 pt-50 pb-100"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="section-title text-center pb-10"
                style={{ paddingBottom: "10px" }}
              >
                <h2
                  className="title home-title"
                  style={{
                    fontSize: "25px",
                    color: "#ff5722",
                    fontWeight: "700",
                  }}
                >
                  વ્યક્તિગત સરકારી યોજનાઓ, ગુજરાત સરકાર
                </h2>
              </div>
            </div>
          </div>

          {/* <div className="row justify-content-center">
            <div className="col-md-6">
              <a href="/dashboard" style={{ width: "100%" }}>
                <div
                  className="single-service text-center mt-10"
                  style={{
                    backgroundColor: "#257228",
                    marginTop: "10px",
                    border: "1px solid #eceff8",
                    borderRadius: "5px",
                    padding: "25px",
                    transition: "all 0.3s ease-out 0s",
                  }}
                >
                  <div className="service-icon">
                    <img src="https://gandhinagardm.in/newassets/images/icon-2.png" />
                  </div>
                  <div className="service-content" style={{ marginTop: "11px" }}>
                    <h4
                      className="service-title"
                      style={{ fontSize: "26px", color: "#ffeb3b" }}
                    >
                      તમને મળવાપાત્ર યોજનાઓ જાણો
                    </h4>
                  </div>
                </div>
              </a>
            </div>
          </div> */}

          {/* {singleRecordViewModal && (
            <SingleRecordView
              setSingleRecordViewModal={setSingleRecordViewModal}
              newId={newId}
            />
          )} */}

          <div>
            {loading ? (
              <ComponentSpinner />
            ) : (
              <div className="row">
                <div className="d-flex justify-content-center flex-wrap mb-2">
                  <div className="item col-xs-4 col-lg-4 p-2" >
                    <div className="thumbnail">
                      <div className="caption card-box bg-primary text-white d-flex justify-content-center py-2 rounded">
                        <div className="row d-flex justify-content-center">
                          <div className="col-xs-12 col-md-12 d-flex justify-content-center align-items-center flex-column px-3" >
                            <img src="https://gandhinagardm.in/uploads/icon/home.png" width={40} height={40} className="text-center" />
                            <h5 className="group card-title inner list-group-item-heading pt-1" >
                              <b>આંબેડકર આવાસ યોજના</b>  </h5>
                            <p className="group inner list-group-item-text pt-1" >
                              સામાજિક ન્યાય અને અધિકરીતા વિભાગ ગાંધીનગર
                            </p>
                            <p ><a className="view_details text-white" id="1" ><b>View More</b> </a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item col-xs-4 col-lg-4 p-2" >
                    <div className="thumbnail">
                      <div className="caption card-box bg-primary text-white d-flex justify-content-center py-2 rounded">
                        <div className="row d-flex justify-content-center">
                          <div className="col-xs-12 col-md-12 d-flex justify-content-center align-items-center flex-column px-3" >
                            <img src="https://gandhinagardm.in/uploads/icon/home.png" width={40} height={40} className="text-center" />
                            <h5 className="group card-title inner list-group-item-heading pt-1" >
                              <b>આંબેડકર આવાસ યોજના</b>  </h5>
                            <p className="group inner list-group-item-text pt-1" >
                              સામાજિક ન્યાય અને અધિકરીતા વિભાગ ગાંધીનગર
                            </p>
                            <p ><a className="view_details text-white" id="1" ><b>View More</b> </a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item col-xs-4 col-lg-4 p-2" >
                    <div className="thumbnail">
                      <div className="caption card-box bg-primary text-white d-flex justify-content-center py-2 rounded">
                        <div className="row d-flex justify-content-center">
                          <div className="col-xs-12 col-md-12 d-flex justify-content-center align-items-center flex-column px-3" >
                            <img src="https://gandhinagardm.in/uploads/icon/home.png" width={40} height={40} className="text-center" />
                            <h5 className="group card-title inner list-group-item-heading pt-1" >
                              <b>આંબેડકર આવાસ યોજના</b>  </h5>
                            <p className="group inner list-group-item-text pt-1" >
                              સામાજિક ન્યાય અને અધિકરીતા વિભાગ ગાંધીનગર
                            </p>
                            <p ><a className="view_details text-white" id="1" ><b>View More</b> </a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item col-xs-4 col-lg-4 p-2" >
                    <div className="thumbnail">
                      <div className="caption card-box bg-primary text-white d-flex justify-content-center py-2 rounded">
                        <div className="row d-flex justify-content-center">
                          <div className="col-xs-12 col-md-12 d-flex justify-content-center align-items-center flex-column px-3" >
                            <img src="https://gandhinagardm.in/uploads/icon/home.png" width={40} height={40} className="text-center" />
                            <h5 className="group card-title inner list-group-item-heading pt-1" >
                              <b>આંબેડકર આવાસ યોજના</b>  </h5>
                            <p className="group inner list-group-item-text pt-1" >
                              સામાજિક ન્યાય અને અધિકરીતા વિભાગ ગાંધીનગર
                            </p>
                            <p ><a className="view_details text-white" id="1" ><b>View More</b> </a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row justify-content-center">
            <div className="col-md-6">
              <a
                href="department.php"
                style={{
                  width: "100%",
                  color: "#0c14ff",
                  textDecoration: "underline",
                }}
              ></a>
              <div className="text-center mt-10" style={{ marginTop: "10px" }}>
                <a
                  style={{
                    width: "100%",
                    color: "#0c14ff",
                    textDecoration: "underline",
                  }}
                >
                  <h4
                    style={{ color: "#0c14ff" }}
                    onClick={handleOpenViewAllModal}
                  >
                    View All
                  </h4>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* footer content 1 */}

      <div
        style={{
          backgroundColor: "#e35c1c",
          color: "#fbfbfb",
          paddingTop: "50px",
          paddingBottom: "5px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <p>
                ગુજરાત રાજ્યના છેવાડાના માનવીને એની અસહાયતાના નિવારણને ટોચઅગ્રતા
                આપી તેના ઉત્કર્ષલક્ષી વિચારધારાની પ્રેરણાથી કોઈપણ જાતની મુશ્કેલી
                વિના સરળતાથી તેને સરકારી યોજનાકીય લાભોની માહિતી પ્રાપ્ત કરી શકે
                તે આ વેબસાઈટનો મુખ્ય ઉદ્દેશ્ય છે.
              </p>
              <p>
                આ વેબસાઈટ પર ગુજરાત સરકારના કુલ ૧૨ વિભાગોની કુલ ૧૬૧ યોજનાઓની
                માહિતી આપવામાં આવી છે. આ વેબસાઈટ પર દરેક વ્યક્તિ વિભાગવાર વિવિધ
                યોજનાની માહિતી મેળવી શકે છે. તમેજ તે કઈ યોજના માટે પાત્રતા ધરાવે
                છે તે જાણી શકે છે.{" "}
              </p>
              <p>
                વ્યક્તિ પોતાની ઉમર, જાતિ, જ્ઞાતિ, શૈક્ષણિક લાયકાત, રાશન પ્રકાર,
                વ્યવસાય, વાર્ષિક આવક વગેરેના આધારે પોતે ગુજરાત સરકારની કઈ કઈ
                યોજનાનો લાભ મેળવી શકે તે જાણી શકે છે. દરેક યોજનાનો લાભ મેળવવા
                માટે લાયકાતના ધોરણો, ફોર્મ સાથે જોડવાના આધારપુરાવાની યાદી, જે તે
                વિભાગ-કચેરીના સંપર્કની માહિતી, અરજી કેવી રીતે કરવી તેની જાણકારી
                સરળતાથી મેળવી શકે છે.{" "}
              </p>
              <p>
                આશા રાખીએ કે જરૂરિયાતમંદ દરેક વ્યક્તિને આ વેબસાઈટના માધ્યમથી
                મહત્તમ સરકારી યોજનાના લાભ મેળવવામાં ઉપયોગી પુરવાર થાય.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="d-flex justify-content-center flex-wrap my-2">
          <div className="p-2">
            <img src="https://images.pexels.com/photos/1926404/pexels-photo-1926404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" width={300} height={300} alt="" />
          </div>
          <div className="p-2">
            <img src="https://images.pexels.com/photos/1926404/pexels-photo-1926404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" width={300} height={300} alt="" />
          </div>
          <div className="p-2">
            <img src="https://images.pexels.com/photos/1926404/pexels-photo-1926404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" width={300} height={300} alt="" />
          </div>
          <div className="p-2">
            <img src="https://images.pexels.com/photos/1926404/pexels-photo-1926404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" width={300} height={300} alt="" />
          </div>
        </div>
      </div>

      {/* final footer */}
      <footer id="footer" className="footer-area">
        <div
          className="footer-copyright pb-20"
          style={{ paddingBottom: "20px", backgroundColor: "#1c2940" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="copyright-text pt-20"
                  style={{ paddingBottom: "20px", color: "#fff" }}
                >
                  <p>
                    <span style={{ float: "left" }}>
                      2023 © District Administration
                    </span>
                    <span style={{ float: "right" }}>
                      Site Visitor :{" "}
                      <img
                        src="https://hitwebcounter.com/counter/counter.php?page=7933889&amp;style=0006&amp;nbdigits=7&amp;type=page&amp;initCount=245142"
                        title="Site Visited"
                        alt="Site Visited"
                        border="0"
                      />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>
        {`
          @media (max-width: 1200px) {
            .container {
              max-width: 1140px;
            }
            /* Add other responsive styles here */
          }
  
          @media (max-width: 768px) {
            .container {
              max-width: 720px;
            }
            /* Adjust navigation, header, and other sections for mobile */
            .navigation {
              padding: 10px;
            }
            .header-content {
              // Adjust styles for the header content
            }
            .single-service {
              // Adjust styles for service card
            }
            /* Add other responsive styles here */
          }
        `}
      </style>
    </>
  );
};

export default Home;
