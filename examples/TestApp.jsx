import React, { useState, useEffect } from 'react';
import tips from './tips';
import { sortAs } from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import PivotTableUI from '../src/PivotTableUI';

import '../src/pivottable.css';

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
    rows: ['Payer Gender'],
    cols: ['Party Size'],
    aggregatorName: 'Sum over Sum',
    vals: ['Tip', 'Total Bill'],
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
    const [hideRow, setHideRow] = useState(false);
    const [hideCol, setHideCol] = useState(false);
    const [colSort, setColSort] = useState(false);
    const [totalsLabel, setTotalsLabel] = useState('Totals');
    return (
        <div>
            <div className="row">
                <input type="checkbox" id="hiderow" name="hiderow" checked={hideRow} onChange={() => { setHideRow(!hideRow); setPivotState((ps) => { return { ...ps, hideRowTotals: !hideRow } }) }} />
                <label htmlFor="hiderow">Hide Row Totals</label>
                <input type="checkbox" id="hidecol" name="hidecol" checked={hideCol} onChange={() => { setHideCol(!hideCol); setPivotState((ps) => { return { ...ps, hideColTotals: !hideCol } }) }} />
                <label htmlFor="hidecol">Hide Col Totals</label>
                <input type="checkbox" id="colsort" name="enablecolsort" checked={colSort} onChange={() => { setColSort(!colSort); setPivotState((ps) => { return { ...ps, enableColumnSorting: !colSort } }) }} />
                <label htmlFor="colsort">Enable column Sort</label>
            </div>
            <div className="row">
                <label>
                    Total Label:
                    <input
                        value={totalsLabel} // ...force the input's value to match the state variable...
                        onChange={e => {setTotalsLabel(e.target.value);setPivotState((ps) => { return { ...ps, totalsLabel: e.target.value } }) }} // ... and update the state variable on any edits!
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