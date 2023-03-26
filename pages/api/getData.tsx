
import React from "react";
import axios from "axios";

 async function getAllCords(){
    try {
      const response = await axios.get("http://localhost:3333/api/getAll");
      const Data = response.data;
      const cords = Data.map((d: any) => [d.Xcorrdinate, d.Ycorrdinate, d.Nodetype]);
      return cords;
    }
    catch (error) {
      console.log(error);
    }
  }
  
  // A function to get the route data (given RouteID) from the api (getCords(RouteId))
  async function getCords(RouteId: number) {
    try {
      const response = await axios.get("http://localhost:3333/api/get/" + RouteId);
      const Data = response.data;
      const cords = Data;
      return cords;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function getDataFromOptiplanWarehouse(optimizationId="cle41z5es815906mgsx34ry3v") {
    try {
    const query= `{
      optimization(optimizationId: "${optimizationId}") {
        subGroups{
          solution{
            routes{
              routeStops{
                shelf{
                  orgShelfId, xCoor, yCoor}, 
                  aisle{
                    orgAisleId, 
                    frontEndX
                  }
                  },
                     routeTrajectories {
                      xCoor, yCoor}
                    }
                  }
                }
              }
            }`;
    const headers = {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

     const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
     return response.data.data.optimization.subGroups[0].solution.routes;
    }
    catch (error) {
      console.log(error);
    }
  }

    export {getAllCords, getCords, getDataFromOptiplanWarehouse};
  