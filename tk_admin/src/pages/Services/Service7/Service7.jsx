import "./Service7.scss";
import AddingServices from "../../../components/AddingServices/AddingServices";
import { useLocation } from "react-router-dom";


const Service7 = () => {

  
  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="service">

      <div className="service1-content">
        <AddingServices title="Birthday Photography" path={path} />
      </div>
    </div>
  );
};

export default Service7;
