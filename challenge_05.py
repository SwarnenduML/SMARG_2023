import requests
import datetime
import json

UIDs = ['00.00000413D167','00.000005277469']
objects = [['Temperature', 'Humidity','Brightness','Status','Acceleration x','Acceleration y','Acceleration z','Contact','Transmission strength'],
           []]
unit_of_measure = [['°C','%rF','lx','a','gx','gy','gz','bool','dbm'],
                   ]

url = "http://localhost:3000/devicedata?count=10&uid=00.00000413D167"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)
response_text = response.text
date_start = response_text.find("FPD")+10
tmp_data = response_text[date_start:]
date_end = tmp_data.find("]]")
date_all = tmp_data[:date_end]
date_all = date_all.replace('"',"").split(",")
d = [datetime.datetime.strptime(i,"%Y-%m-%dT%H:%M:%SZ") for i in date_all]
# Remove extra brackets from the string to make it valid JSON
data_str = '[' + tmp_data[date_end+3:-4] + ']'

# Parse the string into a list of lists
data = json.loads(data_str)
sensor_data = [data[i][0] for i in range(len(data))]
print(response.text)
