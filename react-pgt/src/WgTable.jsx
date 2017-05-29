import React from 'react';
import './WgTable.css';

import hashObject from 'hash-object';

function WgTable(props) {
    return (
	<table className="WgTable">
	  <thead>
	    <tr>
	      {
		  props.columnsRendering.map( (column, cIndex) => {
		      return (
			  <th
			     key={cIndex}
			     className={"col-"+(cIndex+1)}
			     >	
			    {column.heading}
			  </th>
		      );
		  })
	      }
	</tr>
	    </thead>
	    <tbody>
	    {
		props.rowRenderingData.map( (rowData, rIndex) => {
		    let rowKey = rowData.uid !== undefined ? rowData.uid : rIndex;
		    if(props.hashRowDataToKey){
			rowKey = hashObject(rowData);
		    }
		    const rowIsSelected = rIndex === props.selectedRowIndex;
		    return (
			<tr className={rowIsSelected ? "selected" : null}
			    key={rowKey}
			    onClick={props.onRowSelectedChange.bind(null, rIndex)}
			    >
			  {
			      props.columnsRendering.map( (column, cIndex) => {
				  return (
				      <td
					 key={cIndex}
					 className={"col-"+(cIndex+1)}
					 >
					{column.renderCellContents(rowData, rIndex, rowIsSelected)}
				      </td>
				  );
			      })
			  }
			</tr>);
		})
	    }
	</tbody>
	    </table>
    );
}




export default WgTable;
