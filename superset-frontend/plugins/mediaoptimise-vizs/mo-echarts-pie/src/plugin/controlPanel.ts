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
import { ControlPanelConfig, ControlPanelsContainerProps, D3_FORMAT_DOCS, D3_FORMAT_OPTIONS, sections, sharedControls } from '@superset-ui/chart-controls';

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
      label: t('Pie Chart Customizations'),
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
            name: 'showTooltip',
            config: {
              type: 'CheckboxControl',
              label: t('Tooltip'),
              renderTrigger: true,
              default: true,
              description: t('Show Tooltip'),
            },
          },
        ],
        [
          {
            name: 'highlight',
            config: {
              type: 'CheckboxControl',
              label: t('Highlighted Text'),
              renderTrigger: true,
              default: true,
              description: t('Display Highlighted text Pie Chart Categories on mouse hover'),
            },
          },
        ],
        [
          {
            name: 'showTitle',
            config: {
              type: 'CheckboxControl',
              label: t('Title'),
              renderTrigger: true,
              default: true,
              description: t('Show Title'),
            },
          },
        ],
        [
          {
            name: 'chartTitle',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('Title'),
              description: t('Pie Chart Title'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showTitle?.value),
            },
          },
        ],
        [
          {
            name: 'chartSubTitle',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              // ^ this makes it apply instantaneously, without triggering a "run query" button
              label: t('SubTitle'),
              description: t('Pie Chart SubTitle'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showTitle?.value),
            },
          },
        ],

        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display the labels.'),
            },
          },
        ],
        [
          {
            name: 'labels_outside',
            config: {
              type: 'CheckboxControl',
              label: t('Put labels outside'),
              default: true,
              renderTrigger: true,
              description: t('Put the labels outside of the pie?'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.show_labels?.value),
            },
          },
        ],
        [
          {
            name: 'label_line',
            config: {
              type: 'CheckboxControl',
              label: t('Label Line'),
              default: true,
              renderTrigger: true,
              description: t(
                'Draw line from Pie to label when labels outside?',
              ),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.show_labels?.value),
            },
          },
        ],
        [
          {
            name: 'labelPosition',
            config: {
              type: 'SelectControl',
              label: t('Label Position'),
              default: 'outside',
              choices: [
                ['center', 'Center'],
                ['outside', 'Outside'],
                ['inside', ' Inside'],
              ],
              renderTrigger: true,
              description: t('Label position'),
            },
          },
        ],
        [
          {
            name: 'label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: 'key_value',
              renderTrigger: true,
              choices: [
                ['key', 'Category Name'],
                ['value', 'Value'],
                ['percent', 'Percentage'],
                ['key_value', 'Category and Value'],
                ['key_percent', 'Category and Percentage'],
                ['key_value_percent', 'Category, Value and Percentage'],
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
        [
          {
            name: 'legendHorizontal',
            config: {
              type: 'SelectControl',
              label: t('Legend Horizontal Position'),
              default: 'right',
              renderTrigger: true,
              choices: [
                ['left', 'LEFT'],
                ['center', 'CENTER'],
                ['right', 'RIGHT']
              ],
              description: t('Legend Horizontal alignment'),
            },
          },
        ],
        [
          {
            name: 'legendVertical',
            config: {
              type: 'SelectControl',
              label: t('Legend Vertical Position'),
              default: 'top',
              renderTrigger: true,
              choices: [
                ['top', 'TOP'],
                ['middle', 'MIDDLE'],
                ['bottom', 'BOTTOM']
              ],
              description: t('Legend Vertical alignment'),
            },
          },
        ],
        [
          {
            name: 'legendOrientation',
            config: {
              type: 'SelectControl',
              label: t('Legend Orientation'),
              default: 'vertical',
              renderTrigger: true,
              choices: [
                ['vertical', 'Verical'],
                ['horizontal', 'horizontal'],
              ],
              description: t('Legend Horizontal alignment'),
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
        // eslint-disable-next-line react/jsx-key
        //[<h1 className="section-header">{t('Pie shape')}</h1>],
        [
          {
            name: 'outerRadius',
            config: {
              type: 'SliderControl',
              label: t('Outer Radius'),
              renderTrigger: true,
              min: 10,
              max: 100,
              step: 1,
              default: 70,
              description: t('Outer edge of Pie chart'),
            },
          },
        ],
        [
          {
            name: 'donut',
            config: {
              type: 'CheckboxControl',
              label: t('Donut'),
              default: false,
              renderTrigger: true,
              description: t('Do you want a donut or a pie?'),
            },
          },
        ],
        [
          {
            name: 'innerRadius',
            config: {
              type: 'SliderControl',
              label: t('Inner Radius'),
              renderTrigger: true,
              min: 0,
              max: 100,
              step: 1,
              default: 50,
              description: t('Inner radius of donut hole'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.donut?.value),
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
