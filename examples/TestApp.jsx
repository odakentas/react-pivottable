import React, { useState,useEffect } from 'react';
import tips from './tips';
import { sortAs } from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import PivotTableUI from '../src/PivotTableUI';

import '../src/pivottable.css';

function PivotTableUISmartWrapper(props) {
    const [pivotSettings, setPivotSettings] = useState({});
    useEffect(() => {
        setPivotSettings(props)
    
      return () => {
        setPivotSettings({})
      }
    },[])
    
    return <PivotTableUI
        renderers={Object.assign(
            TableRenderers,
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
    rendererName: 'Grouped Column Chart',
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
    //const [pivotState, setPivotState] = useState(defPivotSettings);

    return (
        <div>
            <div className="row">
                <br />

                <PivotTableUISmartWrapper {...defPivotSettings} />
            </div>
        </div>
    )
}

export default TestApp