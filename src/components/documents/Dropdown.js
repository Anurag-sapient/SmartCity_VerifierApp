import React from "react";

function Dropdown(props) {
    return <>
        <select onChange={(e) => props.approverChangeHandler(e)}>
            {props.options &&
                props.options.map(o =>
                    <option key={o.id} value={o.id}>{o.type}</option>)
            }
        </select>
    </>;
}
export default Dropdown;