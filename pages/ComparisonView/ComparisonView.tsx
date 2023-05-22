import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BarChart from "./Barchart";
import getDataForComparison from "pages/api/getDataForComparison";
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

  // State variables for Optiplan
  const [distanceOptiplan, setDistanceOptiplan] = useState<number[]>([]);
  const [totalDistanceOptiplan, setTotalDistanceOptiplan] = useState<number>(0);
  const [routesOptiplan, setRoutesOptiplan] = useState<any>([]);

  // State variables for customer
  const [distanceCustomer, setDistanceCustomer] = useState<number[]>([]);
  const [totalDistanceCustomer, setTotalDistanceCustomer] = useState<number>(0);
  const [routesCustomer, setRoutesCustomer] = useState<any>([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    Layout(svgLeft, userType, width / 2, height * (3 / 4));
    Layout(svgRight, userType, width / 2, height * (3 / 4));
  }, [userType, width, height]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Optiplan
        const optiplanData = await getDataForComparison();
        setTotalDistanceOptiplan(optiplanData.totalDistanceForRoutes);
        setDistanceOptiplan(
          optiplanData.routes.map(
            (element: { distance: number }) => element.distance
          )
        );
        setRoutesOptiplan(optiplanData.routes);

        // Customer
        const customerData = await getDataForComparison(
          "clhruubzs1058607qryt66mt0p",
          true
        );
        setTotalDistanceCustomer(customerData.totalDistanceForRoutes);
        setDistanceCustomer(
          customerData.routes.map(
            (element: { distance: number }) => element.distance
          )
        );
        setRoutesCustomer(customerData.routes);

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        {isDataLoaded ? (
          <BarChart
            data={{
              optiplan: distanceOptiplan,
              customer: distanceCustomer,
            }}
            dataMax={{
              optiplan: totalDistanceOptiplan,
              customer: totalDistanceCustomer,
            }}
            width={width}
            height={150}
            margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
          />
        ) : (
          <div>Loading data...</div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;






// import * as React from "react";
// import Layout from "../components/Layout";
// import BarChart from "./Barchart";
// import getDataForComparison from "pages/api/getDataForComparison";
// import drawOnePathComparison from "../components/drawOnePathComparison";
// import { start } from "repl";

// interface Props {
//   userType: string;
//   RouteIds: number[];
//   play: boolean;
//   width: number;
//   height: number;
// }  
// const ComparisonView: React.FC<Props> = ({
//   userType,
//   RouteIds,
//   play,
//   width,
//   height,
// }) => {
//   const svgLeft = React.useRef<SVGSVGElement>(null);
//   const svgRight = React.useRef<SVGSVGElement>(null);

//   // State variables for Optiplan
//   const [distanceOptiplan, setDistanceOptiplan] = React.useState<number[]>([]);
//   const [totalDistanceOptiplan, setTotalDistanceOptiplan] = React.useState<number>(0);
//   const [routesOptiplan, setRoutesOptiplan] = React.useState<any>([]);
//   // const [timeOptiplan, setTimeOptiplan] = React.useState<number>(0);
//   // const [totalTimeOptiplan, setTotalTimeOptiplan] = React.useState<number>(0);

//   // State variables for customer
//   const [distanceCustomer, setDistanceCustomer] = React.useState<number[]>([]);
//   const [totalDistanceCustomer, setTotalDistanceCustomer] = React.useState<number>(0);
//   const [routesCustomer, setRoutesCustomer] = React.useState<any>([]);


//   React.useEffect(() => {
//     Layout(svgLeft, userType, width / 2, height * (3 / 4));
//     // Chart(svgLeft, props.RouteIds, props.play, width/2, height* (3/4));

//     Layout(svgRight, userType, width / 2, height * (3 / 4));
//     // Chart(svgRight, props.RouteIds, props.play, width/2, height* (3/4));

//   }, [userType, width, height]);

//   React.useEffect(() => {
//     // Optiplan 
//     let optiplanDistance: number[] = [];
//     let vectorOptiplan: { id: any; distance: any; routeStops: any; start: any; finish: any; }[] = [];
//     getDataForComparison().then((dataOptiplan) => {
//       setTotalDistanceOptiplan(dataOptiplan.totalDistanceForRoutes);
//       dataOptiplan.routes.forEach((element: { id: any; distance: any; routeStops: any; start: any; finish: any; }) => {
//         optiplanDistance.push(element.distance);
//         vectorOptiplan.push({
//           id: element.id,
//           distance: element.distance,
//           routeStops: element.routeStops,
//           start: element.start,
//           finish: element.finish,
//         });
//       });
//     });
//     setDistanceOptiplan(optiplanDistance);
//     setRoutesOptiplan(vectorOptiplan);

//     // Customer
//     let customerDistance: number[] = [];
//     let vectorCustomer: { id: any; distance: any; routeStops: any; start: any; finish: any; }[] = [];
//     getDataForComparison("clhruubzs1058607qryt66mt0p", true).then((dataCustomer) => {
//       setTotalDistanceCustomer(dataCustomer.totalDistanceForRoutes);
//       dataCustomer.routes.forEach((element: { id: any; distance: any; routeStops: any; start: any; finish: any; }) => {
//         customerDistance.push(element.distance);
//         vectorCustomer.push({
//           id: element.id,
//           distance: element.distance,
//           routeStops: element.routeStops,
//           start: element.start,
//           finish: element.finish,
//         });
//       });
//     });
//     setDistanceCustomer(customerDistance);
//     setRoutesCustomer(vectorCustomer);
//   }, []);

//   //   React.useEffect(() => {
//   //       if(routesOptiplan.length == 0) return;
//   //       drawOnePathComparison(svgLeft, routesOptiplan , width / 2, height * (3 / 4));
//   //   }, [routesOptiplan]);

//   //   React.useEffect(() => {
//   //     if(routesCustomer.length == 0) return;
//   //     drawOnePathComparison(svgRight, routesCustomer , width / 2, height * (3 / 4));
//   // }, [routesCustomer]);

//   let data = { optiplan: distanceOptiplan, customer: distanceCustomer }
//   let dataMax = { optiplan: totalDistanceOptiplan, customer: totalDistanceCustomer }
//   return (
//     <div className="cv-container">
//       <div className="cv-top-view">
//         <div className="cv-top-view-left">
//           <svg ref={svgLeft} />
//         </div>
//         <div className="cv-top-view-right">
//           <svg ref={svgRight} />
//         </div>
//       </div>
//       <div className="cv-bottom-view">
//         {/* Rerender the bar chat when the data changes */}
//         <BarChart
//           data={data}
//           dataMax={dataMax}
//           width={width}
//           height={150}
//           margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ComparisonView;
