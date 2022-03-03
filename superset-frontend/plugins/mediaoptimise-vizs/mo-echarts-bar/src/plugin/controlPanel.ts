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
import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  /**
    * The control panel is split into two tabs: "Query" and
    * "Chart Options". The controls that define the inputs to
    * the chart data request, such as columns and metrics, usually
    * reside within "Query", while controls that affect the visual
    * appearance or functionality of the chart are under the
    * "Chart Options" section.
    *
    * There are several predefined controls that can be used.
    * Some examples:
    * - groupby: columns to group by (tranlated to GROUP BY statement)
    * - series: same as groupby, but single selection.
    * - metrics: multiple metrics (translated to aggregate expression)
    * - metric: sane as metrics, but single selection
    * - adhoc_filters: filters (translated to WHERE or HAVING
    *   depending on filter type)
    * - row_limit: maximum number of rows (translated to LIMIT statement)
    *
    * If a control panel has both a `series` and `groupby` control, and
    * the user has chosen `col1` as the value for the `series` control,
    * and `col2` and `col3` as values for the `groupby` control,
    * the resulting query will contain three `groupby` columns. This is because
    * we considered `series` control a `groupby` query field and its value
    * will automatically append the `groupby` field when the query is generated.
    *
    * It is also possible to define custom controls by importing the
    * necessary dependencies and overriding the default parameters, which
    * can then be placed in the `controlSetRows` section
    * of the `Query` section instead of a predefined control.
    *
    * import { validateNonEmpty } from '@superset-ui/core';
    * import {
    *   sharedControls,
    *   ControlConfig,
    *   ControlPanelConfig,
    * } from '@superset-ui/chart-controls';
    *
    * const myControl: ControlConfig<'SelectControl'> = {
    *   name: 'secondary_entity',
    *   config: {
    *     ...sharedControls.entity,
    *     type: 'SelectControl',
    *     label: t('Secondary Entity'),
    *     mapStateToProps: state => ({
    *       sharedControls.columnChoices(state.datasource)
    *       .columns.filter(c => c.groupby)
    *     })
    *     validators: [validateNonEmpty],
    *   },
    * }
    *
    * In addition to the basic drop down control, there are several predefined
    * control types (can be set via the `type` property) that can be used. Some
    * commonly used examples:
    * - SelectControl: Dropdown to select single or multiple values,
        usually columns
    * - MetricsControl: Dropdown to select metrics, triggering a modal
        to define Metric details
    * - AdhocFilterControl: Control to choose filters
    * - CheckboxControl: A checkbox for choosing true/false values
    * - SliderControl: A slider with min/max values
    * - TextControl: Control for text data
    *
    * For more control input types, check out the `incubator-superset` repo
    * and open this file: superset-frontend/src/explore/components/controls/index.js
    *
    * To ensure all controls have been filled out correctly, the following
    * validators are provided
    * by the `@superset-ui/core/lib/validator`:
    * - validateNonEmpty: must have at least one value
    * - validateInteger: must be an integer value
    * - validateNumber: must be an intger or decimal value
    */

  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'cols',
            config: {
              ...sharedControls.series,
              label: t('Series'),
              description: t('Series to use for Bar Chart Categories'),
            },
          },
        ],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              // it's possible to add validators to controls if
              // certain selections/types need to be enforced
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: sharedControls.row_limit,
          },
        ],
      ],
    },
    {
      label: t('Customize Chart'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [
          {
            name: 'showLegend',
            config: {
              type: 'CheckboxControl',
              label: t('Legend'),
              renderTrigger: true,
              default: true,
              description: t('Show Legend'),
            },
          },
        ],
        [
          {
            name: 'invert_bars',
            config: {
              type: 'CheckboxControl',
              label: t('Invert Bars'),
              renderTrigger: true,
              default: false,
              description: t('Transpose X / Y axis'),
            },
          },
        ],
        [
          {
            name: 'showTooltip',
            config: {
              type: 'CheckboxControl',
              label: t('Show Tooltip'),
              renderTrigger: true,
              default: true,
              description: t('Enable Tooltip on the chart'),
            },
          },
        ],
        [
          {
            name: 'stackSeries',
            config: {
              type: 'CheckboxControl',
              label: t('Stack'),
              renderTrigger: true,
              default: false,
              description: t('Stack Bars'),
            },
          },
        ],
        [
          {
            name: 'seriesLabelsShow',
            config: {
              type: 'CheckboxControl',
              label: t('Label'),
              renderTrigger: true,
              default: false,
              description: t('Enable Series Label'),
            },
          },
        ],
        [
          {
            name: 'seriesCategoriesShow',
            config: {
              type: 'CheckboxControl',
              label: t('Show Categories Axis'),
              renderTrigger: true,
              default: true,
              description: t('Show Categories Axis'),
            },
          },
        ],
        [
          {
            name: 'seriesLabelsPosition',
            config: {
              type: 'SelectControl',
              label: t('Label Position'),
              default: 'top',
              choices: [
                // [value, label]
                ['top', 'Top'],
                ['inside', 'Inside'],
                ['bottom', 'Bottom'],
                ['left', 'Left'],
                ['right', 'Right'],
                ['insideLeft', 'Inside Left'],
                ['insideRight', 'Inside Right'],
                ['insideTop', 'Inside Top'],
                ['insideBottom', 'Inside Bottom'],
                ['insideTopLeft', 'Inside Top Left'],
                ['insideBottomLeft', 'Inside Bottom Left'],
                ['insideTopRight', 'Inside Top Right'],
                ['insideBottomRight', 'Inside Bottom Right'],
              ],
              renderTrigger: true,
              description: t('Series Label Position compared to the bar'),
            },
          },
        ],
        [
          {
            name: 'seriesLabelsFormat',
            config: {
              type: 'SelectControl',
              label: t('Label Custom Display'),
              default: 'default',
              choices: [
                // [value, label]
                ['default', 'Default'],
                ['seriesNameCategoryValue', 'Series Name - Category : Value'],
                ['categoryValue', ' Category : Value'],
                ['seriesNameValue', ' SeriesName : Value'],
              ],
              renderTrigger: true,
              description: t('Series Label Custom Display format'),
            },
          },
        ],
        [
          {
            name: 'legendOrientation',
            config: {
              type: 'SelectControl',
              label: t('Legend Orientation'),
              default: 'top',
              choices: [
                ['top', 'Top'],
                ['bottom', 'Bottom'],
                ['left', 'Left'],
                ['right', 'Right'],
              ],
              renderTrigger: true,
              description: t('Legend Position'),
            },
          },
        ],
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              label: t('Label Value Format'),
              default: 'SMART_NUMBER',
              choices: D3_FORMAT_OPTIONS,
              renderTrigger: true,
              description: D3_FORMAT_DOCS,
            },
          },
        ],
        [
          {
            name: 'marginTop',
            config: {
              type: 'TextControl',
              default: '5%',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Margin Top'),
              description: t("Margin Top in % or px or 'top', 'middle', or 'bottom'"),
            },
          },
        ],
        [
          {
            name: 'marginBottom',
            config: {
              type: 'TextControl',
              default: '5%',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Margin Bottom'),
              description: t('Margin Bottom in %'),
            },
          },
        ],
        [
          {
            name: 'marginRight',
            config: {
              type: 'TextControl',
              default: '5%',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Margin Right'),
              description: t('Margin Right in %, or px (10% or 20)'),
            },
          },
        ],
        [
          {
            name: 'marginLeft',
            config: {
              type: 'TextControl',
              default: '5%',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Margin Left'),
              description: t("Margin LEFT in %,px or 'left', 'center', or 'right'"),
            },
          },
        ],
      ],
    },
  ],
};
export default config;
