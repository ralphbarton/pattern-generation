import React from 'react';
import './TabStrip.css';

function TabStrip(props) {
  return (<div className="Tab-Strip">{
    props.items.map( item => {
      return (
        <div
            key={item.i}
            className={props.selected === item.i ? "active" : null}
            onClick={()=>{props.onTabSelect(item.i)}}
        >
          {item.a}
        </div>);
      })}
      </div>
    );
  }

  export default TabStrip;
