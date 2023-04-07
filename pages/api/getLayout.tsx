import axios from "axios";

async function getLayoutOW(datasetId="cldd5iwk4157550806mgdpvvs5q1") {//cle41z5es815906mgsx34ry3v
    try {
    const query= `{nodes(datasetId:${datasetId}){
        nodeId
          xCoor
        yCoor
      }}`;
    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

     const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
     return response;
    }
    catch (error) {
      console.log(error);
    }
  }

    export {getLayoutOW}