
import axios from "axios";
// A function to get the data for comparison view given the optimizationId
export default async function getDataForComparison( simulationId: string = "clhruubzs1058607qryt66mt0p", isCustomer: boolean = false) {
    try {
      const query = `{
        simulationResult(simulationId: "clhruubzs1058607qryt66mt0p", customer: ${isCustomer} ) {
          totalDistanceForRoutes
          routes {
            id
            nOrderIds
            nOrderrowIds
            nArticles
            weight
            volume
            distance
            picker
            start
            finish
            routeStops {
              picked
              orderId
              shelfId
              itemId
            }
            routeTrajectories {
              id
              xCoor
              yCoor
            }
          }
        }
      }`;
      const headers = {
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
      };
  
      const response = await axios.get("https://optiplanwarehouse.com/graphql", { params: { query }, headers });
      return response.data.data.simulationResult;
    }
    catch (error) {
      console.log(error);
    }
  }
  
  