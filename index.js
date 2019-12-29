const express = require('express');
const bodyParser = require('body-parser');
const serverPort = 3000;
const restService = express();

restService.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

restService.use(bodyParser.json());

const {Pool, Client} = require('pg');
const connectionString = 'postgressql://postgres:admin@localhost:5432/postgres';
const client = new Client({
    connectionString: connectionString
})

restService.get("/loanCalculation", function (req, res) {
    var debtAmt = req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.debtAmt
        ? req.body.queryResult.parameters.debtAmt
        : "Seems like some problem. Enter another amount again.";
    console.log(debtAmt);
    var nOfMonths = req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.noOfmonths
        ? req.body.queryResult.parameters.noOfmonths
        : "Seems like some problem. Enter no. of months again.";
    console.log(nOfMonths);
    var rate = 15;
    console.log(rate);
    client.connect();
    var installmentAmount;
    client.query('select calc_premium('+debtAmt+','+nOfMonths+','+ rate+')',(err, result) => {

        // client.query('select calc_premium(?, ?, ?)',[debtAmt, nOfMonths, rate] ,(err, res) => {
        // console.log(result);
        // console.log(err, result)
        client.end()
        var varresult = JSON.stringify(result.rows[0])
        varresult = varresult.replace(/(^\[)/, '');
        varresult =  varresult.replace(/(\]$)/, '');
        try {
            var resultObj = JSON.parse(varresult);
        } catch (e) {
            console.log("Error, not a valid JSON string");
        }
        installmentAmount = resultObj["calc_premium"];
        console.log(installmentAmount)


        var finalResult={
            responseId: "598fa6ab-a758-4347-8817-2b321f15ff04-b4ef8d5f",
            queryResult: {
                queryText: "12",
                parameters: {
                    debtAmt: debtAmt,
                    noOfmonths: nOfMonths
                },
                allRequiredParamsPresent: true,
                fulfillmentText: "you will pay "+installmentAmount+" for "+nOfMonths+ " months",
                fulfillmentMessages: [
                    {
                        text: {
                            text: [
                                "you will pay "+installmentAmount+" for "+nOfMonths+ " months"
                            ]
                        }
                    }
                ],
                intent: {
                    name: "projects/fsi-bot-kqelyg/agent/intents/3c7b592b-95f7-4218-b645-9c5aa52069b5",
                    displayName: "Loan Calculation"
                },
                intentDetectionConfidence: 0.01,
                languageCode: "en"
            }
        };
        console.log(finalResult);
  return res.status(200).json(finalResult);
    })
});

// restService.get("/InstallmentSchedule", function (req, res) {
//     var customerId = req.;
//     console.log(customerId);
//     var debtNo = req.;
//     console.log(debtNo);
//     var busdate = req.;
//     console.log(busdate);
//     var rate = req.;
//     console.log(rate);
//     var period = req.;
//     console.log(period);
//     var totalLoanAmt = req.;
//     console.log(totalLoanAmt);
//     var kstAmt = req.;
//     console.log(kstAmt);
//     var kstDate = req.;
//     console.log(kstDate);
//     client.connect();
//     client.query('select last_day(current_date)', (err, res) => {
//         console.log(err, res)
//         client.end()
//     })
//     return res.json.stringify()
// });


// restService.get("/lastDay", function (req, res) {
//   var speech = "inside the lastDay function ....";
//   console.log(speech);
// client.connect();
// client.query('select last_day(current_date)', (err, res) =>{
// console.log(err,res)
// client.end()
// })
//
// return res.json.stringify()
// });

restService.listen(process.env.PORT || serverPort, function () {
    console.log("Server up and listening on port " + serverPort);
});

