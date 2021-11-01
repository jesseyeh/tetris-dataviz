// Based on: https://observablehq.com/@d3/variable-color-line
function createChart(width = 640, height = 480) {
  getData().then((data) => {
    var line = d3.line()
      .curve(d3.curveStep)
      .x(d => x(d.date))
      .y(d => y(d.avg))

    var svg = d3.select("body").append("svg")
      .attr("viewBox", [0, 0, width, height]);

    var x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([0, width]);

    var y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.avg))
      .rangeRound([0, height]);

    var xAxis = g => g
      .attr("transform", `translate(0,${height - 20})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove());

    var yAxis = g => g
      .attr("transform", `translate(${20},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());

    var grid = g => g
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call(g => g.append("g")
        .selectAll("line")
        .data(x.ticks())
        .join("line")
          .attr("x1", d => 0.5 + x(d))
          .attr("x2", d => 0.5 + x(d))
          .attr("y1", 0)
          .attr("y2", height))
      .call(g => g.append("g")
        .selectAll("line")
        .data(y.ticks())
        .join("line")
          .attr("y1", d => 0.5 + y(d))
          .attr("y2", d => 0.5 + y(d))
          .attr("x1", 0)
          .attr("x2", width));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    svg.append("g")
      .call(grid);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", line);

    return svg.node();
  });
}

function getData() {
  const parseDate = d3.timeParse("%m/%d/%Y");
  return Object.assign(d3.csv("data.csv", (d) => {
    return {
      date: parseDate(d["Date"]),
      place: +d["Final Place"],
      avg: +d["Running Average"],
      kos: +d["K.O.s"],
    };
  }), {
    y: "Final Place",
    colors: ["black", "green"]
  });
}
