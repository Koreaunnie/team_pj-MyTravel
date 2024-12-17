import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from "../assets/slide/slide1.png";
import slide2 from "../assets/slide/slide2.png";
import slide3 from "../assets/slide/slide3.png";
import slide4 from "../assets/slide/slide4.png";
import slide5 from "../assets/slide/slide5.png";

export function IndexSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className={"slider-container"}>
      <Slider {...settings}>
        <div>
          <a href="">
            <img src={slide1} alt="이미지 슬라이드 1" />
          </a>
        </div>

        <div>
          <a href="">
            <img src={slide2} alt="이미지 슬라이드 2" />
          </a>
        </div>

        <div>
          <a href="">
            <img src={slide3} alt="이미지 슬라이드 3" />
          </a>
        </div>

        <div>
          <a href="">
            <img src={slide4} alt="이미지 슬라이드 4" />
          </a>
        </div>

        <div>
          <a href="">
            <img src={slide5} alt="이미지 슬라이드 5" />
          </a>
        </div>
      </Slider>
    </div>
  );
}
