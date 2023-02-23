const catagories = require('../catagories')

const getCatagories = async (req,res) => {
    res.status(200).json({catagories})
}

const convert = async (req,res) => {
    const {catagory,input_value,input_unit,output_unit} = req.query

    const selectedCatagory = catagories.find((item) => item.name === catagory)

    const in_unit_v = selectedCatagory.units.find((unit) => unit[0] === input_unit)[2] 
    const out_unit_v = selectedCatagory.units.find((unit) => unit[0] === output_unit)[2] 
    const ratio = in_unit_v / out_unit_v

    const result = input_value * (ratio)

    res.status(200).json({result})
}


const convertTemperature = async (req,res) => {
    const {input_value,input_unit,output_unit} = req.query
    let result = ''

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

    result = value
    res.status(200).json({result})
}

module.exports = {getCatagories,convert,convertTemperature}