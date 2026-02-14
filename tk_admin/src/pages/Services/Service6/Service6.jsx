import "./Service6.scss";
import AddingServices from "../../../components/AddingServices/AddingServices";
import { useLocation } from "react-router-dom";


const Service6 = () => {
  
  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="service">

      <div className="service1-content">
        <AddingServices title="Engagement Photography & Couple Portraits" path={path} />
      </div>
    </div>
  );
};

export default Service6;
