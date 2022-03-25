import React, {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
  } from 'react';
  import { styled } from '@superset-ui/core';
  import { ECharts, init } from 'echarts';
  import { MoEchartsPieStylesProps } from '../types';
  
  const Styles = styled.div<MoEchartsPieStylesProps>`
    height: ${({ height }) => height};
    width: ${({ width }) => width};
  `;
  
  function Echart(props: any, ref: any) {
    const { width, height, chartOptions } = props;
  
    const divRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ECharts>();
  
    useImperativeHandle(ref, () => ({
      getEchartInstance: () => chartRef.current,
    }));
  
    useEffect(() => {
      if (!divRef.current) return;
      if (!chartRef.current) {
        chartRef.current = init(divRef.current);
      }
  
      chartRef.current.setOption(chartOptions, true);
    }, [chartOptions]);
  
    useEffect(() => {
      if (chartRef.current) {
        chartRef.current.resize({ width, height });
      }
    }, [width, height]);
    return <Styles ref={divRef} height={height} width={width} />;
  }
  export default forwardRef(Echart);
  