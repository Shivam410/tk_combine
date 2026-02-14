import "./Service2.scss";
import AddingServices from "../../../components/AddingServices/AddingServices";
import { useLocation } from "react-router-dom";


const Service2 = () => {

  const location = useLocation();

  const path = location.pathname;

  return (
    <div className="service">

      <div className="service1-content">
        <AddingServices title="Wedding Cinematography" path={path} />
      </div>
    </div>
  );
};

export default Service2;
