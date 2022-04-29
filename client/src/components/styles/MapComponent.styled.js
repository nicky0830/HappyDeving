import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Content from "../styles/Content.styled";
import { markerdata as dummydata } from "../../data/Marker.data";
import { langImg } from "../../static/images/langImg";
const { kakao } = window;

//검색한 조건에 맞는 스터디들의 목록

const MapView = styled(Content)`
  width: 100%;
  height: 100px;
  position: relative;
  z-index: 0;
  margin-bottom: 5px;
`;

const MapComponent = () => {
  const container = useRef(null);

  const mapscript = () => {
    const studies = dummydata.data.studies;
    const markerdata = studies.map((el) => {
      return {
        id: el.id,
        title: el.content.title,
        latlng: { lat: el.location.lat, lng: el.location.lng },
        img: langImg[el.language[0].name],
        info: el.createdAt.split("T")[0],
      };
    });
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container.current, options);

    var // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(65, 65), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    markerdata.forEach((el) => {
      var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(el.latlng.lat, el.latlng.lng),
        title: el.title,
        image: new kakao.maps.MarkerImage(el.img, imageSize, imageOption),
      });
      //marker 배열 내용을 하나씩 넣어서 만드는 과정

      marker.setClickable(true);
      marker.getClickable(true);
      // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다

      function heartHandler() {
        // el.id;
        if (icon.className === "fa-solid fa-heart fa-2x") {
          icon.className = "fa-regular fa-heart fa-2x";
        } else {
          icon.className = "fa-solid fa-heart fa-2x";
        }
      }
      //el.id 스터디 아이디가 담겨온다.
      function contentHandler() {
        //모달 창 클릭 시 상세스터디 페이지로 이동
        document.location.href = `/study/${el.id}`;
      }

      //모달창 내용 구현 : 바닐라JS로 해야 함
      const content = document.createElement("div");
      content.id = "content";

      const title = document.createElement("div");
      title.id = "title";
      title.textContent = el.title;

      const img = document.createElement("img");
      img.id = "img";
      img.src = el.img;
      img.onclick = contentHandler;

      const desc = document.createElement("div");
      desc.id = "desc";

      const info = document.createElement("span");
      info.id = "info";
      info.textContent = el.info;

      const icon = document.createElement("i");
      icon.id = "icon";
      icon.className = `fa-regular fa-heart fa-2x`;
      icon.onclick = heartHandler;
      //바로 안 바뀌고 창을 끄고 난 다음에 바뀜
      //즉 overlay를 새로고침해야
      //state는 원래 전체 창을 렌더링하는 건데 왜 이럴까?

      desc.append(info, icon);
      content.append(title, img, desc);

      //overlay로 maps에 뿌려줌
      var overlay = new kakao.maps.CustomOverlay({
        content: content,
        position: marker.getPosition(),
        clickable: true,
      });

      //마커를 클릭하면 지도에 모달창 생성
      kakao.maps.event.addListener(marker, "click", function () {
        overlay.setMap(map);
      });

      //마커 외의 map을 클릭하면 모달창이 사라진다
      kakao.maps.event.addListener(map, "click", function () {
        overlay.setMap(null);
      });
    });
  };

  useEffect(() => {
    mapscript();
  }, []);

  return <MapView ref={container} />;
};

export default MapComponent;