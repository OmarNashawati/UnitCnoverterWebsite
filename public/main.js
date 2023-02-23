let catagory =  []

var x = window.matchMedia("(max-width: 799px)")
x.addListener(renderBar)

const start = async () => {
    const getCatagoriesFromDB = async () =>{
        try {
            const {data:{catagories}} =  await axios.get('/api/v1/catagories')
            catagory =  [...catagories]
            renderBar(x)

        } catch (error) {
            console.log(error);
        }
    }
    
    getCatagoriesFromDB()

    // E V E N T S
    const main_container = document.getElementById('main_container')
    main_container.addEventListener('click',function(e){
        const target = e.target
    
        if(target.classList.contains('sidebar_btn')){
            saveSelectedCatagoryToLocalStorage(target.innerHTML)
            setSelectedSidebarButtonAsActive()
            renderUnitsDropdownMenu()
        }
    
        if(target.id == 'convert_btn'){
            converter()
        }
        
        if(target.id == 'swap_btn'){
            swap()
        }
    })
    main_container.addEventListener('change',function(e){
        const target = e.target
        
        if(target.id === 'topbar_btns_container'){
            const selectedOptionIndex = target.selectedIndex
            const selectedOption = target.options[selectedOptionIndex]
            
            saveSelectedCatagoryToLocalStorage(selectedOption.value)
            setSelectedTopbarOptionAsActive()
            renderUnitsDropdownMenu()
        }
    })
}
start()


// Media Queries selector with JavaScript //
function renderBar(x){
    if(x.matches){
        renderTopBar()
        setSelectedTopbarOptionAsActive()
    }else{
        renderSideBar()
        setSelectedSidebarButtonAsActive()
    }

    renderUnitsDropdownMenu()
}


//T O P B A R
function renderTopBar(){
    const topbar_btns_container = document.getElementById('topbar_btns_container')
    const topbarHtml = catagory.map((item)=>{
        return `
            <option value="${item.name}" class="topbar_btn">${item.name}</option>
        `
    }).join(' ')

    topbar_btns_container.innerHTML = topbarHtml
}

function setSelectedTopbarOptionAsActive(){
    const selectedCatagory = getActiveCatagoryFromLocalStorage()

    const topbar_btns_container = document.getElementById('topbar_btns_container')
    const options  = topbar_btns_container.options
    for(i=0 ; i<options.length ; i++ ){
        if(options[i].innerText === selectedCatagory ){
            topbar_btns_container.selectedIndex = i
        }
    }
}

// S I D E B A R
function renderSideBar(){
    const sidebar_btns_container = document.getElementById('sidebar_btns_container')
    const sidebarHtml = catagory.map((item)=>{
        return `
            <div value="${item.name}" class="sidebar_btn">${item.name}</div>
        `
    }).join(' ')

    sidebar_btns_container.innerHTML = sidebarHtml
}

function setSelectedSidebarButtonAsActive(){
    const selectedCatagory = getActiveCatagoryFromLocalStorage()

    const side_bar_btns_list = document.getElementsByClassName('sidebar_btn')
    for(i=0 ; i<side_bar_btns_list.length ; i++ ){
        if(side_bar_btns_list[i].innerHTML === selectedCatagory ){
            side_bar_btns_list[i].classList.add('active')
        }else{
            side_bar_btns_list[i].classList.remove('active')
        }
    }
}


function renderUnitsDropdownMenu(){
    const input_dropdown_catagory = document.getElementById('input_dropdown_catagory')
    const output_dropdown_catagory = document.getElementById('output_dropdown_catagory')
    const selectedCatagory = localStorage.getItem('activeCatagory') || catagory[0].name
    const units = catagory.find((c) => c.name === selectedCatagory).units
    const dropdown_menu_html  = units.map((item) => {
        return `
        <option value="${item[0]}">${item[0]}</option> `
    }).join(' ')

    input_dropdown_catagory.innerHTML = dropdown_menu_html
    output_dropdown_catagory.innerHTML = dropdown_menu_html
}

function saveSelectedCatagoryToLocalStorage(catagory){
    localStorage.setItem('activeCatagory',catagory)
}
function getActiveCatagoryFromLocalStorage(){
    return  localStorage.getItem('activeCatagory')  || catagory[0].name
}

//C O N V E R T E R
async function converter(){
    //getDataFormUI
    const input_value = document.getElementById('input_element').value
    const input_unit = document.getElementById('input_dropdown_catagory').value
    const output_unit = document.getElementById('output_dropdown_catagory').value
    
    //validation
    if(input_value === ''){
        const input_alert_element = document.getElementById('input_alert_element')
        input_alert_element.classList.add('visible')
        input_alert_element.innerText = 'Please inter input value'
        setTimeout(() => {
            input_alert_element.classList.remove('visible')
        },3000)
        return
    }

    //convertData
    try {
        
        if(getActiveCatagoryFromLocalStorage() === 'Temperature'){
            const {data} = await axios(`/api/v1/convertT?catagory=${getActiveCatagoryFromLocalStorage()}&input_value=${input_value}&input_unit=${input_unit}&output_unit=${output_unit}`)        
            document.getElementById('output_element').value = data.result
        }else{ 
            const {data} = await axios(`/api/v1/convert?catagory=${getActiveCatagoryFromLocalStorage()}&input_value=${input_value}&input_unit=${input_unit}&output_unit=${output_unit}`)        
            document.getElementById('output_element').value = data.result
        }
    } catch (error) {
        console.log(error)
    }
}

function swap(){
    //get UI element
    const input_element = document.getElementById('input_element')
    const output_element = document.getElementById('output_element')
    const input_unit_element = document.getElementById('input_dropdown_catagory')
    const output_unit_element = document.getElementById('output_dropdown_catagory')

    //getDataFormUI
    const input = input_element.value
    const output = output_element.value
    const input_unit = input_unit_element.value
    const output_unit = output_unit_element.value
    //swapData
    input_element.value = output
    input_element.innerText = output

    output_element.value = input
    output_element.value = input
    
    input_unit_element.value = output_unit
    output_unit_element.value = input_unit
}