d3.json("relation.json", function (e,dat) {
  if (e) return console.log(e);
  console.log(dat);

  var width  = 2000,
      height = 2000;

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var nodes = [], edges = [], dict = {};

  var cnt = 0;
  for (var row in dat) {
    for (var ent in dat[row]) {
      var tmp = dat[row][ent];
      if (dict[tmp] >= 0) ;
      else {
        nodes.push({ "name": tmp });
        dict[tmp] = cnt++;
      }
    }
  }

  for (var row in dat) {
    edges.push({ "source": dict[dat[row][1]], "target": dict[dat[row][0]] });
    edges.push({ "source": dict[dat[row][2]], "target": dict[dat[row][0]] });
  };

  console.log(nodes)
  console.log(dict);
  console.log(edges);

  // 建力學圖
  var force = d3.layout.force()
                .nodes(nodes)
                .links(edges)
                .size([width, height])
                .linkDistance(200)
                .charge([-300])
                .start();

  // 畫邊
  var svg_edges = svg.selectAll("line")
                     .data(edges)
                     .enter()
                     .append("line")
                     .style("stroke", "#ccc")
                     .style("stroke-width", 1);

  var color = d3.scale.category20();

  // 畫點
  var svg_nodes = svg.selectAll("circle")
                     .data(nodes)
                     .enter()
                     .append("circle")
                     .attr("r", 8)
                     .style("fill", function (d,i) {
                     	  return color(i);
                     	})
                     .call(force.drag);

  // 顯示文字
  var text_dx = -20;
  var text_dy = 20;

  var nodes_text = svg.selectAll(".nodetext")
                      .data(nodes)
                      .enter()
                      .append("text")
                      .attr("class", "nodetext")
                      .attr("dx", text_dx)
                      .attr("dy", text_dy)
                      .text(function (d) {
                        return d.name;
                      });

  // 執行時期
  force.on("tick", function() {
    // 更新邊的位置
    svg_edges.attr("x1", function (d) { return d.source.x; });
    svg_edges.attr("y1", function (d) { return d.source.y; });
    svg_edges.attr("x2", function (d) { return d.target.x; });
    svg_edges.attr("y2", function (d) { return d.target.y; });
    // 更新點的位置
    svg_nodes.attr("cx", function (d) { return d.x; });
    svg_nodes.attr("cy", function (d) { return d.y; });
    // 文字位置
    nodes_text.attr("x", function (d) { return d.x });
    nodes_text.attr("y", function (d) { return d.y; });
  });

});