import React from 'react';
import './WgTable.css';

function WgTable(props) {
    return (
	<table className="WgTable">
	  <thead>
	    <tr>
	      {
		  props.columns.map( (column, cIndex) => {
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
		    return (
			<tr className={rIndex === props.selectedRowIndex ? "selected" : null}
			    key={rowData.uid !== undefined ? rowData.uid : rIndex}
			    onClick={props.onRowSelectedChange.bind(null, rIndex)}
			  >
			  {
			      props.columns.map( (column, cIndex) => {
				  return (
				      <td
					 key={cIndex}
					 className={"col-"+(cIndex+1)}
					>
					{column.renderCellContents(rowData, rIndex)}
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
