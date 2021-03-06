import React from 'react';

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

		    const rowIsSelected = rIndex === props.selectedRowIndex;
		    let rowClass = rowIsSelected ? "selected" : "";
		    if(props.rowClassingFn){
			rowClass += " " + props.rowClassingFn(rowData, rIndex).className;
		    }

		    return (
			<tr className={rowClass}
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
