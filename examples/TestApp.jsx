import React, { useState, useEffect } from 'react';
import tips from './tips';
import { sortAs } from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import PivotTableUI from '../src/PivotTableUI';

import '../src/pivottable.css';
import '../src/grouping.css';

import createPlotlyRenderers from '../src/PlotlyRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(window.Plotly);

function PivotTableUISmartWrapper(props) {
    const [pivotSettings, setPivotSettings] = useState({});
    useEffect(() => {
        setPivotSettings(props)

        return () => {
            setPivotSettings({})
        }
    }, [props])

    return <PivotTableUI
        renderers={Object.assign(
            {},
            TableRenderers,
            createPlotlyRenderers(Plot)
        )}
        //{...props}
        {...pivotSettings}
        onChange={s => setPivotSettings(s)}
    />

}
const defPivotSettings = {
    data: tips,
    rows: ['Payer Gender','Day of Week'],
    cols: ['Party Size'],
    hideRowTotals:false,
    hideColTotals:false,
    enableColumnSorting:false,
    aggregatorName: 'Sum',
    vals: ['Total Bill'],
    rendererName: 'Table Heatmap',
    sorters: {
        Meal: sortAs(['Lunch', 'Dinner']),
        'Day of Week': sortAs([
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ])
    },
    plotlyOptions: { width: 900, height: 500 },
    plotlyConfig: {},
    tableOptions: {
        clickCallback: function (e, value, filters, pivotData) {
            var names = [];
            pivotData.forEachMatchingRecord(filters, function (
                record
            ) {
                names.push(record.Meal);
            });
            alert(names.join('\n'));
        }
    }
}

function TestApp() {
    const [pivotState, setPivotState] = useState(defPivotSettings);
    const [colSort, setColSort] = useState(false);
    const [totalsLabel, setTotalsLabel] = useState('Totals');

    function onGrouping({ target: { name, checked } }) {
        setPivotState(ps => { return { ...ps, [name]: checked } })
    }

    const onCheck = ({ target: { name, checked } }) => {
        setPivotState(ps => { return { ...ps, [name]: checked } })
    };

    return (
        <div>
            <div className="row">
                <Checkbox onChange={onCheck} name="hideRowTotals" checked={pivotState.hideRowTotals} />
                <Checkbox onChange={onCheck} name="hideColTotals" checked={pivotState.hideColTotals} />
                <Checkbox onChange={onCheck} name="enableColumnSorting" checked={pivotState.enableColumnSorting} />
                <Grouping
                    onChange={onGrouping}
                    rendererName={pivotState.rendererName}
                />
            </div>
            <div className="row">
                <label>
                    Total Label:
                    <input
                        value={totalsLabel} // ...force the input's value to match the state variable...
                        onChange={e => { setTotalsLabel(e.target.value); setPivotState((ps) => { return { ...ps, totalsLabel: e.target.value } }) }} // ... and update the state variable on any edits!
                    />
                </label>

            </div>
            <div className="row">
                <br />

                <PivotTableUISmartWrapper {...pivotState} />
            </div>
        </div>
    )
}

export default TestApp

function Checkbox(props) {
    return <label className=" checkbox-inline" style={{ textTransform: "capitalize" }}>
        <input type="checkbox"
            // onChange={e => props.update(e, props.name)}
            name={props.name}
            onChange={props.onChange}
            checked={props.checked}
            defaultChecked={!props.unchecked}></input> {props.name.replace(/([A-Z])/g, " $1")}
    </label>
}
function Grouping(props) {
    const [disabled, setDisabled] = useState(true);
    const visible = !!props.rendererName && props.rendererName.startsWith('Table');
    if (!visible)
        return <div></div>;
    const onChange = e => {
        setDisabled(!e.target.checked);
        props.onChange(e);
    };
    return <div className="row">
        <div className="col-md-2">
            <Checkbox onChange={onChange} name="grouping" unchecked={true} />
        </div>
        <fieldset className="col-md-6" disabled={disabled}>
            <Checkbox onChange={props.onChange} name="compactRows" />
            <Checkbox onChange={props.onChange} name="rowGroupBefore" />
            <Checkbox onChange={props.onChange} name="colGroupBefore" unchecked={true} />
        </fieldset>
        <br />
        <br />
    </div>
}