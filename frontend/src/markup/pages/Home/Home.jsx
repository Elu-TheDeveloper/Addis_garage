import React from "react";
import About from "../../components/About/About";
import ServicesSec from "../../components/ServiceSection/ServiceSection";
import FeaturesSec from "../../components/Feature/Feature";
import WhyChooseUs from "../../components/WhyChooseUS/WhyChooseUs";
import CtaSec from "../../components/CtaSection/CtaSection";
import BottomBanner from "../../components/Banner/BottomBanner";
import TopBannerHome from "../../components/Banner/TopBannerHome";

const Home = () => {
  return (
    <div className="page-wrapper">
      {/* Video Section */}
      <TopBannerHome />
      {/* About Us Section */}
      <About />
      {/* Services Section */}
      <ServicesSec />
      {/* Services Section */}
      <FeaturesSec />
      {/* Why Choose US Section */}
      <WhyChooseUs />
      {/* Video Section */}
      <BottomBanner />
      {/* CTA Section */}
      <CtaSec />
    </div>
  );
};

export default Home;
