import { Component } from '@angular/core';
import { AppService } from './app.service';
import * as d3 from 'd3' ;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task-frontend';
  backendData: any =[{}];
  isSelected: boolean = false;
  filteredData: any;
  selectedCountry: Object[] = [];
  transformedData: { year: number; value: number }[] = [];
  graphflag: boolean = false;
  transformData() {
    this.transformedData = Object.keys(this.filteredData)
      .filter(year => !isNaN(Number(year)))
      .map(year => ({ year: Number(year), value: parseFloat(this.filteredData[year]) }));
  }
  ChangeCountry(){
    const foundRecord = this.backendData.find((s: { Country_Name: Object[]; }) => s.Country_Name === this.selectedCountry);
    if(foundRecord){
    this.filteredData = { ...foundRecord };
    delete this.filteredData['Country_Code'];
    delete this.filteredData['Country_Name'];
    delete this.filteredData['Indicator_Name'];
    delete this.filteredData['Indicator_Code'];
    this.transformData();
    console.log(this.transformedData);
    console.log(this.transformedData)
    console.log(this.filteredData);
    }
    
    this.GenerateGraph();
  }
  
  
  GenerateGraph(){

    if(this.graphflag)
    {
      const svg = d3.select('#line-graph');
     svg.selectAll('*').remove();
    }
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
    .range([0, width]);

    const y = d3.scaleLinear()
    .range([height, 0]);


    const svg = d3.select('#line-graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    this.graphflag = true;

    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
  

    x.domain(d3.extent(this.transformedData, (d: { year: number }) => d.year) as [number, number]);
    y.domain([0,100])

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", "14px")
    .attr("fill", "#777")
    .call(d3.axisBottom(x).ticks((10)))
    

    svg.append("g")
    .style("font-size", "14px")
    .attr("fill", "#777")
    .call(d3.axisLeft(y))

    const line = d3.line<{ year: number, value: number }>()
    .x(d => x(d.year))
    .y(d => y(d.value));

    svg.append("path")
    .datum(this.transformedData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line);
    //X axis grid
    svg.selectAll("xGrid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke","#e0e0e0")
    .attr("stroke-width", .5);
    //Y axis grid
    svg.selectAll("yGrid")
    .data(y.ticks().slice(1))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke","#e0e0e0")
    .attr("stroke-width", .5);

    // Add X-axis label
    svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("font-size", "14px")
    .style("fill", "#777")
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .text("Value");

   // Add X-axis label
    svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.top + 10) 
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#777")
    .style("font-family", "sans-serif")
    .text("Year");

    const Circle = svg.append('circle')
      .attr('r', 0)
      .attr('fill', 'steelblue')
      .style('stroke', 'white')
      .attr('opacity', 0.7)
      .style('pointer-events', 'none');
      
      const listeningRect = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all');

      const onMouseMove = (event: MouseEvent) => {
        const [xCoord] = d3.pointer(event);
        // Calculate the corresponding data point
        // Replace this with your data calculation logic
        
        const x0 = x.invert(xCoord);
        const bisectYear = d3.bisector((d: { year: number }) => d.year).left;
        const i = bisectYear(this.transformedData, x0, 1);
        const d0 = this.transformedData[i - 1];
        const d1 = this.transformedData[i];
        const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
  
        // Get position for the Circle
        const xPos = x(d.year);
        const yPos = y(d.value);
  
        // Update and show the Circle
        Circle.attr('cx', xPos)
          .attr('cy', yPos)
          .attr('r', 5);
  
        // Show the tooltip
        const tooltip = d3.select('#tooltip');
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 30}px`)
          .html(`<strong>Year:</strong> ${d.year} <br> <strong>Value:</strong> ${d.value}`);
      };
  
      const onMouseOut = (event: MouseEvent) => {
        // Hide the Circle and tooltip on mouseout
        Circle.attr('r', 0);
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'none');
      };
  
      listeningRect
        .data(this.transformedData)
        .on('mousemove', onMouseMove)
        .on('mouseout', onMouseOut);
  }
  constructor(private appService:  AppService){}

  ngOnInit(): void{
    debugger;
    this.appService.showData().subscribe((data) =>{
      this.backendData = data;
    })
  }
}
