import React from 'react';
import './WgTable.css';

import hashObject from 'hash-object';

class WgTable extends React.PureComponent {

    render() {
	return (
	    <table className="WgTable">
	      <thead>
		<tr>
		  {
		      this.props.columnsRendering.map( (column, cIndex) => {
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
		    this.props.rowRenderingData.map( (rowData, rIndex) => {
			let rowKey = rowData.uid !== undefined ? rowData.uid : rIndex;
			if(this.props.hashRowDataToKey){
			    rowKey = hashObject(rowData);
			}
			const rowIsSelected = rIndex === this.props.selectedRowIndex;
			return (
			    <tr className={rowIsSelected ? "selected" : null}
				key={rowKey}
				onClick={this.props.onRowSelectedChange.bind(null, rIndex)}
				>
			      {
				  this.props.columnsRendering.map( (column, cIndex) => {
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
}



export default WgTable;
