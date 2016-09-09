var express = require('express'); 
var app = express();            
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

// Ethereum
var Web3 = require('web3');
var solc = require('solc');
var TestRPC = require('ethereumjs-testrpc');
var provider = new Web3.providers.HttpProvider("http://localhost:8545")
web3 = new Web3(provider);
web3.eth.defaultAccount=web3.eth.accounts[0];

// Policy Contract
var policyContract = require('./build/contracts/Policy.sol.js');
policyContract.setProvider(provider);

// Firebase
var firebase = require("firebase");
firebase.initializeApp({
  databaseURL: "https://policy-alert.firebaseio.com/"
});
var firebaseRef = firebase.database().ref("/policies");

// Twilio
var config = require('./config');
var twilio = require('twilio')(config.accountSid, config.authToken);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 7272;

var router = express.Router();  

router.get('/', function(req, res) {
    res.json({ message: 'Hooray! welcome to our api!' });   
});

router.get('/transaction/:hash', function(req, res) {
	var trans = web3.eth.getTransaction(req.params.hash);
    res.json({ transactionHash: trans });   
});

router.get('/createPolicyContract/:number', function(req, res) {
	policyContract.new([1,2,3,4,5], req.params.number).then(function(contract) {
		// Persist Contract Address
		res.json({contractAddress:contract.address, transactionHash:contract.transactionHash});
		// Alert Listener
		var alertEvent = contract.Alert({fromBlock: "latest", address: web3.eth.defaultAccount});
		alertEvent.watch(function(error, result) {
			if (error == null) {
				console.log(result);
				var message = "Hi Eric, your beneficiary information was updated.  Did you update it?  If no, repond back with 1.  Otherwise, ignore this alert."
				var number = +13147072216;
				twilio.messages.create({
					body: message,
					to: number,
					from: config.sendingNumber
				}, function(err, data) {
					if (err) {
						console.log(err);
					} else {
					  	console.log(data);
					}
				});
			} else {
				console.log(error);
			}
		});
	});
});

router.get('/getPolicyContract/:hash', function(req, res) {
	var policy = policyContract.at(req.params.hash);
	policy.policyNumber().then(function(value) {
		res.json({policyNumber:value.valueOf()});
	});
});

router.post('/registerPolicy', function(req, res) {
	var email = "*****mith@email.com";
	var phoneNumber = "(***) ***-5640";
	res.json({policyNumber:req.body.policyNumber, email:email, phoneNumber:phoneNumber});
});

router.get('/sendVerificationCode', function(req, res) {
	var code = Math.floor(100000 + Math.random() * 900000);
	var message = "You policy verification code is " + code;
	var number = +16189802256;
	twilio.messages.create({
		body: message,
		to: number,
		from: config.sendingNumber
	}, function(err, data) {
		if (err) {
			res.json({error:err});
		} else {
		  	res.json({success:true});
		}
	});
});

router.post('/validateVerificationCode', function(req, res) {
	// If passes, get the policy info from Firebase
	// post param:  req.body.code
	res.json({success:true});
});

router.post('/updatePolicyInfo', function(req, res) {
	// Update keys on the policy contract
	// Policy logic - if keys contain the fraud keys, send alert

	var c = policyContract.at("0x1579c77badfc232293c8a986327e51e5f676b192");
	c.infoWasUpdated({from: web3.eth.defaultAccount}).then(function(tx) {
		res.json({result:tx});
	});
});

router.get('/receiveMessage', function(req, res) {
	console.log(req.query.Body);
	if (req.query.Body == 'Yes')
	{
		//* To do: workflow for yes and not responding
		res.send('<Response><Message>Got it!  Your carrier has been notified.</Message></Response>');
	}
	else if (req.query.Body == 'No')
	{
		//* To do: workflow for No
		res.send('<Response><Message>Thank you!  You policy is still secured.</Message></Response>');
	}
});


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);