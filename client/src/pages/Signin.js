import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../features/user/userSlice";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LoadingIndicator from "../components/LoadingIndicator";
import axios from "axios";
import { GoogleLoginApi } from "../api/socialAuth";
import { GoogleLogin } from "react-google-login";
import {
  GOOGLE_CLIENT_ID,
  KAKAO_CLIENT_ID,
  GITHUB_CLIENT_ID,
  NAVER_CLIENT_ID,
  NAVER_STATE,
  github_redirect_url,
  kakaoNaver_redirect_url,
  Kakao_url,
  Github_url,
  Naver_url,
} from "../config";
//
import google from "../static/images/google.png";
import github from "../static/images/github.png";
import naver from "../static/images/naver.png";
import kakao from "../static/images/kakao.png";

const Background = styled.div`
  grid-column: 4/ 12;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 20% auto;
  font-size: 18px;
  font-weight: 500;
  @media screen and (max-width: 1024px) {
    grid-column: 3 / 13;
    width: 80%;
    transition: 1s;
  }
  @media screen and (max-width: 764px) {
    grid-column: 2 / 14;
    transition: 1s;
  }
`;

const SigninWrap = styled.div`
  display: flex;
  min-width: 400px;
  width: 600px;
  height: 100%;
  padding: 20px;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  form {
    display: flex;
    width: 90%;
    flex-direction: column;
  }
  input {
    display: flex;
    background: transparent;
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 5px 5px;
    width: 100%;
    border: none;
    border-bottom: 3px solid #ccc;
  }
  input:hover {
    outline: none;
    border-bottom: 3px solid #6733e5;
  }
  input:focus {
    outline: none;
    border-bottom: 3px solid #6733e5;
  }
`;
const Title = styled.h1`
  display: flex;
  color: #6733e5;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  font-size: 35px;
  font-weight: 900;
  text-shadow: 1px 1px 1px #c593fe;
`;
const Text = styled.div`
  margin-right: 10px;
  color: #6733e5;
  opacity: 0.5;
  font-size: 20px;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  button {
    cursor: pointer;
    padding: 10px 0px;
    font-size: 22px;
    font-weight: 900;
    border: 3px solid #c593fe;
    width: 100%;
    color: white;
    background-color: #6733e5;
    border-radius: 10px;
    margin-top: 30px;
    margin-border: 30px;
    transition: 5ms;
  }
  button:hover {
    background-color: #c593fe;
    border: 3px solid #6733e5;
    position: relative;
    top: -2px;
  }
  button:active {
    position: relative;
    top: 2px;
  }
  margin-bottom: 20px;
`;
const SocialTitle = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;
  margin: 8px 0px;
  &::before,
  &::after {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.35);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
`;
const SocialLoginButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
  .sButton {
    width: 60px;
    margin: 10px;
    box-shadow: 3px 3px 3px gray;
    border-radius: 10px;
    overflow: hidden;
    &:hover {
      position: relative;
      top: 2px;
    }
  }
`;
const KakaoButton = styled.div`
  /* width: 80px; */
  background-color: yellow;
  image {
    width: 100%;
  }
`;
const GitButton = styled.div`
  background-color: black;
  /* width: 80px;
  background-color: gray; */
`;
const GoogleButton = styled.div`
  border-radius: 10px;
  background-color: #d3d3d3;
  /* width: 80px; */
  position: relative;
  image {
    width: 100%;
  }
`;
const NaverButton = styled.div`
  background-color: green;
  border-radius: 10px;
`;
const AlertBox = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
`;
const Resister = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #c593fe;
  padding-bottom: 20px;
  font-size: 14px;
  span {
    font-weight: 700;
    color: #6733e5;
    border-bottom: 1px solid #c593fe;
  }
`;

