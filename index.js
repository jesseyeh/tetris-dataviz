// Based on: https://observablehq.com/@d3/variable-color-line
const margin = ({top: 20, right: 20, bottom: 30, left:40});

function createChart(width = 640, height = 480) {
  getData().then((data) => {
    var line = d3.line()
      .curve(d3.curveStep)
      .x(d => x(d.date))
      .y(d => y(d.runningAverage))

    var svg = d3.select("body").append("svg")
      .attr("viewBox", [0, 0, width, height]);

    var x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
      .domain([1, 99])
      .rangeRound([margin.top, height - margin.bottom]);

    var xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove());

    var yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
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
          .attr("y1", margin.top)
          .attr("y2", height - margin.bottom))
      .call(g => g.append("g")
        .selectAll("line")
        .data(y.ticks())
        .join("line")
          .attr("y1", d => 0.5 + y(d))
          .attr("y2", d => 0.5 + y(d))
          .attr("x1", margin.left)
          .attr("x2", width - margin.right));

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
  return Object.assign(d3.csv("https://docs.google.com/spreadsheets/d/10AxlIC8kL_4yTR-_ef3sfCNpc1xwrxyzhiKeXbDHlEI/export?format=csv&id=10AxlIC8kL_4yTR-_ef3sfCNpc1xwrxyzhiKeXbDHlEI&gid=1736085946", (d) => {
    return {
      date            : parseDate(d["Date"]),
      finalPlace      : +d["Final Place"],
      runningAverage  : +d["Running Average"],
      kos             : +d["K.O.s"],
      singles         : +d["Singles"],
      doubles         : +d["Doubles"],
      triples         : +d["Triples"],
      tetrisLineClears: +d["Tetris Line Clears"],
      totalLineClears : +d["Total Line Clears"],
      tSpins          : +d["T-Spins"],
      miniTSpins      : +d["Mini T-Spins"],
      tSpinSingles    : +d["T-Spin Singles"],
      tSpinDoubles    : +d["T-Spin Doubles"],
      tSpinTriples    : +d["T-Spin Triples"],
      totalTSpins     : +d["Total T-Spins"],
      maxCombo        : +d["Max Combo"],
      backToBacks     : +d["Back-to-Backs"],
      allClears       : +d["All Clears"],
    };
  }), {
    y: "Final Place",
    colors: ["black", "green"]
  });
}
