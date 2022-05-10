import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Container from "./components/styles/Container.styled";
import Header from "./components/styles/Header.styled";
import { Search } from "./components/styles/Search.styled";
import Footer from "./components/styles/Footer.styled";
import Landing from "./pages/Landing";
import Write from "./components/styles/WriteStudyDesc.styled";
import Map from "./components/styles/Map.styled";
import Study from "./components/styles/StudyDesc.styled";
import MyStudy from "./pages/MyStudy";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import LikedStudy from "./pages/LikedStudy";
import EditStudyDesc from "./components/styles/EditStudyDesc.styled";
import EditSideProfile from "./components/styles/EditSideProfile.styled";
import "../src/static/fonts/font.css";
import "./App.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import axios from "axios";

function App() {
  const theme = {
    colors: {
      purple: "#5E17EB",
      lavender: "#C593FE",
      bg: "#d8e4f4",
    },
    icons: {
      logo: "https://cdn.discordapp.com/attachments/965506579564732419/967356348390076427/happylogo2.png",
      write:
        "https://cdn.discordapp.com/attachments/965506579564732419/968872695011885076/7.png",
      login:
        "https://cdn.discordapp.com/attachments/965506579564732419/968872695255142420/8.png",
      mypage:
        "https://cdn.discordapp.com/attachments/965506579564732419/969043355067617321/9.png",
    },
    contents: {
      marginBottom: "20px",
      bg: "white",
      borderRadius: "20px",
      boxShadow: "10px 5px 15px 0.1px rgba(0, 0, 0, 0.1)",
    },
    size: {
      mobile: "520px",
      tablet: "768px",
      desktop: "1024px",
    },
  };

  const getAccessToken = async (authorizationCode) => {
    let resp = await axios.post(
      "https://server.happydeving.com/users/login/kakao",
      {
        authorizationCode: authorizationCode,
      }
    );
    console.log(resp);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    if (authorizationCode) {
      getAccessToken(authorizationCode);
    }
  });

  useEffect(() => {
    console.log(drop);

    if (
      window.location.href.split("/")[1] === "map" ||
      window.location.href === "http://localhost:3000"
    ) {
      setDrop(false);
    } else {
      setDrop(true);
    }
  }, []);

  // console.log(localStorage.getItem("user"));

  const [drop, setDrop] = useState(false);
  window.onscroll = function () {
    let windowTop = window.scrollY;
    if (windowTop >= 20) {
      setDrop(true);
    } else if (
      (window.location.href.split("/")[1] === "map" ||
        window.location.href === "http://localhost:3000") &&
      windowTop < 20
    ) {
      setDrop(false);
    }
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header img={theme.icons} drop={drop} />
        <Container>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <>
                  <Landing drop={drop} />
                </>
              }
            />
            <Route path="/write" element={<Write />} />
            <Route
              path="/map"
              exact
              element={
                <>
                  <Map />
                </>
              }
            />
            <Route path="/study/:id" element={<Study />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/study/edit/:id" element={<EditStudyDesc />} />
            <Route
              path="/editprofile"
              element={
                <>
                  {/* <EditSideProfile /> */}
                  <ProfileEdit />
                </>
              }
            />
            <Route path="/mystudy" element={<MyStudy />} />
            <Route path="/likedStudy" element={<LikedStudy />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          {/* <Footer /> */}
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
