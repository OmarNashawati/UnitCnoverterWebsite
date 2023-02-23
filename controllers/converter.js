const catagories = require('../catagories')

const getCatagories = async (req,res) => {
    res.status(200).json({catagories})
}

const convert = async (req,res) => {
    const {catagory,input_value,input_unit,output_unit} = req.query

    let result = 0

    if(catagory === 'Temperature'){
        result = convertTemperature(input_value,input_unit,output_unit)
        
    }else if(catagory === 'Angle'){
        result = convertAngle(input_value,input_unit,output_unit)
    }else{
        const selectedCatagory = catagories.find((item) => item.name === catagory)
    
        const in_unit_v = selectedCatagory.units.find((unit) => unit[0] === input_unit)[2] 
        const out_unit_v = selectedCatagory.units.find((unit) => unit[0] === output_unit)[2] 
        const ratio = in_unit_v / out_unit_v
    
        result = input_value * (ratio)
    }

    res.status(200).json({result})
}


function convertTemperature(input_value,input_unit,output_unit){
    const units = [
        ["Celsius",    "°C",'value - 273.15',  'value + 273.15'],
        ["Fahrenheit", "°F", '9/5 * value - 459.67',  '5/9 * (value + 459.67)'],
        ["Kelvin",     "K",   'value * 1'],
        ["Rankine",    "°R",            '9/5 * value',  '5/9 * value'],
        ["Réaumure",   "°Ré",   '4/5 * (value - 273.15)', '5/4 * value + 273.15']
    ]

    let value = eval( input_value )

    if(input_unit === 'Kelvin'){
        value =  eval(units.find((unit) => unit[0] === output_unit)[2])
    }else{
        value = eval(units.find((unit) => unit[0] === input_unit)[3])
        value =  eval(units.find((unit) => unit[0] === output_unit)[2])
    }

    return value
}

function convertAngle(input_value,input_unit,output_unit){
    const units = [
        ["arcminute",          "",   'value * (360*60)',  'value/(360*60)'],
        ["arcsecond",          "", 'value * (360*3600)',  'value/(360*3600)'],
        ["circle",             "",  1],
        ["degree",             "°",  'value*360', 'value/360'],
        ["gon",                "",  'value*400',  'value/400'],
        ["grad",               "",  'value*400',  'value/400'],
        ["mil (Nato)",         "", 'value*6400',  'value/6400'],
        ["mil (Soviet Union)", "", 'value*6000',  'value/6000'],
        ["mil (Sweden)",       "", 'value*6300',  'value/6300'],
        ["radian",             "", 'value * 2 * Math.PI', 'value / (2 * Math.PI)']
      ]

    let value = eval( input_value )

    if(input_unit === 'circle'){
        value =  eval(units.find((unit) => unit[0] === output_unit)[2])
    }else{
        value = eval(units.find((unit) => unit[0] === input_unit)[3])
        value =  eval(units.find((unit) => unit[0] === output_unit)[2])
    }

    return value
}

module.exports = {getCatagories,convert}