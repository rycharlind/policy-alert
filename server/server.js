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
var consumerPhoneNumber = +16367951705;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 7272;

var router = express.Router();  

router.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our api!' });   
});

router.post('/registerPolicy', function(req, res) {
	var email = "*****mith@email.com";
	var phoneNumber = "(***) ***-5640";
	res.json({policyNumber:req.body.policyNumber, email:email, phoneNumber:phoneNumber});
});

router.get('/sendVerificationCode', function(req, res) {
	var code = Math.floor(100000 + Math.random() * 900000);
	var message = "You policy verification code is " + code;
	twilio.messages.create({
		body: message,
		to: consumerPhoneNumber,
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
	res.json({success:true});
});

var lastCreatedContract;
router.post('/createPolicyContract', function(req, res) {
	policyContract.new([1,2,3,4,5], req.body.policyNumber).then(function(contract) {
		lastCreatedContract = contract.address;

		console.log("sup");
		
		firebaseRef.push().set(req.body);

		var alertEvent = contract.Alert({fromBlock: "latest", address: web3.eth.defaultAccount});
		alertEvent.watch(function(error, result) {
			if (error == null) {
				console.log(result);
				var message = "Hi Tammy, your beneficiary information was updated.  Did you update it?  If no, repond back with 1.  Otherwise, ignore this alert.";
				twilio.messages.create({
					body: message,
					to: consumerPhoneNumber,
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

		res.json({contractAddress:contract.address, transactionHash:contract.transactionHash});
	});
});

router.get('/getPolicyContract/:hash', function(req, res) {
	var policy = policyContract.at(req.params.hash);
	policy.policyNumber().then(function(value) {
		res.json({policyNumber:value.valueOf()});
	});
});

router.post('/updatePolicyInfo', function(req, res) {
	var c = policyContract.at(lastCreatedContract);
	c.infoWasUpdated({from: web3.eth.defaultAccount}).then(function(tx) {
		res.json({result:tx});
	});
});

router.get('/receiveMessage', function(req, res) {
	if (req.query.Body == '1') {
		res.send('<Response><Message>Got it!  Your carrier has been notified.</Message></Response>');
	} else if (req.query.Body == 'No') {
		res.send('<Response><Message>Thank you!  You policy is still secured.</Message></Response>');
	}
});

router.get('/getPolicies', function(req, res) {
	firebaseRef.on("value", function(snapshot) {
		res.json(snapshot.val());
	});
});

router.get('/getPolicy/:policyNumber', function(req, res) {
	firebaseRef.orderByChild("policyNumber").equalTo(req.params.policyNumber).on("value", function(snapshot) {
		res.json(snapshot.val());
	});
});


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);