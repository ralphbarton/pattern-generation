import React from 'react';

//import WgButton from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';
var Carousel = require('react-responsive-carousel').Carousel;

function Plot_Popout(props) {

    return(
    	<div className={"BeigeWindow "+props.popoutType}>
	  {(()=>{

	      // content 1: "More" for Zoom & Rotate clicked
	      if(props.popoutType === "ZR-More"){
		  return(
		      <div className="A">Section:
			<div className="B">
			  {JSON.stringify(props.Plot.section, null, 2).split(',').map( (str, i) => {return(
			      <div key={i}>{str},</div>
			  );})}
		      </div>
			  </div>
		  );
	      }

	      // content 2: "More" for Zoom & Rotate clicked
	      if(props.popoutType === "syntaxHelp"){

		  return(
		      <Carousel showThumbs={false}>
			<div>
			  Syntax and Inbuilt functions
			  Introducing the density plots formula bar

			  Density Plots are a means to mathematically create all manner of different shapes of gradient. The colouring of these is handled elsewhere; this tab determines gradient shape.

			  Mathematical functions can be entered into the Formula Bar on this tab. For example:

			  f(x, y) = 2x - y
			  A basic “two-dimensional” function.
			  (In mathematical terminology, this is real valued function of two variables)

			  f(x, y) = x^2 + y^2 +x*y + x
			  Another real valued function with more terms

			  f(z) = exp(z^3)
			  A function of the complex value z, defined using the inbuilt exponentiation function.

			  This pop-out provides a guide for what syntax and inbuilt functions are valid in the formula bar
			</div>
			<div>
			  Syntax & basic arithmetic operators

			  The basic arithmetic operations +  -  ×  ÷  are supported as below

			  Addition
			  f(x, y) = x + 1

			  Sub
			  f(x, y) = x - 1

			  Multiplication
			  f(x, y) = 2x + 2*y + x*y
			  The asterisk symbol is normally used, but optional when multiplying by a constant

			  Division
			  f(x, y) = y / x

			  Normal brackets (“parentheses”) can be used in expressions to control the order of calculation

			  f(x, y) = (x+0.4)/ y
			</div>
			<div>
			  Inbuilt functions
			  Natural Logarithm
			  ln(x)
			  can also use log(x)

			  Logarithm to a provided base
			  log(x,y)

			  Exponent
			  exp(x)

			  Sine function
			  Sin(x)

			  Cosine function
			  Cos(x)

			  This list is not comprehensive, all the trigonometric functions are supported: link

			  See Arithmetic functions, on page:
			  http://mathjs.org/docs/reference/functions.html
			</div>
			<div>
			  Other functions I will certainly expect there to be:

			  For complex values
			  Re(z)
			  Im(z)
			  Arg(z)
			  Abs(z)

			  For real values
			  unit(x)
			  ramp(x)
			  square(x)
			  sawtooth(x)

			  For either
			  Pow()
			  Sqrt
			  mod
			</div>
			<div>
			  Inbuilt functions for the complex plane

			  Note that the letter i refers to the imaginary unit with i2 = −1
			</div>
			<div>
			  Some  examples
			  Without needing to understand the underlying maths, some interesting patterns result from using the formulae on this page.
			</div>
			

		      </Carousel>

		  );

	      }

	      return "no content set...";

	  })()}
	    <WgActionLink
	name={"Close"}
	     onClick={props.handleClose}
	    />

	</div>
    );

}

export default Plot_Popout;
