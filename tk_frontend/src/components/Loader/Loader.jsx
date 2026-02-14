import "./Loader.scss";

const Loader = ({loaderSize}) => {
  return (
    <div className={`loader ${loaderSize}`}>
      <div class="wrapper">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
      </div>
    </div>
  );
};

export default Loader;
