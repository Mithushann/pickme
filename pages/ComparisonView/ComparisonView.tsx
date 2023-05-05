import * as React from "react";
import * as d3 from "d3";
import Layout from "../components/Layout";
import { getAllCords, getCords } from "pages/api/getData";
import BarChart from "./Barchart";
import { randomIntFromInterval } from "util/helperFunc";
import { getDataForComparison } from "pages/api/getData";
import drawOnePathComparison from "../components/drawOnePathComparison";

interface Props {
  userType: string;
  RouteIds: number[];
  play: boolean;
  width: number;
  height: number;
}

const ComparisonView: React.FC<Props> = ({
  userType,
  RouteIds,
  play,
  width,
  height,
}) => {
  const svgLeft = React.useRef<SVGSVGElement>(null);
  const svgRight = React.useRef<SVGSVGElement>(null);

  // State variables for the optimized routes
  const [timeOptimized, setTimeOptimized] = React.useState([]);
  const [totalTimeOptimized, setTotalTimeOptimized] = React.useState([]);

  // State variables for the regular routes
  const [time, setTime] = React.useState<number>(0);
  const [totalTime, setTotalTime] = React.useState<number>(0);

  const [routes, setRoutes] = React.useState<any>([]);

  React.useEffect(() => {
    Layout(svgLeft, userType, width / 2, height * (3 / 4));
    // Chart(svgLeft, props.RouteIds, props.play, width/2, height* (3/4));

    Layout(svgRight, userType, width / 2, height * (3 / 4));
    // Chart(svgRight, props.RouteIds, props.play, width/2, height* (3/4));

  }, [userType, width, height]);

  React.useEffect(() => {
    getDataForComparison("clfth396f84847606p7ox1fi3l4").then((data) => {
    //   setTotalTimeOptimized(data.totalTime);
    
      let totalTime = 0;
      let vec=[];
    //   console.log("Data: ", data)
      data.routes.forEach((route: any) => {
        vec.push(route.finishTime)
        totalTime += route.finishTime;
      });
    //   console.log("Vec: ", vec.reduce((accumulator, currentValue) => accumulator + currentValue, 0))

      setTotalTimeOptimized(totalTime);
      setTimeOptimized(vec); 

      setRoutes(data.routes);

      
    });
  }, []);

    React.useEffect(() => {
        if(routes.length == 0) return;
        drawOnePathComparison(svgLeft, routes , width / 2, height * (3 / 4));
    }, [routes]);

  const timee = { Time: time, TimeOptimized: timeOptimized };
  const timeeMax = { TotalTime: totalTime, TotalTimeOptimized: totalTimeOptimized };

  return (
    <div className="cv-container">
      <div className="cv-top-view">
        <div className="cv-top-view-left">
          <svg ref={svgLeft} />
        </div>
        <div className="cv-top-view-right">
          <svg ref={svgRight} />
        </div>
      </div>
      <div className="cv-bottom-view">
        {/* Rerender the bar chat when the data changes */}
        <BarChart
          data={timee}
          dataMax={timeeMax}
          width={width}
          height={150}
          margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
        />
      </div>
    </div>
  );
};

export default ComparisonView;



// import * as React from "react";
// import * as d3 from "d3";
// import Layout from "../components/Layout";
// import print from 'util/print';
// import { getAllCords, getCords } from "pages/api/getData";
// import drawOnePath from "../components/DrawOnePath";
// import BarChart from "./Barchart";
// import Chart from "../components/Chart";
// import { randomIntFromInterval } from "util/helperFunc";
// import { getDataForComparison } from "pages/api/getData";

// const ComparisonView = (props: { userType: string, RouteIds: number[], play: boolean, width: number, height: number }) => {

//     let OptimizationId = "clfth396f84847606p7ox1fi3l4";
//     let inWidth = props.width;
//     let inHeight = props.height;

//     const svgLeft = React.useRef<SVGSVGElement>(null);
//     const svgRight = React.useRef<SVGSVGElement>(null);

//     // State variables for the optimized routes
//     const [TimeOptimized, setTimeOptimized] = React.useState(0);
//     const [TotalTimeOptimized, setTotalTimeOptimized] = React.useState(0);

//     // State variables for the regular routes
//     const [Time, setTime] = React.useState(0);
//     const [TotalTime, setTotalTime] = React.useState(0);
  
//     React.useEffect(() => {
//         Layout(svgLeft, props.userType, props.width / 2, props.height * (3 / 4));
//         // Chart(svgLeft, props.RouteIds, props.play, width/2, height* (3/4));

//         Layout(svgRight, props.userType, props.width / 2, props.height * (3 / 4));
//         // Chart(svgRight, props.RouteIds, props.play, width/2, height* (3/4));

//     }, [props.userType, props.width, props.height]);


//     getDataForComparison(OptimizationId).then((data) => {
//         // console.log("data", data);
//         // setTotalTimeOptimized(data.totalTime);
//         //   data.routes.map((d: any) => {
//         //      // console.log("d", d);
//         //      // setTimeOptimized(TimeOptimized + d.finishTime);
//         //   });
//     });

//     let Timee = { "Time": Time, "TimeOptimized": TimeOptimized };
//     let TimeeMax = { "TotalTime": TotalTime, "TotalTimeOptimized": TotalTimeOptimized };

//     return (
//         <div className="cv-container">
//             <div className="cv-top-view">
//                 <div className="cv-top-view-left">
//                     <svg ref={svgLeft} />
//                 </div>
//                 <div className="cv-top-view-right">
//                     <svg ref={svgRight} />
//                 </div>
//             </div>
//             <div className="cv-bottom-view" >
//                 {/* /* Rerender the bar chat when the data changes */}
//                 <BarChart data={Timee} dataMax={TimeeMax} width={inWidth} height={150} margin={{ top: 30, right: 20, bottom: 50, left: 50 }} />
//             </div>
//         </div>

//     );

// };

// export default ComparisonView;



