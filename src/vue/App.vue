<template>
    <div class="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100 text-sans px-4 sm:px-0">
        <h1 class="text-2xl sm:text-3xl mb-12 text-gray-700">Interactive Bitcoin Price Graph</h1>
        <div class="w-full max-w-2xl p-4 sm:p-8 shadow-2xl rounded-lg bg-white">
            <div class="flex justify-center mb-8">
                <el-date-picker
                  v-model="range"
                  :picker-options="{
                    disabledDate(time) {
                      return inRange(time);
                    }
                  }"
                  :clearable="false"
                  unlink-panels
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  @change="updateDataRange">
                </el-date-picker>
            </div>
            <div class="w-full h-full" ref="container">
                <svg :width="width + margin.left + margin.right" :height="height + margin.top + margin.bottom">
                    <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
                        <!-- X Axis -->
                        <g :transform="'translate(0,' + height + ')'" ref="xAxis"></g>

                        <!-- Y Axis -->
                        <g ref="yAxis"></g>

                        <!-- Line -->
                        <path fill="none" stroke="#f7931a" stroke-width="2" :d="line"></path>
                    </g>
                </svg>
            </div>
        </div>
        <p class="mt-12 text-gray-500 text-xs">
            <a href="https://datavis.co" target="_blank" class="underline hover:text-yellow-500">#100DaysOfDataVis</a>
            <span> by </span>
            <a href="https://twitter.com/madebycrevans" target="_blank" class="underline hover:text-blue-400">@MadeByCrevans</a>
        </p>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as d3 from "d3";

export default Vue.extend({
    data() {
        return {
            margin: {
                top: 10,
                right: 0,
                bottom: 30,
                left: 50
            },
            width: 0,
            height: 300,
            xAxis: null,
            yAxis: null,
            line: '',
            lineFunction: null,
            dataOg: [],
            data: [],
            rangeOg: [],
            range: [],
            pickerOptions: {
                disabledDate(time) {
                    console.log(this)
                    return this.inRange(time);
                }
            }
        };
    },
    methods: {
        formatData() {
            this.data = this.data.map(d => ({
                date: d3.timeParse("%Y-%m-%d")(d.date),
                value: d.value
            }));

            this.range = [this.data[0].date, this.data[this.data.length -1].date]
        },
        createLineFunction() {
            let data = this.data;

            this.xAxis = d3.scaleTime()
              .domain(d3.extent(data, (d) => d.date))
              .range([0, this.width]);

            this.yAxis = d3.scaleLinear()
              .domain([0, d3.max(data, (d) => +d.value)])
              .range([this.height, 0]);

            this.lineFunction = d3.line()
              .x((d) => this.xAxis(d.date))
              .y((d) => this.yAxis(d.value));
        },
        generateLine() {
            this.line = this.lineFunction(this.data);
        },
        generateXAxis() {
            d3.select(this.$refs.xAxis).call(d3.axisBottom(this.xAxis));
        },
        generateYAxis() {
            d3.select(this.$refs.yAxis).call(d3.axisLeft(this.yAxis));
        },
        updateDataRange() {
            this.data = this.dataOg.filter(d => (new Date(d.date) >= this.range[0] && new Date(d.date) <= this.range[1]));
            this.formatData();
            this.createLineFunction();
            this.generateLine();
            this.generateXAxis();
            this.generateYAxis();
        },
        inRange(time) {
            return time.getTime() <= this.rangeOg[0] - 86400000 || time.getTime() > this.rangeOg[1];
        }
    },
    mounted() {
        this.width = this.$refs.container.clientWidth - this.margin.left - this.margin.right;

        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then((data) => {
            this.dataOg = data;
            this.data = data;
        }).then(() => {
            this.formatData();
            this.rangeOg = this.range;
            this.createLineFunction();
        }).then(() => {
            this.generateLine();
            this.generateXAxis();
            this.generateYAxis();
        });
    }
});
</script>
