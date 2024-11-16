import * as d3 from "d3";



export default function Nodes(){
    let width = 300;
    let height = 300;
    let nodes = d3.range(91).map(function(val) {
        return {
          radius: Math.floor(Math.random() * 8) + 7,
          id: val,
          degree: 0,
          x: Math.random() * width,
          y: Math.random() * height
        };
      });

    return (
        <p></p>
    );
}