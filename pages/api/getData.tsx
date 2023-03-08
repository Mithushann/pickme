
import React from "react";
import axios from "axios";

 async function getAllCords(){
    try {
      const response = await axios.get("http://localhost:3333/api/getAll");
      const Data = response.data;
      const cords = Data.map((d: any) => [d.Xcorrdinate, d.Ycorrdinate]);
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

    export {getAllCords, getCords};
  