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
import {
  ChartProps,
  TimeseriesDataRecord,
  formatNumber,
  CategoricalColorNamespace,
} from '@superset-ui/core';

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your SupersetPluginChartHelloWorld.tsx file, but
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

  const {
    cols,
    invertBars,
    showLegend,
    seriesLabelsShow,
    seriesLabelsPosition,
    seriesCategoriesShow,
    seriesLabelsFormat,
    numberFormat,
    colorScheme,
    showTooltip,
    stackSeries,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    legendOrientation,
  } = formData;

  const data = queriesData[0].data as TimeseriesDataRecord[];

  const chartOptions = buildEchartOptions(
    data,
    cols,
    invertBars,
    showLegend,
    seriesLabelsShow,
    seriesLabelsPosition,
    seriesCategoriesShow,
    numberFormat,
    seriesLabelsFormat,
    colorScheme,
    showTooltip,
    stackSeries,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    legendOrientation
  );

  return {
    width,
    height,
    data,
    chartOptions,
  };
}

function buildEchartOptions(
  data: TimeseriesDataRecord[],
  cols: string,
  invertBars: boolean,
  showLegend: boolean,
  seriesLabelsShow: boolean,
  seriesLabelsPosition: string,
  seriesCategoriesShow: boolean,
  numberFormat: string,
  seriesLabelsFormat: string,
  colorScheme: string,
  showTooltip: boolean,
  stackSeries: boolean,
  marginTop: string,
  marginBottom: string,
  marginRight: string,
  marginLeft: string,
  legendOrientation: string,
) {
  const colorScale = CategoricalColorNamespace.getScale(colorScheme);

  //  Create Label Values Formatter
  const labelFormatter = (params: any) => {
    const { seriesName, name: categoryName } = params;
    const value = params.value[seriesName];
    const formattedValue = formatNumber(numberFormat, value);
    switch (seriesLabelsFormat) {
      case 'seriesNameCategoryValue':
        return `${seriesName} - ${categoryName} : ${formattedValue}`;
      case 'seriesNameValue':
        return `${seriesName} : ${formattedValue}`;
      case 'categoryValue':
        return `${categoryName} : ${formattedValue}`;
      default:
        return formattedValue;
    }
  };
  //  Get Series Dimensions
  const keys = data.map(v => Object.keys(v));

  const keysSets = new Set();

  keys.forEach(el => {
    el.forEach(k => keysSets.add(k));
  });

  const dimensions = Array.from(keysSets);

  //  Configure Axis

  const yAxisAsCategories = invertBars
    ? { type: 'category', show: seriesCategoriesShow }
    : {};
  const xAxisAsCategories = !invertBars
    ? { type: 'category', show: seriesCategoriesShow }
    : {};

  const axisEncoding = invertBars
    ? {
        y: cols,
        x: null,
      }
    : {
        x: cols,
        y: null,
      };
  const stackSettings = stackSeries? {stack: 'totals'}: {};

  const singleSeriesConfig = {
    name: {},
    type: 'bar',
    encode: {
      ...axisEncoding,
    },
    label: {
      show: seriesLabelsShow,
      position: seriesLabelsPosition,
      formatter: labelFormatter,
    },
    itemStyle: {
      color: 'auto',
    },
    ...stackSettings
  };


  const allSeriesConfigs: any = [];
  dimensions.forEach(dim => {
    if (dim !== cols) {
      const setValueAxisEncoding = invertBars
        ? { ...singleSeriesConfig.encode, x: dim }
        : { ...singleSeriesConfig.encode, y: dim };
      allSeriesConfigs.push({
        ...singleSeriesConfig,
        name: dim as string,
        itemStyle: {
          color: colorScale(dim as string),
        },
        encode: { ...setValueAxisEncoding },
      });
    }
  });

  let legendOptions = legendOrientationBuilder(legendOrientation);

  const chartOptions = {
    dataset: {
      dimensions,
      source: data,
    },
    legend: { 
              show: showLegend ,
              ...legendOptions
            }, 
    tooltip: { 
      show: showTooltip,
      valueFormatter: (value:any) => formatNumber(numberFormat, value)
     },
    yAxis: { ...yAxisAsCategories },
    xAxis: { ...xAxisAsCategories },
    series: allSeriesConfigs,
    grid: {
      top: marginTop,
      bottom: marginBottom,
      right: marginRight,
      left: marginLeft
    },
  };

  return chartOptions;
}

function legendOrientationBuilder(legendOrientation: string){

  const legend = {
    orient: ['top', 'bottom'].includes(legendOrientation) 
            ? 'horizontal'
            : 'vertical',
  }
  let options = {}

  switch (legendOrientation) {
    case 'left':
      options = {'left': 0 };
      break;
    case 'bottom':
      options = {'bottom': 0 };
      break;
    case 'top':
    case 'right':
    default:
      options = {
        'right': 0,
        'top': 0
      }
      break;
  }

  return {...legend, ...options}

  
}
