
// Wait for the DOM to be ready using jQuery.
$(function(){
  
    // Get the 'canvas' DOM element based on its id using jQuery.
    var canvas = $('#myCanvas')[0],

        // Get the canvas context
        c = canvas.getContext('2d'),
      
        // 'n' is the number of discrete points used to approximate the 
        // continuous math curve defined by the math expression.
        n = 100,
      
        // Define the math "window", which is the visible region in 
        // "math coordinates" that gets projected onto the Canvas.
        xMin = -10,
        xMax = 10,
        yMin = -10,
        yMax = 10,
      
        // Initialize the Math.js library
        math = mathjs(),

        // 'expr' will contain the math expression as a string.
        expr = '',

        // 'scope' defines the variables available inside the math expression.
        scope = {
            x: 0
        },

        tree;

    // Sets the value of 'expr' and re-parses the expression into 'tree'.
    function setExpr(newExpr){
        expr = newExpr;
        tree = math.parse(expr, scope);
    }

    function generatePlane() { //generates x and y axes
        c.beginPath();
        c.moveTo(100, 0);
        c.lineTo(100, 200);
        c.moveTo(0, 100);
        c.lineTo(200, 100);
        c.stroke();
    }

    // Plots the math expression curve on the canvas.
    function drawCurve(yesNo, paint){
        // These variables are used inside the for loop.
        var i, 
        
            // These vary between xMin and xMax
            //                and yMin and yMax.
            xPixel, yPixel,
        
            // These vary between 0 and 1.
            percentX, percentY,
        
            // These are values in math coordinates.
            mathX, mathY;
    
        if (yesNo == true) {
            // Clear the canvas.
            c.clearRect(0, 0, canvas.width, canvas.height);
        }
        c.save();

        // Plot the math expression as a curve using the Canvas API:
    
        // This line of code begins the math curve path definition.
        c.beginPath();

        // 'n' is the number of points used to define the curve, which 
        // consists of (n - 1) straight line segments.
        for(i = 0; i < n; i++) {

            // 'i' varies between 0 and n - 1.
            // 'percentX' varies between 0 and 1.
            percentX = i / (n - 1);

            // 'mathX' varies between 'xMin' and 'xMax'.
            mathX = percentX * (xMax - xMin) + xMin;
            // mathY = f(mathX)
            mathY = evaluateMathExpr(mathX);
      
            // Project 'mathY' from the interval ['yMin', 'yMax']
            // to the interval [0, 1].
            percentY = (mathY - yMin) / (yMax - yMin);
      
            // Flip Y to match canvas coordinates.
            percentY = 1 - percentY;
      
            // Project percentX and percentY to pixel coordinates.
            xPixel = percentX * canvas.width;
            yPixel = percentY * canvas.height;

            c.strokeStyle = paint;

            // The first time this line of code is run, it defines the first point
            // in the path, acting exactly like 'c.moveTo(xPixel, yPixel);'
            // Subsequently, this line of code adds a line segment to the curve path
            // between the previous and current points.
            c.lineTo(xPixel, yPixel);
        }
        // This line of code renders the curve path defined by the 'c.lineTo'
        c.stroke();
        c.restore();
    }

    // Evaluates the current math expression 
    // Returns a Y coordinate
    function evaluateMathExpr(mathX){

        // Set values on the scope visible inside the math expression.
        scope.x = mathX;

        // Evaluate the previously parsed math expression and return it
        return tree.eval();
    }

    //when button is clicked
    $('#btnGraph').click(function () {
        displayDerivative();
        //call function to calculate derivatives

        setExpr($('#inputField').val());
        drawCurve(true, '#ff0f00');

        setExpr($('#derivResult').text());
        drawCurve(false, '#9900CC');

        setExpr($('#deriv2Result').text());
        drawCurve(false, '336600');

        generatePlane();

    });
    /*
    function calculateDerivative(original) {
        var firstDeriv = nerdamer('diff(' + original + ',x)').evaluate();// nerdamer(derivative of input with respect to x);
        //evaluates first derivative result, sets it to div
        var result = firstDeriv.evaluate();
        return result;
    }
    */
    function derivativeAndExtrema() {
        var input = $('#inputField').val(); //input from the inputfield
        var firstDeriv = nerdamer('diff(' + input + ',x)').evaluate();// nerdamer(derivative of input with respect to x);
        //evaluates first derivative result, sets it to div
        var result = firstDeriv.evaluate();
        $('#derivResult').text(result.text());
        //calculates extrema based on derivative and function
        var xExtreme = calculateZero(0.5, input, $('#derivResult')); //calculates zero closest to x = 0.5
        var yExtreme = evaluateMathExpr(extremum);
        /// DO SOMETHING WITH THE EXTREMUM>
       // var f = result.buildFunction();
        //eval second derivative and set it to div by differentiating first derivative
        var secondDeriv = nerdamer('diff(' + firstDeriv + ',x)').evaluate();
        var result2 = secondDeriv.evaluate();
        $('#deriv2Result').text(result2.text());
       // var g = result2.buildFunction();
    };

    var iterations = 0;
    //function applies newton's method, taking in value for previous guess
    function calculateZero(prevGuess, f, deriv) {
        setExpr(f); //sets expression to work on = 2nd parameter of function
        var nextGuess;
        var derivative = deriv;
        var x;
        var y;
        nextGuess = prevGuess - evaluateMathExpr(prevGuess) / derivative(prevGuess); //using newton's formula
        var fvalGuess = evaluateMathExpr(prevGuess);//evaluateMathExpr(nextGuess);
        //console.log(Math.round(nextGuess * 10000) / 10000);
        y = Math.round(fvalGuess * 100000) / 100000; //rounding y val to 6th place
        if (Math.abs(y) < 0.00000001) { //when y val is really, really close to 0
            x = Math.round(nextGuess * 100) / 100; //rounds to nearest third decimal place. Good enough for my purposes.
            console.log("X " + x);
            console.log("Y " + y);
            return nextGuess;
        }
        else if (iterations < 20000 && Math.abs(y) > 0.00000001) { //if function val is not close and
            //if is less than 100th iteration
            ++iterations;
            calculateZero(nextGuess); //repeats newton's method until approximation is close enough
        }
        else {
            console.log(nextGuess);
            return nextGuess; //returns solution or whatever value arrived at after set number of iterations.            
        }
    }
    
    /*
    dummy variables: prevGuess = 0.5
    evaluateMathExpr = (nextGuess) * (nextGuess);
    

    */
});
