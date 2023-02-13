import  print  from 'util/print';

function extractCoordinates( typeofObject: string, object: any, RecordList: any, overallValues: any) {
  if (object.name.includes(typeofObject)) {
    // print(object)
  let RecCord: any[][] = [];
  object.vertices.map((vertex: any) => {
    if (vertex[2] == 0) {
      RecCord.push([vertex[0], vertex[1]]);
     

      if (vertex[0] > overallValues.MaxX) {
        overallValues.MaxX = vertex[0];
      }
      if (vertex[0] < overallValues.MinX) {
        overallValues.MinX = vertex[0];
      }
      if (vertex[1] > overallValues.MaxY) {
        overallValues.MaxY = vertex[1];
      }
      if (vertex[1] < overallValues.MinY) {
        overallValues.MinY = vertex[1];
      }
    }
  });

  RecCord.push(object.name)

// print(RecCord)
  RecordList.push(RecCord);
}
}


function createArgs2canvas(RecordListRack: any, overallValues: any) {
  let RecArgCanvas: number[][] = [];

  RecordListRack.map((v: any) => {
    // print(v)
    //get the minimum and maximum x and y values
    let minX = Math.min(v[0][0], v[1][0], v[2][0], v[3][0]);
    let maxX = Math.max(v[0][0], v[1][0], v[2][0], v[3][0]);
    let minY = Math.min(v[0][1], v[1][1], v[2][1], v[3][1]);
    let maxY = Math.max(v[0][1], v[1][1], v[2][1], v[3][1]);

    //normalize the values
    minX = (minX - overallValues.MinX) / (overallValues.MaxX - overallValues.MinX);
    maxX = (maxX - overallValues.MinX) / (overallValues.MaxX - overallValues.MinX);
    minY = (minY - overallValues.MinY) / (overallValues.MaxY - overallValues.MinY);
    maxY = (maxY - overallValues.MinY) / (overallValues.MaxY - overallValues.MinY);

    //get the width and height of the rectangle
    let width =  Math.abs(maxX - minX);
    let height = Math.abs(maxY - minY);

    RecArgCanvas.push([minX, minY, width, height, v[4]])
  });
  return RecArgCanvas;
}

function jsonParse(json: JSON): any {
  let RecordListRack: never[] = [];
  let RecordListAisle: never[] = [];
  let RecordListWall: never[] = [];
  let RecordListCrossAisle: never[] = [];
  let RecordListZone: never[] = [];
  let RecordListElevator: never[] = [];
  let RecordListDepot: never[] = [];

  //javascript object example
  let overallValues ={ "MaxX" : -1000, "MaxY" : -1000, "MinX" : 1000, "MinY" : 1000, }

  // Extract the x, y coordinates of bottom 4 vertices of the 3D object RACK and store them in a list
  json.objects.map((object: any) => {
    // console.log(object.name)
    extractCoordinates("RACK", object, RecordListRack, overallValues);
    extractCoordinates("AISLE", object, RecordListAisle, overallValues);
    extractCoordinates("WALL", object, RecordListWall, overallValues);
    extractCoordinates("CROSSAISLE", object, RecordListCrossAisle, overallValues);
    extractCoordinates("ZONE", object, RecordListZone, overallValues);
    extractCoordinates("ELEVATOR", object, RecordListElevator, overallValues);
    extractCoordinates("DEPOT", object, RecordListDepot, overallValues);

  });

  let drawableObjects = {
    "Rack":createArgs2canvas(RecordListRack, overallValues),
    "Aisle":createArgs2canvas(RecordListAisle, overallValues),
    "Wall":createArgs2canvas(RecordListWall, overallValues),
    "CrossAisle":createArgs2canvas(RecordListCrossAisle, overallValues),
    "Zone":createArgs2canvas(RecordListZone, overallValues),
    "Elevator":createArgs2canvas(RecordListElevator, overallValues),
    "Depot":createArgs2canvas(RecordListDepot, overallValues),
  }

return drawableObjects;

}
export default jsonParse;


