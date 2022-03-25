/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChartProps, DataRecordValue, TimeseriesDataRecord, formatNumber, CategoricalColorNamespace } from '@superset-ui/core';

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your MoEchartsPie.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queriesData } = chartProps;
  const { chartTitle, 
          chartSubTitle, 
          showLegend, 
          showTitle,
          outerRadius,
          donut,
          innerRadius,
          numberFormat,
          colorScheme,
          showLabels,
          labelsOutside,
          labelLine,
          labelPosition,
          showTooltip,
          highlight,
          labelType,
          legendVertical,
          legendHorizontal, 
          legendOrientation,
          marginTop,
          marginBottom,
          marginRight,
          marginLeft,
           } = formData;

  const data = queriesData[0].data as TimeseriesDataRecord[];

  const chartOptions = buildPieChart(
    data,
    chartTitle,
    chartSubTitle,
    showLegend,
    showTitle,
    outerRadius,
    innerRadius,
    donut,
    numberFormat,
    colorScheme,
    showLabels,
    labelsOutside,
    labelLine,
    labelPosition,
    showTooltip,
    highlight,
    labelType,
    legendVertical,
    legendHorizontal, 
    legendOrientation,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
  );

  return {
    width,
    height,
    data,
    // and now your control data, manipulated as needed, and passed through as props!
    chartOptions
  };
}

function buildPieChart(data: TimeseriesDataRecord[],
            chartTitle: string, 
            chartSubTitle: string, 
            showLegend: boolean,
            showTitle: boolean,
            outerRadius: number,
            innerRadius: number,
            donut: boolean,
            numberFormat: string,
            colorScheme: string,
            showLabels: boolean,
            labelsOutside: boolean,
            labelLine: boolean,
            labelPosition: string,
            showTooltip: boolean,
            highlight: boolean,
            labelType: string,
            legendVertical: string,
            legendHorizontal: string, 
            legendOrientation: string,
            marginTop: string,
            marginBottom: string,
            marginRight: string,
            marginLeft: string,){

  // Transform Data into nameValue fields 
  const nameValuesChartData: { name: any; value: DataRecordValue; }[] = transformSeriesData(data);

  const formatter = (params: any) =>
    {
      return formatPieLabel(params, numberFormat, labelType);
    };

  const colorScale = CategoricalColorNamespace.getScale(colorScheme);

  const chartOptions = {
    title: {
      show: showTitle,
      text: chartTitle,
      subtext: chartSubTitle,
      left: "center",
    },
    color: colorScale.colors,
    tooltip: {
      show: showTooltip,
      trigger: "item",
      formatter,
      valueFormatter: (value: any) => formatNumber(numberFormat, value),
    },
    legend: {
      show: showLegend,
      orient: legendOrientation,
      left: legendHorizontal,
      top: legendVertical
    },
    series: [
      {
        type: "pie",
        radius: donut
          ? [innerRadius + "%", outerRadius + "%"]
          : outerRadius + "%",
        data: nameValuesChartData,
        emphasis: {
          //disabled: highlight? false: true,
          label: {
            show: highlight,
            fontSize: '18',
            fontWeight: 'bold',
            formatter
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: labelsOutside && labelLine ? { show: true } : { show: false },
        label: labelsOutside
            ? {
                show: showLabels,
                formatter,
                position: labelPosition,
                alignTo: 'none',
                bleedMargin: 5,
              }
            : {
                show: showLabels,
                position: labelPosition,
                formatter
              },
        top: marginTop,
        bottom: marginBottom,
        right: marginRight,
        left: marginLeft
      },
    ]
  };

  return chartOptions;
}

function formatPieLabel(params: any, numberFormat: string, labelType: string) {
  const { name, value, percent } = params;
  const formattedValue = formatNumber(numberFormat, value);
  const formattedPercent = percent + '%';
  switch (labelType) {
    case 'key':
      return name;
    case 'value':
      return formattedValue;
    case 'percent':
      return formattedPercent;
    case 'key_value':
      return `${name}: ${formattedValue}`;
    case 'key_value_percent':
      return `${name}: ${formattedValue} (${formattedPercent})`;
    case 'key_percent':
      return `${name}: ${formattedPercent}`;
    default:
      return name;
  }
}

// Transform Data into nameValue fields 
function transformSeriesData(data: TimeseriesDataRecord[]) {
  
  const keys = data.map((v) => Object.keys(v));

  const keysSets = new Set();

  keys.forEach((el) => {
    el.forEach((k) => keysSets.add(k));
  });

  const nameValuesChartData: { name: any; value: DataRecordValue; }[] = [];

  data.forEach((d) => {
    keysSets.forEach((k: any) => {
      nameValuesChartData.push({ name: k, value: d[k] });
    });
  });

  return nameValuesChartData;
}


