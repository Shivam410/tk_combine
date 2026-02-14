import "./Service3.scss";
import AddingServices from "../../../components/AddingServices/AddingServices";
import { useLocation } from "react-router-dom";


const Service3 = () => {

  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="service">

      <div className="service1-content">
        <AddingServices title="Pre-Wedding Films" path={path}/>
      </div>
    </div>
  );
};

export default Service3;
