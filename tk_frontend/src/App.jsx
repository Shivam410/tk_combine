import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Homepage from "./pages/Homepage/Homepage.jsx";
import About from "./pages/About/About.jsx";

import Service1 from "./pages/ServicesPage/Service1/Service1.jsx";
import Service2 from "./pages/ServicesPage/Service2/Service2.jsx";
import Service3 from "./pages/ServicesPage/Service3/Service3.jsx";
import Service4 from "./pages/ServicesPage/Service4/Service4.jsx";
import Service5 from "./pages/ServicesPage/Service5/Service5.jsx";
import Service6 from "./pages/ServicesPage/Service6/Service6.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Gallery from "./pages/Gallery/Gallery.jsx";
import Service7 from "./pages/ServicesPage/Service7/Service7.jsx";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import Service8 from "./pages/ServicesPage/Service8/Service8.jsx";
import Service9 from "./pages/ServicesPage/Service9/Service9.jsx";
import { ScrollProvider, useScrollContext } from "./context/ScrollContext.jsx";

import { HelmetProvider } from "@dr.pogodin/react-helmet";
import ReactQueryProvider from "../utils/ReactQueryProvider.jsx";
import Wt from "./pages/WeddingTypePage/Wt.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";

function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    const { skipScroll, setSkipScroll } = useScrollContext();

    useEffect(() => {
      if (!skipScroll) {
        window.scrollTo(0, 0);
      }
      setSkipScroll(false);
    }, [pathname]);

    return null;
  };

  return (
    <div className="app">
      <ReactQueryProvider>
        <HelmetProvider>
          <ScrollProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Navbar />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/portfolio" element={<Gallery />} />

                {/* services */}
                <Route path="/wedding-photography" element={<Service1 />} />
                <Route path="/wedding-cinematography" element={<Service2 />} />
                <Route path="/pre-wedding-film" element={<Service3 />} />
                <Route path="/pre-wedding-photography" element={<Service4 />} />
                <Route
                  path="/civil-marriage-photography"
                  element={<Service5 />}
                />
                <Route
                  path="/engagement-photography-couple-portraits"
                  element={<Service6 />}
                />

                <Route path="/birthday-photography" element={<Service7 />} />

                <Route path="/baby-shower-photography" element={<Service8 />} />

                <Route path="/graduation-photography" element={<Service9 />} />

                {/* services */}

                {/* type */}
                <Route path="/hindu-wedding" element={<Wt />} />
                <Route path="/:serviceSlug" element={<ServiceDetail />} />
              </Routes>
              <Footer />

              <Toaster
                toastOptions={{
                  className: "",
                  style: {
                    fontFamily: "Sora, serif",
                    fontSize: "18px",
                    fontWeight: "600",
                  },
                }}
              />
            </BrowserRouter>
          </ScrollProvider>
        </HelmetProvider>
      </ReactQueryProvider>
    </div>
  );
}

export default App;
