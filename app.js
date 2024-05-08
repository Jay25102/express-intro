const express = require('express');
const app = express();

const ExpressError = require('./expressError');

function checkArr(numsList) {
    let results = [];

    for (let i = 0; i < numsList.length; i++) {
        if (numsList[i] === "") {
            return new Error("Separate numbers with commas");
        }
        let newNum = Number(numsList[i]);
        if (Number.isNaN(newNum)) {
            return new Error(`The value of ${numsList[i]} at idx ${i} is not a valid number`);
        }
        results.push(newNum);
    }
    return results;
}

app.get('/mean', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("Must pass variable nums with comma separated list", 400);
    }
    let numsList = req.query.nums.split(',');
    let arr = checkArr(numsList);
    if (arr instanceof Error) {
        throw new ExpressError(arr.message);
    }
    // res.send(`${arr}`);

    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += Number(arr[i]);
    }
    res.send(`Total: ${total}, Length: ${arr.length}, Mean: ${total / (arr.length)}`)
});

app.get('/median', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("Must pass variable nums with comma separated list", 400);
    }
    let numsList = req.query.nums.split(',');
    let arr = checkArr(numsList);
    if (arr instanceof Error) {
        throw new ExpressError(arr.message);
    }

    arr.sort((a, b) => a - b);

    let mid = Math.floor(arr.length / 2);
    let median;

    if (arr.length % 2 === 0) {
        median = ((arr[mid] + arr[mid - 1]) / 2);
    }
    else {
        median = arr[mid];
    }
    res.send(`Median: ${median}`);
});

function createFreqCounter(arr) {
    return arr.reduce(function(acc, next) {
        acc[next] = (acc[next] || 0) + 1;
        return acc;
    }, {});
}

app.get('/mode', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("Must pass variable nums with comma separated list", 400);
    }
    let numsList = req.query.nums.split(',');
    let arr = checkArr(numsList);
    if (arr instanceof Error) {
        throw new ExpressError(arr.message);
    }

    let freqCounter = createFreqCounter(arr);

    let count = 0;
    let mostFreq;

    for (let key in freqCounter) {
        if (freqCounter[key] > count) {
            mostFreq = key;
            count = freqCounter[key];
        }
    }

    res.send(`${+mostFreq}`);
});

app.use(function(req, res, next) {
    const err = new ExpressError("Something went wrong", 400);

    return next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

app.listen(3000, function() {
    console.log("listening on port 3000");
})