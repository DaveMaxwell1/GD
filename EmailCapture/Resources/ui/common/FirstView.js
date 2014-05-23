//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createScrollView();
	var validEmail = false;
	
	//self.backgroundImage = '/images/bg.jpg';
	
	var backgroundImage = Ti.UI.createImageView({
		image: '/images/bg.jpg',
		height: '100%',
		width: '100%'
	});
	self.add(backgroundImage);
	
	var emailView = Ti.UI.createView({
		layout: 'horizontal',
		backgroundColor: '#000000',
		opacity: 0.80,
		height: '200',
		width: '400',
		borderRadius: 10,
		borderWidth: 0
	});
	self.add(emailView);

	var emailLabel = Ti.UI.createImageView({
	  image:'/images/golfDigestLogo.png',
	  opacity: 1
	});

	//var emailLabel = Ti.UI.createLabel({
	//	color: '#ffffff',
	//	text: 'Golf Digest Mailing List',
	//	opacity: 1.0,
	//	font: {fontSize: 22},
	//	left: 20,
	//	top: 20
	//});
	emailView.add(emailLabel);
	
	var actInd = Titanium.UI.createActivityIndicator({
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		left: -160,
		top: 0,
		style: Titanium.UI.iPhone.ActivityIndicatorStyle
	});
	var indicatorAdded = false;

	var emailField = Ti.UI.createTextField({
		keyboardType: Ti.UI.KEYBOARD_EMAIL,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_BEZEL,
		returnKeyType: Titanium.UI.RETURNKEY_GO,
		hintText: 'E-Mail',
		backgroundColor: '#ffffff',
		width: 300,
		opacity: 1.0,
		height: 40,
		top: 20
	});
	emailField.autocorrect = false;
	emailField.addEventListener('change', function(e){
	   
	   validEmail = validateEmail(emailField.value);
	   
	});	
	emailField.addEventListener('return', function() {
    	sendDetails();
	});
		
	emailView.add(emailField);
	
	var sendButton = Ti.UI.createButton({
		left: 20,
		top: 25,
		title: 'Add'
	});
	sendButton.addEventListener('click', function(){

		sendDetails();
			
		
	});
	emailView.add(sendButton);
	
	
	function sendDetails(){
		var emailValue = emailField.value;
		
		if(emailValue != null && emailValue != "" && validEmail){
			
			emailField.hide();
			sendButton.hide();
			
			emailView.add(actInd);
			actInd.show();
			indicatorAdded = true;
			
		    var json = { email: emailValue }; 

			if(!Titanium.Network.online) {
			    var a = Titanium.UI.createAlertDialog({title:'Error', message:'Please re-connect to the internet.'});
				a.show();			
			}else{
				var xhr = Titanium.Network.createHTTPClient();
				xhr.setTimeout(30000);
				//xhr.open('GET', 'https://kev.azure-mobile.net/tables/emails');
				xhr.open('POST', 'https://kev.azure-mobile.net/tables/emails');
				
				//set headers
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				xhr.setRequestHeader("X-ZUMO-APPLICATION", "XXXXXXXX");
				 
				//send request with parameters
				xhr.send(json);
				 
				xhr.onerror = function() {
					//+ this.responseText  for error details
				    var a = Titanium.UI.createAlertDialog({title:'Error', message:'An error occurred sending your details.'});
				    a.show();
					emailField.show();
					sendButton.show();
					
					emailView.remove(actInd);
					actInd.hide();
					indicatorAdded = false;		
					
					emailField.focus();		    
				    
				    
				};
				 
				xhr.onload = function() {
				    var a = Titanium.UI.createAlertDialog({title:'Thank you', message:'Your email has been added.'});
				    a.show();
				    
				    emailField.value = "";
				    
					emailField.show();
					sendButton.show();
					
					emailView.remove(actInd);
					actInd.hide();
					indicatorAdded = false;					    
				};
					
			}
	
			
			
						
		}else{
			var a = Titanium.UI.createAlertDialog({title:'Sorry!', message:'Please enter a valid email address'});
		    a.show();	
		    emailField.focus();	
		}		
		
	}
	
	
	
	//check network
	Titanium.Network.addEventListener('change', function(e)
	{
		//var type = e.networkType;
		var online = e.online;
		//var networkTypeName = e.networkTypeName;
		
		if(!online){
			var a = Titanium.UI.createAlertDialog({title:'Error', message:'Please re-connect to the internet.'});
		    a.show();	
		}

	});	

	return self;
}



function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

module.exports = FirstView;
