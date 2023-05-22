
import axios from "axios";

export default async function getTrajectory(Id: string = "clhruubzs1058607qryt66mt0p", RouteId: number = 0) {
  try {
    // graphql query
    const query = `{simulationResult(simulationId: "clhruubzs1058607qryt66mt0p", customer: false) {
        routes {
          id
          routeTrajectories {
            id
            xCoor
            yCoor
          }
        }
      }
    }`;
    // graphql query headers
    let headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };
    // graphql query url
    const url = "https://optiplanwarehouse.com/graphql";
    // graphql query
    const response = await axios.post(url, {
      query: query
    }, { headers: headers });

    console.log("Res", response);
    const Route = response.data.data.simulationResult.routes[RouteId];
    return Route;
  }
  catch (error) {
    console.log("Error in api/getTrajectories.tsx");
    console.log(error);
  }
}