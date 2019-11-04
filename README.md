# Visiba Care Embeded Content Helper
Embeded Content Helper is a script to help with the communication between the Visiba Care Service and your embedded content.

---

## Installation
NPM soon to be added.

Grab the code from the dist folder or link to our CDN.

CDN link: https://s3.eu-central-1.amazonaws.com/visibacare.media/static/index.min.js

---

## Usage
The script exposes two methods under the visiba.embeddedWebHelper namespace, one to transfer data and one to exit the the service.

### Method: submitData()

This method is used to send your data to Visiba Care. It accepts an array of EmbeddedWebItems. But can also be called multiple times in the same session. The submitted data will be used in the first drop-in ticket, booking or messaging conversation created.

```javascript
interface EmbeddedWebItem {
  Type: 'NameValue';
  Origin: string;
  Data: any;
}
```

Currently the only supported datatype is NameValue. And it should be sent in an array:
```javascript
[
    {
        "Name": "Thing 1",
        "Value": "Value text here"
    },
    {
        "Name": "Thing2 2",
        "Value": "Value text here"
    }
]
```

Usage example:
```javascript
const dummyData = [{
    "Type": "NameValue",
    "Origin": "https://test.visibacare.com",
    "Data": [
        {
            "Name": "Thing 1",
            "Value": "Value text here"
        },
        {
            "Name": "Thing2 2",
            "Value": "Value text here"
        }
    ]
}];
visiba.embeddedWebHelper.submitData(dummyData);
```

### Method: returnToVisibaCare()
This method is used to programatically return to visibacare. Any valid hyperlink will also work fine.

Usage example:
```javascript
const url = 'https://se.visibacare.com/dummy/booking';
visiba.embeddedWebHelper.returnToVisibaCare(url);
```