function Signin() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  // const [gitOrKakao, setSocial] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    // dispatch(reset()); // 상태(로딩or성공or실패) 모두 리셋
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    const whichone = localStorage.getItem("login");
    if (whichone === "kakao") {
      const url = new URL(window.location.href);
      const authorizationCode = url.searchParams.get("code");
      if (authorizationCode) {
        getKakaoAccessToken(authorizationCode);
      }
    }
    if (whichone === "naver") {
      const url = new URL(window.location.href);
      const authorizationCode = url.searchParams.get("code");
      if (authorizationCode) {
        getNaverAccessToken(authorizationCode);
      }
    }
    if (whichone === "github") {
      const url = new URL(window.location.href);
      const authorizationCode = url.searchParams.get("code");
      if (authorizationCode) {
        getGithubAccessToken(authorizationCode);
      }
    }
  }, []);

  const handleInputValue = (key) => (e) => {
    setUserData({ ...userData, [key]: e.target.value });
  };

  const getNaverAccessToken = async (authorizationCode) => {
    let resp = await axios.post(Naver_url, {
      authorizationCode: authorizationCode,
    });

    const { user } = resp.data;
    const { accessToken } = resp.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(accessToken));
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    navigate("/");
    window.location.reload();
  };

  const getKakaoAccessToken = async (authorizationCode) => {
    let resp = await axios.post(Kakao_url, {
      authorizationCode: authorizationCode,
    });
    const { user } = resp.data;
    const { accessToken } = resp.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(accessToken));
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    navigate("/");
    window.location.reload();
  };

  const getGithubAccessToken = async (authorizationCode) => {
    let resp = await axios.post(Github_url, {
      authorizationCode: authorizationCode,
    });
    const { user } = resp.data;
    const { accessToken } = resp.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(accessToken));
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    navigate("/");
    window.location.reload();
  };

  const socialLoginHandler = async (social) => {
    if (social === "kakao") {
      localStorage.setItem("login", "kakao");
      const redirect_url = kakaoNaver_redirect_url;
      const kakaoURI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirect_url}`;
      window.location.assign(kakaoURI);
    }
    if (social === "github") {
      localStorage.setItem("login", "github");
      const redirect_url = github_redirect_url;
      const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_url=${redirect_url}`;
      window.location.assign(GITHUB_LOGIN_URL);
    }
    if (social === "naver") {
      localStorage.setItem("login", "naver");
      const redirect_url = kakaoNaver_redirect_url;
      const naverURI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${redirect_url}&state=${NAVER_STATE}`;
      window.location.assign(naverURI);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    if (Object.values(userData).includes("")) {
      setErrorMessage("모든 항목을 입력해 주세요.");
      return;
    }

    dispatch(signin(userData));
    navigate("/");
  };

  const handleGoogleLoginFailure = (result) => {
    console.log(`${JSON.stringify(result)}`);
  };

  const handleGoogleLogin = async (googleData) => {
    // body: {token: googleData.tokenId}
    console.log("googleData", googleData);
    await GoogleLoginApi(googleData.tokenId).then((res) => {
      console.log("google res: ", res);
      localStorage.setItem("user", JSON.stringify(res.data.userInfo));
      localStorage.setItem("token", JSON.stringify(res.data.accessToken));
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + res.data.accessToken,
      };
      navigate("/");
      window.location.reload();
    });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Background>
        <SigninWrap>
          <form onSubmit={handleSignin}>
            <Title>로그인</Title>
            <Text>이메일</Text>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              onChange={handleInputValue("email")}
            />
            <Text>비밀번호</Text>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              onChange={handleInputValue("password")}
            />
            <Resister>
              <p> 아직 회원이 아니신가요? </p>
              <Link to="/signup">
                <span>회원가입하기</span>
              </Link>
            </Resister>
            <ButtonWrap>
              <button type="submit">로그인 </button>
            </ButtonWrap>
            <div>
              <SocialTitle> 소셜 로그인 </SocialTitle>
            </div>
            <SocialLoginButton>
              <KakaoButton
                className="sButton"
                type="button"
                onClick={() => socialLoginHandler("kakao")}
              >
                <img src={kakao} alt="kakao" />
              </KakaoButton>
              <GoogleButton className="sButton">
                <GoogleLogin
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <img src={google} alt="google" />
                    </button>
                  )}
                  buttonText=""
                  clientId={GOOGLE_CLIENT_ID}
                  onSuccess={handleGoogleLogin}
                  onFailure={handleGoogleLoginFailure}
                  cookiePolicy={"single_host_origin"}
                ></GoogleLogin>
              </GoogleButton>
              <NaverButton className="sButton">
                <img
                  src={naver}
                  alt="naver"
                  onClick={() => socialLoginHandler("naver")}
                />
              </NaverButton>
              <GitButton className="sButton">
                <img
                  src={github}
                  onClick={() => socialLoginHandler("github")}
                />
              </GitButton>
            </SocialLoginButton>
            <AlertBox className="alert-box">{errorMessage}</AlertBox>
          </form>
        </SigninWrap>
      </Background>
    </>
  );
}

export default Signin;
