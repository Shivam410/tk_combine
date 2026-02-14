import "./Service5.scss";
import AddingServices from "../../../components/AddingServices/AddingServices";
import { useLocation } from "react-router-dom";


const Service5 = () => {

  
  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="service">

      <div className="service1-content">
        <AddingServices title="Civil Marriage Photography" path={path} />
      </div>
    </div>
  );
};

export default Service5;
